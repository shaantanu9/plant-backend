import { CONFIG } from './config.common';

export const FORMAT = {
  COMMON_EMAIL_FORMAT: ({ email, subject, html }: any) => {
    return {
      email: email,
      subject: subject,
      html: html,
    };
  },
  USER: {
    BOOKING_CONFIRMATION_MAIL_USER: (payload: any) => {
      return {
        email: payload?.email,
        subject: `Booking Accepted`,
        html: `
        <p>Hello ${payload?.userName},</p>
        <p>We would like to inform you that your reservation for the ${payload?.spaceName} has been approved.</p>
        <p>If you have any inquiries or require assistance, please feel free to reach out to our dedicated support team.</p>
        <p>Kind regards,</p>
        <p>The Desk-Now Team</p>`,
      };
    },
  },
  HOST: {
    COMMON_EMAIL_FORMAT: ({ email, subject, html }: any) => {
      return {
        to: email,
        subject: subject,
        html: html,
      };
    },
    WELCOME_OTP: (email: string, subject: string, html: any) => {
      return {
        to: email,
        subject: subject,
        html: html,
      };
    },
    RESET_PASSWORD: (payload: any, req: any, lang = 'de') => {
      return {
        to: payload.email,
        subject: `Reset Password OTP ${payload.otp}`,
        text: 'Reset Password',
        html: `<strong>Reset Password</strong><p>Hi ${payload.name},</p><p>OTP is ${payload.otp}</p><p>Regards,</p><p>DeskClub Team</p>`,
      };
    },
    PASSWORD_CHANGED: (payload: any, req: any, lang = 'de') => {
      return {
        to: payload.email,
        subject: `Password Changed`,
        text: 'Password Changed',
        html: `<strong>Password Changed</strong>
        <p>Hi ${payload.name},</p>
        <p>Your password has been changed successfully.</p>
        <p>Regards,</p>
        <p>DeskClub Team</p>`,
      };
    },

    NEW_EMPLOYEE_MAIL: (payload: any) => {
      return {
        email: payload?.email,
        subject: `Welcome to Desk-Now: Explore Your Partner Properties`,
        html: `<strong>Welcome to Desk-Now!</strong>
        <p>Hi ${payload.name},</p>
        <p>You have been invited to join Desk-Now, the leading platform for hassle-free desk bookings.</p>
        <p>Your account has been added to the property "${payload.locationName}" to enable you to view and book desks in this partner property.</p>
        <p>To get started, please follow these steps:</p>
        <ol>
          <li>Click on the link below to sign up:</li>
          <li>Set your password for your Desk-Now account.</li>
          <li>Explore and book desks in the partner property "${payload.locationName}" and many more.</li>
        </ol>
        <p>Sign Up Link: <a href="${CONFIG.USER_DOMAIN}/signup?name=${payload?.name}&email=${payload?.email}"> Click here </a></p>
        <p>If you have any questions or need assistance, feel free to contact our support team.</p>
        <p>Thank you for joining Desk-Now!</p>
        <p>Regards,</p>
        <p>Desk-Now Team</p>`,
      };
    },

    SUBSCRIPTION_INVOICE_SEND: (payload: any) => {
      return {
        email: payload?.host?.email,
        subject: `Your Subscription Invoice`,
        html: `
        <p>Hi ${payload?.host?.userName},</p>
        <p>We are delighted to inform you that your subscription invoice has been generated.</p>
        <p>You can access your invoice in the following ways:</p>
        <ul>
          <li><a href="${payload?.invoice_pdf}">Download PDF</a></li>
          <li><a href="${payload?.hosted_invoice_url}">View in Browser</a></li>
        </ul>
        <p>If you have any questions or need assistance, please don't hesitate to contact our dedicated support team.</p>
        <p>Thank you for choosing Desk-Now.</p>
        <p>Best regards,</p>
        <p>The Desk-Now Team</p>`,
      };
    },

    HOST_SUBSCRIPTION_CANCEL_MAIL: (payload: any) => {
      return {
        email: payload?.email,
        subject: `Notice: Your Subscription Has Been Cancelled`,
        html: `
        <p>Hello ${payload?.userName},</p>
        <p>We regret to inform you that your subscription has been cancelled as of today.</p>
        <p>If you have any inquiries or require assistance, please feel free to reach out to our dedicated support team.</p>
        <p>We appreciate your past association with Desk-Now.</p>
        <p>Kind regards,</p>
        <p>The Desk-Now Team</p>`,
      };
    },
  },
  EVENT: {},
  BOOKING: {},
};
