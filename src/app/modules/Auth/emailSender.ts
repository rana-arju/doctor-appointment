import nodemailer from "nodemailer";
import config from "../../../config";
// Create a test account or replace with real credentials.
const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: config.email.smtpHost, // e.g., smtp.ethereal.email
    port: config.email.smtpPort, // 587 for TLS, 465 for SSL
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email.smtpUser,
      pass: config.email.smtpPassword, // generated ethereal password
      },

  } as nodemailer.TransportOptions);
  const info = await transporter.sendMail({
    from: '"Medical Appointement" <arjurana20@gmail.com>',
    to: email, // list of receivers
    subject: "Reset password link", // Subject line
    //text: "", // plain‑text body
    html,
  });
};

export default emailSender;
