import nodemailer from "nodemailer";
import { MailMeta } from "../types/mailer-types";

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

    const FROM_ADDRESS = "aRealEmail@gmail.com";

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: FROM_ADDRESS,
          pass: process.env.EMAIL_PASSWORD
        }
      });

    const mailOptions = {
        from: FROM_ADDRESS,
        to: options.to,
        subject: options.subject,
        text: options.message,
        html: options.inviteLinkHTML
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            console.log(`[error sending mail] to=${mailOptions.to} error=${error}`)
        } else {
            console.log(`Email sent: to=${mailOptions.to}  info=${info.response}`);
            //Uncomment for testing
            //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
    });
}

export default mail;