import { BCC_EMAIL, GOOGLE_EMAIL, RECEIVER_EMAIL } from "$env/static/private";
import transporter from "$lib/email/eb2.server";
import { db } from "$lib/firebase/eb2.server";
import { openai } from "$lib/openai/eb2.server";
import { addDoc, collection } from 'firebase/firestore';
import type { Options } from "nodemailer/lib/mailer";

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

const evaluateFileWithAI = async (cvFile: File, name: string): Promise<string | null> => {
    try {
        const arrayBuffer = await cvFile.arrayBuffer();
        const curriculum = new File([arrayBuffer], cvFile.name, { type: cvFile.type, lastModified: cvFile.lastModified });

        let thread;
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
                                "text": `Mi nombre es ${name}. Por favor, evalúa mi curriculum.`
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

            thread = await openai.beta.threads.create({
                messages: [
                    {
                        "role": "user",
                        "content": `Mi nombre es ${name}. Por favor, evalúa mi curriculum.`,
                        "attachments": [
                            {
                                file_id: file.id,
                                tools: [{ type: "code_interpreter" }]
                            }
                        ]
                    }
                ]
            });
        }

        const run = await openai.beta.threads.runs.createAndPoll(
            thread.id,
            { assistant_id: "asst_PDMHHn6ZRThkMWwBXd8k7HXF" }
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

const evaluateProfileWithAI = async (message: string): Promise<string | null> => {
    try {
        const thread = await openai.beta.threads.create({
            messages: [
                {
                    "role": "user",
                    "content": message,
                }
            ]
        });

        const run = await openai.beta.threads.runs.createAndPoll(
            thread.id,
            { assistant_id: "asst_PDMHHn6ZRThkMWwBXd8k7HXF" }
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
            const cvFile = formData.get("cv") as File | null;

            // Obtener el valor del checkbox
            const noCV = formData.get("noCV") === "on";

            // Solo obtener los valores de los campos select si el checkbox está marcado
            let academicLevel = null, yearsOfExperience = null, currentField = null, awards = null;
            if (noCV) {
                academicLevel = formData.get("academicLevel");
                yearsOfExperience = formData.get("yearsOfExperience");
                currentField = formData.get("currentField");
                awards = formData.get("awards");
            }

            if (!linkedin && (!cvFile || !cvFile?.name) && !noCV) {
                return {
                    error: "There was an error sending the email.",
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
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
                    <h1 style="font-size: 1.3rem; color: #f27931;">
                        Solicitud de Evaluación EB2
                    </h1>
                    <p style="font-size: 16px; margin: 10px 0; color: inherit;">
                        <strong>Nombre Completo:</strong> ${fullName}
                    </p>
                    <p style="font-size: 16px; margin: 10px 0; color: inherit;">
                        <strong>Correo Electrónico:</strong> ${email}
                    </p>
                    <p style="font-size: 16px; margin: 10px 0; color: inherit;">
                        <strong>Teléfono:</strong> ${phone || "No proporcionado"}
                    </p>
                    <p style="font-size: 16px; margin: 10px 0;">
                        <strong>LinkedIn:</strong> 
                        ${linkedin ? `<a href="${linkedin}" target="_blank">${linkedin}</a>` : "No proporcionado"}
                    </p>
                    ${cvFile?.name
                    ? `<p style="font-size: 16px; margin: 10px 0;"><strong>CV adjunto:</strong> ${cvFile?.name}</p>`
                    : "<p style='font-size: 16px; margin: 10px 0;'><strong>CV:</strong> No se adjuntó un archivo</p>"
                }
            `;

            // Si el checkbox está marcado, se añaden los campos adicionales al correo
            if (noCV) {
                html += `
                    <p style="font-size: 16px; margin: 30px 0 10px;"><strong>Nivel Académico:</strong> ${academicLevel}</p>
                    <p style="font-size: 16px; margin: 10px 0;"><strong>Años de Experiencia Profesional:</strong> ${yearsOfExperience}</p>
                    <p style="font-size: 16px; margin: 10px 0;"><strong>Área o Campo Profesional Actual:</strong> ${currentField}</p>
                    <p style="font-size: 16px; margin: 10px 0;"><strong>Reconocimientos o Premios:</strong> ${awards}</p>
                `;
            }

            html += `</div>`;

            // Obtener la evaluación de IA
            let AIEvaluation: string | null = null;
            if (noCV) {
                AIEvaluation = await evaluateProfileWithAI(`
                        Nombre Completo: ${fullName}
                        Nivel Académico: ${academicLevel}
                        Años de Experiencia Profesional: ${yearsOfExperience}
                        Área o Campo Profesional Actual: ${currentField}
                        Reconocimientos o Premios: ${awards}
                    `);
            } else if (cvFile?.name) {
                AIEvaluation = await evaluateFileWithAI(cvFile, fullName as string);
            }

            // Agregar sección de "Evaluación Inicial" si AIEvaluation no es nulo
            if (AIEvaluation) {
                html += `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; margin-top: 2.5rem">
                        <h2 style="font-size: 1.3rem; color: #f27931; margin: 0;">Evaluación Inicial</h2>
                        ${formatAIEvaluation(AIEvaluation)}
                    </div>
                `;
            }

            const message = {
                from: GOOGLE_EMAIL,
                to: RECEIVER_EMAIL,
                cc: [
                    'ElianAlmonte@cantolegal.com',
                ],
                bcc: BCC_EMAIL,
                subject: subject,
                html: html,
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
                date: timestamp
            };

            await addDoc(colReference, docData);

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
    formattedResponse = formattedResponse.replace(/^###\s*(.*)$/gm, "<h3>$1</h3>");

    // Divide el texto en párrafos
    formattedResponse = formattedResponse
        .split(/\n\s*\n|\n\d+\.\s/) // Dividir por líneas en blanco o números de sección
        .map(paragraph => `<p style="font-size: 16px; margin: 10px 0; color: inherit;">${paragraph.trim()}</p>`) // Envolver cada sección en <p>
        .join("");

    return formattedResponse;
}