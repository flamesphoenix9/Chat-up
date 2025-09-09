const { createTransport } = require("nodemailer");
const config = require("../config");
const logger = require("../logger");

class emailService {
  constructor() {
    this.transporter = createTransport({
      service: config.email.service,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
      secure: true,
    });
    this.transporter
      .verify()
      .then(() => logger.info("Transporter verified"))
      .catch(() => logger.warn("Email service ran into a problem"));
  }
  async sendMail({ to, subject, text, html }) {
    try {
      const mail = this.transporter.sendMail({
        from: `"Chat App" || ${config.email.sender}`,
        to,
        subject,
        text,
        html,
      });
      logger.info(`Email sent to ${to}`);
      return mail;
    } catch (err) {
      throw err;
    }
  }

  async sendSignUpMail({ to, code }) {
    const subject = "Sign Up Successful";
    const html = `<h2>Welcome to Chat up, please verify your account</h2> 
    <h3>Your otp is ${code}, expires in 15 minutes</h3>`;
    const text = `Welcome to Chat up, please verify your account
    Your otp is ${code}, expires in 15 minutes`;

    return this.sendMail({ to, subject, html, text });
  }

  async otpMail({ to, code, verificationType }) {
    const subject = `${verificationType} your Account details`;
    const html = `<h3>Your otp is ${code}, expires in 15 minutes</h3>`;
    const text = `Youtr otp is ${code}, expires in 15 minutes`;
    return this.sendMail({ to, subject, html, text });
  }

  async resetPasswordSuccess({ to }) {
    const subject = "Password Reset Successfully";
    const html = `<p>Password reset successfully for ${to}</p>`;
    const text = `Password reset successfully for ${to} `;
    return this.sendMail({ to,subject, html, text });
  }
}

module.exports =  new emailService();

// const transporter = createTransport({
//   service: config.email.service,
//   auth: {
//     user: config.email.user,
//     pass: config.email.pass,
//   },
//   secure: true,
// });

// const sendmail = async (to, subject, text, html) => {
//   try {
//     await transporter.sendMail({
//       from: `"Chat App" | ${config.email.sender}`,
//       to,
//       subject,
//       text,
//       html,
//     });
//     logger.info(`Email sent to ${to}`);
//     return mail;
//   } catch (error) {
//     logger.error(`Email sending maill to ${to}`);
//     throw error;
//   }
// };

// module.exports = { sendmail };
