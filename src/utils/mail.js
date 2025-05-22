import nodemailer from "nodemailer"
import { MAIL_PASS, MAIL_PORT, MAIL_SERVICE, MAIL_USER, NODE_ENV } from "../constants.js";
import ApiError from "./apiError.js";
import Mailgen from "mailgen";

async function sendMail(option) {
    try {
        const transporter = nodemailer.createTransport({
            host: MAIL_SERVICE,
            port: MAIL_PORT,
            secure: NODE_ENV === "development" ? false : true,
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASS
            }
        });

        const { emailBody, emailText } = mailgenConfig(option.mailFormat)

        await transporter.sendMail({
            from: '"Nike" <contcat@nike.email>',
            to: option.email,
            subject: option.subject,
            text: emailText,
            html: emailBody,
        });
    } catch (error) {
        throw ApiError.serverError(error.message)
    }

}


function mailgenConfig(mailFormat) {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Nike',
            link: 'https://nike.js/'
        }
    })
    const emailBody = mailGenerator.generate(mailFormat);
    const emailText = mailGenerator.generatePlaintext(mailFormat);
    return { emailBody, emailText }
}

function verifyEmail(name, verifyUrl) {
    return {
        body: {
            name: name,
            intro: "Welcome to Nike! We're very excited to have you on board",
            action: {
                instruction: "To get started with nike,please click here.",
                button: {
                    color: "#22bc66",
                    text: "Confirm your account",
                    link: verifyUrl,
                },
            },
            outro: "Need help,or have question? Just reply to this email, we'd love to help. ",
        },
    }

}

export { sendMail, verifyEmail }
