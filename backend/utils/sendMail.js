const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  service: "gmail",
  port: process.env.SMTP_PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// const mailOptions = {
//   from: {
//     name: 'Subhodip',
//     address: process.env.USER
//   },
//   to: "subhodipnebu51@gmail.com", // for multiple recipients array of addesses can be used
//   subject: "Sending mail using nodemailer",
//   text: "Plaintext version of the message",
//   html: "<p>HTML version of the message</p>",
// //   cc:
// //   bcc:
// attachments: [
//     {
//         filename: 'FEE Structure.pdf',
//         path:
//     }
// ]
// };

const sendMail = async (to,subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to, // for multiple recipients array of addesses can be used
      subject,
      text,
    };
    console.log(process.env.EMAIL_FROM);

    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent:", info.response);
    return info;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
