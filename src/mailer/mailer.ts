import nodemailer from "nodemailer";
import { MailMeta } from "../types/mailer-types";
import winston from "winston";

const LOGGER = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: './logs/service.log' })
    ]
  });

const mail = async (options: MailMeta) => {

    // Uncomment when testing
    // let testAccount = await nodemailer.createTestAccount();

    // let transporter = nodemailer.createTransport({
    //     host: "smtp.ethereal.email",
    //     port: 587,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //         user: testAccount.user, // generated ethereal user
    //         pass: testAccount.pass, // generated ethereal password
    //     },
    // });

    const FROM_ADDRESS = process.env.WEB3CON_EMAIL_USERNAME;

    /**
     * Note: To use the mailer locally on your machine with a gmail account, you must first enable the "less secure app" toggle in your account
     * by visiting https://myaccount.google.com/lesssecureapps and flipping the switch.  This technique is only recommended for users running this script
     * locally on their machines and is not intended to be run in a production environment
     */
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: FROM_ADDRESS,
          pass: process.env.WEB3CON_EMAIL_PASSWORD
        }
      });

    const mailOptions = {
        from: FROM_ADDRESS,
        to: options.to,
        subject: options.subject,
        html: options.inviteLinkHTML
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            LOGGER.error(`[Error sending mail] from=${mailOptions.from}, to=${mailOptions.to}, error=${error}`)
        } else {
            LOGGER.info(`[Email sent] from=${mailOptions.from}, to=${mailOptions.to},  info=${info.response}`);
            //Uncomment for testing
            //LOGGER.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
    });
}

export default mail;