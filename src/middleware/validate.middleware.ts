import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

export const validator =
  (
    schema: AnyZodObject | ZodEffects<AnyZodObject, any, any>,
    source: 'body' | 'params' | 'query' = 'body',
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate =
        source === 'body' ? req.body : source === 'params' ? req.params : req.query;
      const validatedData = await schema.parseAsync(dataToValidate);

      // Assign validated data back to request object
      if (source === 'body') {
        req.body = validatedData;
      } else if (source === 'params') {
        req.params = validatedData;
      } else {
        req.query = validatedData;
      }

      next();
      return;
    } catch (error: any) {
      // Return validation error response
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.errors || error.message,
      });
    }
  };
