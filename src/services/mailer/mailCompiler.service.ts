import { FORMAT } from '../../common/format.common';
import { Mailer } from '../mailer.service';
class mailerServiceClass {
  constructor() {}

  async sendEmailVerification(payload: { email: string; subject: string; html: any }) {
    try {
      const mailOptions = FORMAT.HOST.COMMON_EMAIL_FORMAT({
        email: payload?.email,
        subject: payload?.subject,
        html: payload?.html,
      });

      await Mailer.sendMail(mailOptions);
      return;
    } catch (e) {
      console.log('error in sendOTPToHost: ');
      return;
    }
  }

  async resetPassword(html: string, hostEmail: string, otp: string, name: string) {
    try {
      const mailOptions = FORMAT.HOST.RESET_PASSWORD({ email: hostEmail, otp, name }, null, 'de');

      const response = await Mailer.sendMail(mailOptions);
      return { response, status: true };
    } catch (e) {
      console.log('error in sendOTPToHost: ');
      return { response: e, status: false };
    }
  }

  async passwordChanged(html: string, hostEmail: string, name: string) {
    try {
      const mailOptions = FORMAT.HOST.PASSWORD_CHANGED({ email: hostEmail, name }, null, 'de');
      const response = await Mailer.sendMail(mailOptions);
      return { response, status: true };
    } catch (e) {
      console.log('error in sendOTPToHost: ');
      return { response: e, status: false };
    }
  }

  async sendNewEmployeeMail(payload: { email: string; subject: string; html: any }) {
    try {
      const mailOptions = FORMAT.HOST.COMMON_EMAIL_FORMAT({
        email: payload?.email,
        subject: payload?.subject,
        html: payload?.html,
      });

      await Mailer.sendMail(mailOptions);
      return;
    } catch (e) {
      console.log(`Got error while sending sendNewEmployeeMail(mailCompiler.service.ts) => ${e}`);
      return;
    }
  }

  async sendMail(payload: { email: string; subject: string; html: any }) {
    try {
      if (!payload.email || !payload.subject || !payload.html) {
        throw new Error('Email or subject cannot be empty while sending email');
      }
      const mailOptions = FORMAT.HOST.COMMON_EMAIL_FORMAT({
        email: payload?.email,
        subject: payload?.subject,
        html: payload?.html,
      });

      await Mailer.sendMail(mailOptions);
      return;
    } catch (error) {
      console.log(`Got error while sending email sendMail(mailCompiler.service.ts) => ${error}`);
      return;
    }
  }
}

export const mailerService = new mailerServiceClass();
