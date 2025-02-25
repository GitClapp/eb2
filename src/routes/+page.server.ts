import { BCC_EMAIL, GOOGLE_EMAIL, RECEIVER_EMAIL } from "$env/static/private";
import transporter from "$lib/email/eb2.server";
import { db } from "$lib/firebase/eb2.server";
import { openai } from "$lib/openai/eb2.server";
import { addDoc, collection } from 'firebase/firestore';
import type { Options } from "nodemailer/lib/mailer";
import { getTextExtractor } from 'office-text-extractor';
import EmailTemplate from "$lib//email/EmailTemplate.svelte";
import juice from "juice";
import type Mail from "nodemailer/lib/mailer";
import PuppeteerHTMLPDF from "puppeteer-html-pdf";


async function htmlToPDF(htmlString: string): Promise<File> {
    try {
        const htmlPDF = new PuppeteerHTMLPDF();
        htmlPDF.setOptions({ format: "A4" });

        // Generate PDF buffer from HTML string
        const pdfBuffer = await htmlPDF.create(htmlString);

        // Create a File object from the buffer
        const pdfFile = new File([pdfBuffer], "document.pdf", { type: "application/pdf" });

        return pdfFile;
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
}

// Log timing utility.
let startTime = Date.now();
const logTime = (task: string) => {
    const elapsed = Date.now() - startTime;
    console.log(`${task} was completed after ${elapsed / 1000} seconds.`);
};

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
        logTime('Array buffer creation');

        const curriculum = new File(
            [arrayBuffer],
            cvFile.name,
            {
                type: cvFile.type,
                lastModified: cvFile.lastModified,
            }
        );

        let thread;
        let fileText = '';
        if (cvFile.type.startsWith("image/")) {
            const file = await openai.files.create({
                file: curriculum,
                purpose: "vision",
            });
            logTime('Image file creation');

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
            logTime('Thread creation for image');
        } else {
            const extractor = getTextExtractor();
            fileText = await extractor.extractText({ input: Buffer.from(arrayBuffer), type: 'buffer' });
            logTime('Text extraction');

            const file = fileText ? undefined : await openai.files.create({
                file: curriculum,
                purpose: "assistants",
            });
            logTime('File creation for assistants');

            const messageContent = `${`Nombre del cliente: ${name}.`} ${fieldsInfo ? fieldsInfo : ''} ${fileText ? `Transcripción del currículum: ${fileText}` : ''}`;

            thread = await openai.beta.threads.create({
                messages: [
                    {
                        "role": "user",
                        "content": messageContent,
                        ...(file ? {
                            "attachments": [
                                {
                                    file_id: file.id,
                                    tools: [{ type: "code_interpreter" }]
                                }
                            ]
                        } : {})
                    }
                ]
            });
            logTime('Thread creation for text');
        }

        const run = await openai.beta.threads.runs.createAndPoll(
            thread.id,
            { assistant_id: "asst_uaxC7bMjMKTAvMITFywk2gRK" }
        );
        logTime('Thread run and poll');

        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(run.thread_id);
            logTime('Messages list retrieval');

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
};

const evaluateProfileWithAI = async (name: string, fieldsInfo: string): Promise<string | null> => {
    try {
        const thread = await openai.beta.threads.create({
            messages: [
                {
                    "role": "user",
                    "content": `Nombre del cliente: ${name}. ${fieldsInfo}`,
                }
            ]
        });
        logTime('Thread creation');

        const run = await openai.beta.threads.runs.createAndPoll(
            thread.id,
            { assistant_id: "asst_uaxC7bMjMKTAvMITFywk2gRK" }
        );
        logTime('Thread run and poll');

        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(run.thread_id);
            logTime('Messages list retrieval');

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
};

function formatAIEvaluation(response: string): string {
    // Replace **text** with <strong>text</strong>
    let formattedResponse = response.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Replace ### Title with an h3 tag
    formattedResponse = formattedResponse.replace(/^###\s*(.*)$/gm, `<h3 style="font-size: 1.2rem;">$1</h3>`);
    // Wrap paragraphs
    formattedResponse = formattedResponse
        .split(/\n\s*\n|\n\d+\.\s/)
        .map(paragraph => `<p style="margin: 10px 0;">${paragraph.trim()}</p>`)
        .join("");
    return formattedResponse;
}

export const actions = {
    default: async ({ request }) => {
        startTime = Date.now();

        try {
            const formData = await request.formData();
            logTime('Form data retrieval');

            const fullName = formData.get("fullName") as string;
            const email = formData.get("email") as string;
            const phone = formData.get("phone") as string;
            const country = formData.get("country") as string;
            const linkedin = formData.get("linkedin") as string;
            let cvFile = formData.get("cv") as File | null;

            if (cvFile?.name) {
                // Rename the file to the full name without spaces, preserving its extension.
                const newFileName = `${fullName.replace(/\s+/g, '')}.${cvFile.name.split('.').pop()}`;
                cvFile = new File([await cvFile.arrayBuffer()], newFileName, {
                    type: cvFile.type,
                    lastModified: cvFile.lastModified,
                });
            }
            logTime('File processing');

            let academicLevel = formData.get("academicLevel") as string;
            let yearsOfExperience = formData.get("yearsOfExperience") as string;
            let currentField = formData.get("currentField") as string;
            let awards = formData.get("awards") as string;

            let fieldsInfo = "";
            if ((!cvFile || !cvFile?.name) && (!academicLevel || !yearsOfExperience || !currentField || !awards)) {
                return { error: "No se adjuntó un CV y los campos adicionales no están completos. No se envió el email." };
            }
            logTime('Field validation');

            const subject = `${fullName} | Solicitud de evaluación para visa EB-2`;

            let cvAttachment = null;
            if (cvFile?.name) {
                const arrayBuffer = await cvFile.arrayBuffer();
                cvAttachment = Buffer.from(arrayBuffer);
            }
            logTime('Attachment processing');

            if (academicLevel && yearsOfExperience && currentField && awards) {
                fieldsInfo = `
                    Nivel Académico: ${academicLevel}.
                    Años de Experiencia Profesional: ${yearsOfExperience}.
                    Área o Campo Profesional Actual: ${currentField}.
                    Reconocimientos o Premios: ${awards}.
                    País donde reside actualmente: ${country}.
                `;
            }

            // Get AI evaluation either from the CV file or from the profile.
            let AIEvaluation: string | null = null;
            if (cvFile?.name) {
                AIEvaluation = await evaluateFileWithAI(cvFile, fullName, fieldsInfo);
            } else {
                AIEvaluation = await evaluateProfileWithAI(fullName, fieldsInfo);
            }
            logTime('AI evaluation');

            const formattedAIEvaluation = AIEvaluation ? formatAIEvaluation(AIEvaluation) : "";

            // Render the email HTML using the EmailTemplate component's SSR API.
            // Casting to any to access the static render() method.
            let { html, css } = (EmailTemplate as any).render({
                fullName,
                email,
                phone,
                country,
                linkedin,
                cvFileName: cvFile?.name || "",
                academicLevel,
                yearsOfExperience,
                currentField,
                awards,
                aiEvaluation: formattedAIEvaluation
            });
            const htmlWithStyles = `<style>${css.code}</style>${html}`;
            html = juice(htmlWithStyles);
            logTime('Email content rendered via Svelte');

            const emailAttachments: Mail.Attachment[] = [];
            if (cvAttachment) {
                emailAttachments.push({
                    filename: cvFile?.name,
                    content: cvAttachment,
                    contentType: cvFile?.type,
                });
            }
            if (formattedAIEvaluation) {
                emailAttachments.push({
                    filename: "Evaluación.pdf",
                    content: Buffer.from(await (await htmlToPDF(formattedAIEvaluation)).arrayBuffer()),
                    contentType: "application/pdf",
                });
            }
            const message: Options = {
                from: GOOGLE_EMAIL,
                to: RECEIVER_EMAIL,
                subject: subject,
                html: html,
                replyTo: email,
                attachments: emailAttachments,
            };
            logTime('Message construction');

            if (RECEIVER_EMAIL !== 'sntg.ovalde@gmail.com') {
                message.cc = ['AlejandraGrullon@cantolegal.com'];
                message.bcc = BCC_EMAIL;

                const colReference = collection(db, 'solicitudes');
                const timestamp = new Date();
                const docData = {
                    fullName,
                    email,
                    phone,
                    linkedin,
                    country,
                    academicLevel,
                    yearsOfExperience,
                    currentField,
                    awards,
                    date: timestamp,
                    evaluation: formattedAIEvaluation
                };
                await addDoc(colReference, docData);
            }
            logTime('Database save');

            await sendEmail(message);
            logTime('Email sending');

            return { success: "Email sent." };

        } catch (error) {
            console.error(error);
            return { error: "There was an error sending the email." };
        }
    },
};