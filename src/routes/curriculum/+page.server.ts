import { BCC_EMAIL, GOOGLE_EMAIL, RECEIVER_EMAIL } from "$env/static/private";
import transporter from "$lib/email/eb2.server";
import { db } from "$lib/firebase/eb2.server";
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
            let academicLevel = null, yearsOfExperience = null, currentField = null, awards = null, project = null;
            if (noCV) {
                academicLevel = formData.get("academicLevel");
                yearsOfExperience = formData.get("yearsOfExperience");
                currentField = formData.get("currentField");
                awards = formData.get("awards");
                project = formData.get("project");
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
                    <h1 style="background-color: #f27931; font-size: 1.5rem; color: white; padding: 10px; border-radius: 5px;">
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
                    <p style="font-size: 16px; margin: 10px 0;"><strong>Proyecto o Plan que beneficiaría a EE.UU.:</strong> ${project}</p>
                `;
            }

            html += `</div>`;

            const message = {
                from: GOOGLE_EMAIL,
                to: RECEIVER_EMAIL,
                cc: [
                    'katherine@cantolegal.com',
                    'LauraAquino@cantolegal.com',
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
                project,
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