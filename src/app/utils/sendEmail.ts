/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import config from '../config';
import { TEmailInfo } from './utils.interface';

// export const sendEmail = async (to: string, html: string) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com.',
//     port: 587,
//     secure: config.NODE_ENV === 'production',
//     auth: {
//       // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//       user: config.smtp_mail,
//       pass: config.smtp_password,
//     },
//   });

//   await transporter.sendMail({
//     from: config.smtp_mail, // sender address
//     to, // list of receivers
//     subject: 'Reset your password within ten mins!', // Subject line
//     text: '', // plain text body
//     html, // html body
//   });
// };

// const logger = require("../controllers/loggerController");

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: config.smtp_mail,
    pass: config.smtp_password,
  },
});

const sendEmail = async (emailData: TEmailInfo) => {
  try {
    const mailOptions = {
      from: config.smtp_mail, // Sender address
      to: emailData.email, // Recipient address
      subject: emailData.subject, // Subject line
      html: emailData.html, // HTML body
    };

    // Check if the recipient email address is defined
    if (!mailOptions.to) {
      throw new Error('No recipient email address defined');
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('info', info.response);
  } catch (error) {
    console.log('error', 'Error occurred while sending email:', error);
    throw error;
  }
};

export default sendEmail;
