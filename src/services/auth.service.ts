import jwt from 'jsonwebtoken';
import { CONFIG } from '../common/config.common';
// import crypto from "crypto";
// import nodemailer, { SendMailOptions } from "nodemailer";

// interface MailerConfig {
//   host: string;
//   port: number;
//   secure: boolean;
//   auth: {
//     user: string;
//     pass: string;
//   };
// }

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  generateToken(data: any, expiresIn: string | number | undefined = CONFIG.JWT.EXPIRES_IN) {
    return jwt.sign(data, CONFIG.JWT.SECRET, {
      expiresIn,
    });
  }

  verifyToken(token: string) {
    try {
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
      }
      return jwt.verify(token, CONFIG.JWT.SECRET);
    } catch (err) {
      return false;
    }
  }
}

export const Auth = AuthService.getInstance();
