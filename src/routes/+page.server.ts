import { BCC_EMAIL, GOOGLE_EMAIL, RECEIVER_EMAIL } from "$env/static/private";
import transporter from "$lib/email/eb2.server";
import { db } from "$lib/firebase/eb2.server";
import { openai } from "$lib/openai/eb2.server";
import { addDoc, collection } from 'firebase/firestore';
import type { Options } from "nodemailer/lib/mailer";
import { readPdfText } from 'pdf-text-reader';
import { getTextExtractor } from 'office-text-extractor'

const sendEmail = async (message: Options) => {
    await new Promise((resolve, reject) => {
        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(info);
            }
        });
    });
};

const evaluateFileWithAI = async (cvFile: File, name: string, fieldsInfo?: string): Promise<string | null> => {
    try {
        const arrayBuffer = await cvFile.arrayBuffer();
        const curriculum = new File(
            [arrayBuffer], // File content
            cvFile.name, // File name
            {
                type: cvFile.type, // MIME type
                lastModified: cvFile.lastModified, // Last modified timestamp
            }
        );

        let thread;
        let fileText = '';
        if (cvFile.type.startsWith("image/")) {
            const file = await openai.files.create({
                file: curriculum,
                purpose: "vision",
            });

            thread = await openai.beta.threads.create({
                messages: [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": `Nombre del cliente: ${name}. ${fieldsInfo ? fieldsInfo : ''}`
                            },
                            {
                                "type": "image_file",
                                "image_file": { "file_id": file.id }
                            },
                        ]
                    }
                ]
            });
        } else {
            const file = await openai.files.create({
                file: curriculum,
                purpose: "assistants",
            });

            if (cvFile.type === 'application/pdf') {
                fileText = await readPdfText({ data: arrayBuffer });
                console.log(fileText);
            } else if (cvFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || cvFile.type === 'application/msword') {
                const extractor = getTextExtractor();
                fileText = await extractor.extractText({ input: Buffer.from(arrayBuffer), type: 'buffer' });
                console.log(fileText);
            }

            const messageContent = `${`Nombre del cliente: ${name}.`} ${fieldsInfo ? fieldsInfo : ''} ${fileText ? `Transcripción del currículum: ${fileText}` : ''}`;

            thread = await openai.beta.threads.create({
                messages: [
                    {
                        "role": "user",
                        "content": messageContent,
                        ...(fileText ? {} : {
                            "attachments": [
                                {
                                    file_id: file.id,
                                    tools: [{ type: "code_interpreter" }]
                                }
                            ]
                        })
                    }
                ]
            });
        }

        const run = await openai.beta.threads.runs.createAndPoll(
            thread.id,
            { assistant_id: "asst_uaxC7bMjMKTAvMITFywk2gRK" }
        );

        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(
                run.thread_id
            );

            const lastMessage = messages.data[0].content[0];
            if (lastMessage.type === 'text') {
                return lastMessage.text.value;
            } else {
                console.log(`Last message isn't a text.`);
                return null;
            }
        } else {
            console.log(run.status);
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

const evaluateProfileWithAI = async (fieldsInfo: string): Promise<string | null> => {
    try {
        const thread = await openai.beta.threads.create({
            messages: [
                {
                    "role": "user",
                    "content": fieldsInfo,
                }
            ]
        });

        const run = await openai.beta.threads.runs.createAndPoll(
            thread.id,
            { assistant_id: "asst_uaxC7bMjMKTAvMITFywk2gRK" }
        );

        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(
                run.thread_id
            );

            const lastMessage = messages.data[0].content[0];
            if (lastMessage.type === 'text') {
                return lastMessage.text.value;
            } else {
                console.log(`Last message isn't a text.`);
                return null;
            }
        } else {
            console.log(run.status);
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}


export const actions = {
    default: async ({ request }) => {
        try {
            const formData = await request.formData();
            const fullName = formData.get("fullName");
            const email = formData.get("email");
            const phone = formData.get("phone");
            const linkedin = formData.get("linkedin");
            let cvFile = formData.get("cv") as File | null;

            if (cvFile?.name) {
                // Cambiar el nombre del archivo al nombre completo sin espacios, manteniendo su extensión original
                const newFileName = `${String(fullName).replace(/\s+/g, '')}.${cvFile.name.split('.').pop()}`;

                // Crear un nuevo objeto File con el nombre actualizado
                cvFile = new File([await cvFile.arrayBuffer()], newFileName, {
                    type: cvFile.type,
                    lastModified: cvFile.lastModified,
                });
            }

            // Obtener los valores de los campos select
            const academicLevel = formData.get("academicLevel");
            const yearsOfExperience = formData.get("yearsOfExperience");
            const currentField = formData.get("currentField");
            const awards = formData.get("awards");

            let fieldsInfo = "";

            if ((!cvFile || !cvFile?.name) && (!academicLevel || !yearsOfExperience || !currentField || !awards)) {
                return {
                    error: "The is no cv file and the fields are not complete. Email has not been sent.",
                };
            }

            const subject = `${fullName} quiere una evaluación de su perfil para obtener una Visa EB2`;

            let cvAttachment = null;
            if (cvFile?.name) {
                const arrayBuffer = await cvFile.arrayBuffer();
                cvAttachment = Buffer.from(arrayBuffer);
            }

            // Construir el contenido del email
            let html = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; font-size: 1rem;">
                    <h1 style="font-size: 1.3rem; color: #f27931;">
                        Solicitud de Evaluación EB2
                    </h1>
                    <p style="font-size: inherit; margin: 10px 0; color: inherit;">
                        <strong>Nombre Completo:</strong> ${fullName}
                    </p>
                    <p style="font-size: inherit; margin: 10px 0; color: inherit;">
                        <strong>Correo Electrónico:</strong> ${email}
                    </p>
                    <p style="font-size: inherit; margin: 10px 0; color: inherit;">
                        <strong>Teléfono:</strong> ${phone || "No proporcionado"}
                    </p>
                    <p style="font-size: inherit; margin: 10px 0;">
                        <strong>LinkedIn:</strong> 
                        ${linkedin ? `<a href="${linkedin}" target="_blank">${linkedin}</a>` : "No proporcionado"}
                    </p>
                    ${cvFile?.name
                    ? `<p style="font-size: inherit; margin: 10px 0;"><strong>CV adjunto:</strong> ${cvFile?.name}</p>`
                    : "<p style='font-size: inherit; margin: 10px 0;'><strong>CV:</strong> No se adjuntó un archivo</p>"
                }
            `;

            // Si los campos adicionales están completos, se añaden al correo
            if (academicLevel && yearsOfExperience && currentField && awards) {
                html += `
                    <p style="font-size: inherit; margin: 30px 0 10px;"><strong>Nivel Académico:</strong> ${academicLevel}</p>
                    <p style="font-size: inherit; margin: 10px 0;"><strong>Años de Experiencia Profesional:</strong> ${yearsOfExperience}</p>
                    <p style="font-size: inherit; margin: 10px 0;"><strong>Área o Campo Profesional Actual:</strong> ${currentField}</p>
                    <p style="font-size: inherit; margin: 10px 0;"><strong>Reconocimientos o Premios:</strong> ${awards}</p>
                `;

                fieldsInfo = `
                    Nombre Completo: ${fullName}
                    Nivel Académico: ${academicLevel}
                    Años de Experiencia Profesional: ${yearsOfExperience}
                    Área o Campo Profesional Actual: ${currentField}
                    Reconocimientos o Premios: ${awards}
                `
            }

            html += `</div>`;

            // Obtener la evaluación de IA
            let AIEvaluation: string | null = null;
            if (cvFile?.name) {
                AIEvaluation = await evaluateFileWithAI(cvFile, fullName as string, fieldsInfo);
            }
            else {
                AIEvaluation = await evaluateProfileWithAI(fieldsInfo);
            }

            // Agregar sección de "Evaluación Inicial" si AIEvaluation no es nulo
            if (AIEvaluation) {
                html += `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; font-size: 1rem; margin-top: 2.5rem">
                        <h2 style="font-size: 1.3rem; color: #f27931; margin: 0;">Evaluación Inicial</h2>
                        ${formatAIEvaluation(AIEvaluation)}
                    </div>
                `;
            }

            const message: Options = {
                from: GOOGLE_EMAIL,
                to: RECEIVER_EMAIL,
                subject: subject,
                html: html,
                replyTo: email ? String(email) : undefined,
                attachments: cvAttachment
                    ? [
                        {
                            filename: cvFile?.name,
                            content: cvAttachment,
                            contentType: cvFile?.type,
                        },
                    ]
                    : [],
            };

            // Send copies of the email and save the request if the receiver email doesn't have the devepment value
            if (RECEIVER_EMAIL !== 'sntg.ovalde@gmail.com') {
                message.bcc = BCC_EMAIL;

                // Guardar la solicitud en la base de datos
                const colReference = collection(db, 'solicitudes');
                const timestamp = new Date();

                const docData = {
                    fullName,
                    email,
                    phone,
                    linkedin,
                    academicLevel,
                    yearsOfExperience,
                    currentField,
                    awards,
                    date: timestamp,
                    evaluation: AIEvaluation || ''
                };

                await addDoc(colReference, docData);
            }

            // Enviar el correo
            await sendEmail(message);

            return {
                success: "Email sent.",
            };

        } catch (error) {
            console.error(error);
            return {
                error: "There was an error sending the email.",
            };
        }
    },
};

function formatAIEvaluation(response: string): string {
    // Reemplaza **texto** por <strong>texto</strong> para negritas
    let formattedResponse = response.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Reemplaza ### Título con <h3>Título</h3> para subtítulos
    formattedResponse = formattedResponse.replace(/^###\s*(.*)$/gm, `<h3 style="font-size: 1.2rem;">$1</h3>`);

    // Divide el texto en párrafos
    formattedResponse = formattedResponse
        .split(/\n\s*\n|\n\d+\.\s/) // Dividir por líneas en blanco o números de sección
        .map(paragraph => `<p style="margin: 10px 0; font-size: inherit; color: inherit;">${paragraph.trim()}</p>`) // Envolver cada sección en <p>
        .join("");

    return formattedResponse;
}