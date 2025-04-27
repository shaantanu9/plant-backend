import { NextFunction, Request, Response } from 'express';
import { toObjectId } from '@utils';
import { UserEntities } from '../entity';
import { Auth } from '../services/auth.service';
import { logger } from './logger.middleware';
import * as argon2 from 'argon2';
// import { RESPONSE } from "@response";
// import { Socket } from "socket.io";

/**
 * Interface representing a user in the system
 */
interface User {
  _id: string;
  email: string;
  name?: string;
  mobile?: string;
  verified?: boolean;
  defaultLanguage?: string;
  passwordExp?: number | Date;
}

/**
 * Extends Express Request interface to include user property
 */
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Middleware to verify JWT token and attach user to request
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns Promise<void | Response> - Either proceeds to next middleware or returns a response
 */
export const userVerifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId =
    (req.headers['x-request-id'] as string) ||
    `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Get the authorization header
    const authHeader = req.headers['authorization'] as string;

    // Check if authorization header exists
    if (!authHeader) {
      logger.warn('No authorization token provided', { requestId, path: req.path });
      return res.status(403).json({
        auth: false,
        message: 'No token provided',
        requestId,
      });
    }

    // Extract the token (handle both "Bearer token" and just "token" formats)
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    // Verify the token
    const tokenData = await Auth.verifyToken(token);

    // Check if token verification failed
    if (!tokenData || typeof tokenData === 'string') {
      logger.warn('Failed to authenticate token', {
        requestId,
        path: req.path,
        tokenError: typeof tokenData === 'string' ? tokenData : 'Invalid token',
      });
      return res.status(401).json({
        auth: false,
        message: 'Failed to authenticate token',
        requestId,
      });
    }

    // Extract user ID from token data
    const { _id: userId, passwordExp } = tokenData;
    console.log('86', { tokenData });

    // Special case handling for test user
    let tokenId = userId;
    if (tokenId === '66aa46baec902c7c53420ec2') {
      tokenId = '66a6971eac9ede7dde5503b3';
      logger.debug('Using alternative user ID for testing', {
        requestId,
        originalId: userId,
        newId: tokenId,
      });
    }

    console.log('userVerifyJWT', { tokenId });
    // Find user in database
    const user: any = await UserEntities.findOne(
      { _id: toObjectId(tokenId) },
      { _id: 1, name: 1, mobile: 1, email: 1, verified: 1, defaultLanguage: 1, token: 1 },
    );
    console.log('100', user, { check: !user || !user?._id });
    // Check if user exists
    if (!user || !user?._id) {
      console.log('107', user);
      logger.warn('User not found or invalid token', { requestId, userId: tokenId });
      return res.status(403).json({
        auth: false,
        message: 'User not found or invalid token',
        requestId,
      });
    }

    console.log('115', user?.token, user?._id);
    // verify small token string
    const isTokenValid = argon2.verify(user?.token, user?._id);
    console.log('117', isTokenValid);
    if (!isTokenValid) {
      console.log('119', isTokenValid);
      logger.warn('Invalid token', { requestId, userId: tokenId });
      return res.status(403).json({
        auth: false,
        message: 'user is logged in another device',
      });
    }

    console.log('127', user);
    // Add user data to response locals for downstream middlewares/controllers
    res.locals.userId = tokenId;
    res.locals.userData = { ...user, passwordExp };

    console.log('133', res.locals.userData);
    // Log performance metrics
    const processingTime = Date.now() - startTime;
    logger.debug(`JWT verification completed`, {
      requestId,
      userId: tokenId,
      processingTime: `${processingTime}ms`,
    });

    console.log('139', res.locals.userData);
    // Continue to next middleware
    next();
    return;
  } catch (error) {
    logger.error('JWT verification error', {
      requestId,
      path: req.path,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return res.status(500).json({
      auth: false,
      message: 'Internal server error during authentication',
      requestId,
    });
  }
};

// Socket.io JWT verification middleware (currently not in use)
// Keeping this commented out as in the original file

// export const userVerifySoketJWT = async (
//   socket: Socket,
//   next: (err?: Error) => void
// ) => {
//   console.log("102 socket.handshake.headers", socket.handshake.headers);
//   const token = socket.handshake.headers["authorization"] as string;
//   const visitor: any = socket.handshake.headers["visitor"] as string;
//   console.log({ token, visitor });
//   console.log({ token, visitor });
//   console.log({ token, visitor });
//   console.log({ token, visitor });
//   console.log({ token, visitor });
//   // if (visitor) {
//   //   // const visitorId: any = await VisitorEntities.findOne({
//   //   //   "device.fingerprintId": visitor,
//   //   // });

//   //   console.log({ visitorId }, "from Socket Middlware");

//   //   if (visitorId?.token + 5 > 21) {
//   //     return next(new Error("Token Expired"));
//   //   }
//     console.log("119 from ");
//     socket.data.user = { _id: "66aa46baec902c7c53420ec2" };

//     next();
//   }

//   if (!token) {
//     return next(new Error("No token provided."));
//   }

//   const tokendata = await Auth.verifyToken(token);

//   if (!tokendata || typeof tokendata === "string") {
//     return next(new Error("Failed to authenticate token."));
//   }

//   if (tokendata._id) {
//     const getUser: any = await UserEntities.findOne(
//       { _id: toObjectId(tokendata._id) },
//       { _id: 1, name: 1, mobile: 1, email: 1, verified: 1, defaultLanguage: 1 }
//     );

//     if (getUser && getUser?._id) {
//       // if (getUser?.verified === false) {
//       //   logger("User not verified");
//       //   logger({ getUser, _id: getUser?._id, verify: getUser?.verified });

//       //   return next(new Error("User not verified"));
//       // }

//       socket.data.user = { ...getUser, passwordExp: tokendata.passwordExp };
//       return next();
//     }
//   }

//   return next(new Error("Token or User not Correct"));
// };
