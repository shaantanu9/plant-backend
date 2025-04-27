// import { isCelebrateError } from "celebrate";
import { NextFunction, Request, Response } from 'express';

/** handles node process errors */
export const ErrorHandler = function (err: any, req: Request, res: Response, next: NextFunction) {
  console.dir({ error_handler: err }, { depth: 3 });

  // Check if the error is a celebrate error
  //  if (isCelebrateError(err)) {
  //   const firstValidationError = err?.details?.values()?.next()?.value;

  //   if (firstValidationError) {
  //     return res.status(400).json({
  //       success: false,
  //       message: firstValidationError?.message?.replace(/"/g, ""),
  //       statusCode: 400
  //     });
  //   }
  // }

  let error, errorMessage;
  switch (err?.name || err?.joi?.name) {
    case 'ValidatorError':
      console.log(`ValidatorError case ==>`, err);

      return res.status(500).json({
        success: false,
        message: JSON.parse(err.message),
        statusCode: 500,
      });

    case 'ValidationError':
      error = err.details.get('body')?.details?.[0];

      errorMessage = error.message.replace(/"/g, '');

      return res.status(500).json({
        success: false,
        key: error?.context?.key,
        message: errorMessage,
        statusCode: 500,
      });

    case 'CastError':
      console.log(`CastError case ==>`, err);
      return res.status(500).json({
        success: false,
        message: err.message,
        statusCode: 500,
      });

    case 'BadRequestError':
      console.log(`BadRequestError case ==>`, err);
      return res.status(err.status).json({
        success: false,
        message: err.message,
        statusCode: err.statusCode,
      });

    // JsonWebTokenError means token is invalid
    case 'JsonWebTokenError':
      console.log(`JsonWebTokenError case error ==>`, err);
      return res.status(err.status || 401).json({
        success: false,
        message: err.message,
        statusCode: err.statusCode || 401,
      });

    // Zod Error means validation error from zod
    case 'ZodError':
      console.log(`ZodError case error ==>`, err);
      return res.status(500).json({
        success: false,
        message: JSON.parse(err.message),
        statusCode: 500,
      });

    case 'MongoError':
      console.log(`MongoError case error ==>`, err);
      return res.status(500).json({
        success: false,
        message: {
          error: 'MongoError: Something went wrong, please try again later',
          message: err.message,
        },
        statusCode: 500,
      });

    case 'AddAreaError':
      console.log('Failed to add area:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to add area',
        statusCode: 500,
      });

    // list all error that not handled above
    // 1. Joi Error
    // 2. Mongoose Error
    // 3. Error
    // 4. Connect ECONNREFUSED
    // 5. MongoError
    // 6. MongoNetworkError
    // 7. MongoParseError
    // 8. MongoTimeoutError
    // 9. MongoServerSelectionError
    // 10. MongoWriteConcernError
    // 11. Controller Error

    case 'InvalidPasswordError':
      console.log(`InvalidPasswordError case error ==>`, err);
      return res.status(401).json({
        success: false,
        message: err.message,
      });

    case 'MongoServerError':
      console.log(`MongoServerError case error ==> from MongoServerError`, err);
      if (err.code === 11000) {
        return res.status(500).json({
          success: false,
          message: 'Duplicate key error',
        });
      }
      return res.status(500).json({
        success: false,
        message: err.message,
      });

    case 'Error':
      console.dir({ err }, { depth: null });
      error = err.details.get('body')?.details?.[0];
      errorMessage = error?.message?.replace(/"/g, '');

      return res.status(500).json({
        success: false,
        key: error?.context?.key,
        message: errorMessage,
        statusCode: 500,
      });

    default:
      console.log(
        `default case error ==>`,
        'err.name ==>',
        err.name,
        'err.keys ==>',
        Object.keys(err),
        'err ==>',
        err.stringValue,
      );
      console.log(`default case error ==>`, err.name);
      console.log(`default case error ==>`, err.name);
      return res.status(err.status ? err.status : 500).json({
        success: false,
        statusCode: err.status ? err.status : 500,
        message: err || err.errors || err.message ? err.message : 'Internal Server Error',
      });
  }
};
