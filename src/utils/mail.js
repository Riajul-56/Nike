import nodemailer from 'nodemailer';
import { MAIL_PASS, MAIL_PORT, MAIL_SERVICE, MAIL_USER, NODE_ENV } from '../constants.js';
import ApiError from './apiError.js';
import Mailgen from 'mailgen';

//================================================= Send Mail Fromat =====================================================//
async function sendMail(option) {
  try {
    const transporter = nodemailer.createTransport({
      host: MAIL_SERVICE,
      port: MAIL_PORT,
      secure: NODE_ENV === 'development' ? false : true,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    const { emailBody, emailText } = mailgenConfig(option.mailFormat);

    await transporter.sendMail({
      from: '"Nike" <contcat@nike.email>',
      to: option.email,
      subject: option.subject,
      text: emailText,
      html: emailBody,
    });
  } catch (error) {
    throw ApiError.serverError(error.message);
  }
}

function mailgenConfig(mailFormat) {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'Nike',
      link: 'https://nike.js/',
    },
  });
  const emailBody = mailGenerator.generate(mailFormat);
  const emailText = mailGenerator.generatePlaintext(mailFormat);
  return { emailBody, emailText };
}

//================================================= Verify Email Format =====================================================//

function verifyEmailFormat(name, verifyUrl) {
  return {
    body: {
      name: name,
      intro: "Welcome to Nike! We're very excited to have you on board",
      action: {
        instruction: 'To get started with nike,please click here.',
        button: {
          color: '#22bc66',
          text: 'Confirm your account',
          link: verifyUrl,
        },
      },
      outro: "Need help,or have question? Just reply to this email, we'd love to help. ",
    },
  };
}

//================================================= Forgot  Password Format =====================================================//

function forgotPasswordFormat(name, otp) {
  return {
    body: {
      name: name,
      intro: `Hi ${name}, We received a request to reset a password`,
      action: {
        instruction: 'Using the following One-Time Password (OTP) to reset your password.',
        button: {
          color: '#22bc66',
          text: `${otp}`,
          link: '#',
        },
      },
      outro:
        "If you don't request this, you can ignore this message, for help, just reply to this email.",
    },
  };
}

export { sendMail, verifyEmailFormat, forgotPasswordFormat };
