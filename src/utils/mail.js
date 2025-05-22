import nodemailer from "nodemailer"
import { MAIL_PASS, MAIL_PORT, MAIL_SERVICE, MAIL_USER, NODE_ENV } from "../constants.js";
import ApiError from "./apiError.js";
import Mailgen from "mailgen";

async function sendMail(option) {
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

    const mail = await transporter.sendMail({
        from: '"Nike" <contcat@nike.email>',
        to: option.email,
        subject: option.subject,
        text: emailText,
        html: emailBody,
    });
    try {
        await mail()

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

function verifyEmail(email){
    const mailFormat ={
        body:{
            name:email.name,
            intro:"Welcome to Nike! We're very excited to have you on board",
            action:{
                
            }
        }
    }
}

export { sendMail }
