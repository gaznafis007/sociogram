import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';
import { ResponseHandler } from '../utils/response';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new ValidationError(JSON.stringify(errors));
      }
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        ResponseHandler.error(res, error.message, 400);
      } else {
        ResponseHandler.error(res, 'Validation failed', 400);
      }
    }
  };
};
