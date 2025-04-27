import { NextFunction, Request, Response } from 'express';
export const InvalidRoute = (req: Request, res: Response, next: NextFunction) => {
  console.log('invalid route', req.url);
  res.status(404).json({
    success: false,
    message: 'Invalid route',
    statusCode: 404,
  });
};
