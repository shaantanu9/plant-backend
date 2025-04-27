/**
 * @file mailer.service
 * @description defines mailer methods
 * @created
 * @author Soobati
 */
import Nodemailer from "nodemailer";
import { CONFIG } from "../common/config.common";
const sesTransport = require("nodemailer-ses-transport");

class MailerClass {
  private sender: string;
  private transporter: any;
  constructor(senderName: string) {
    if (process.env.NODE_ENV === "prod") {
      console.log(
        "FLAG - currently inside prod email service: ",
        process.env.NODE_ENV
      );
      this.sender = `${senderName}<${CONFIG.AWS.SES_EMAIL}>`;
      this.transporter = Nodemailer.createTransport(
        sesTransport({
          accessKeyId: CONFIG.AWS.SES_ACCESS_KEY,
          secretAccessKey: CONFIG.AWS.SES_SECRET_KEY,
          region: CONFIG.AWS.SES_REGION,
        })
      );
    } else {
      console.log(
        "FLAG - currently inside email service: ",
        process.env.NODE_ENV
      );

      this.sender = `${senderName}<${CONFIG.AWS.SES_EMAIL}>`;
      this.transporter = Nodemailer.createTransport(
        sesTransport({
          accessKeyId: CONFIG.AWS.SES_ACCESS_KEY,
          secretAccessKey: CONFIG.AWS.SES_SECRET_KEY,
          region: CONFIG.AWS.SES_REGION,
        })
      );
    }
  }

  /**
   * sends the email to the reciever
   * @param mailOptions - consists the reciever, subject, and text
   */
  async sendMail(mailOptions: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    from?: string;
    cc?: string;
    attachments?: any;
    alternatives?: any;
  }): Promise<any> {
    try {
      if (!mailOptions.to)
        Promise.reject("Email reciever not provided in the mailer options");
      if (!mailOptions.subject)
        Promise.reject("Email subject not provided in the mailer options");
      if (!mailOptions.text && !mailOptions.html)
        Promise.reject("Email content not provided in the mailer options");
      // add sender to mail options
      mailOptions["from"] = this.sender;

      if (process.env.NODE_ENV !== "_development") {
        const emailSentResponse = await this.transporter.sendMail(mailOptions);
        if (emailSentResponse) {
          console.log(
            `EMAIL [messageId: ${emailSentResponse.messageId}] TO [recieptens: ${emailSentResponse.envelope.to}]`
          );
          return true;
        } else return false;
      } else return true;
    } catch (error) {
      console.error(`we have an error in sendMail utility ==> ${error}`);
    }
  }
}

export const Mailer = new MailerClass("Soobati Support");

// clg()

// Mailer.sendMail({
//   to: "bochareindumati@gmail.com",
//   subject: "Hello",
//   text: "Testing some Mailgun awesomeness!",
//   html: "<h1>Testing some Mailgun awesomeness!</h1>",
//   from: "Soobati Support<dee@soobati.com>",
// });
