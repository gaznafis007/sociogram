import { Request, Response, NextFunction } from 'express';
import { AppError, ServerError } from '../utils/errors';
import { ResponseHandler } from '../utils/response';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  logger.error('Error occurred:', error);

  if (error instanceof AppError) {
    ResponseHandler.error(res, error.message, error.statusCode);
    return;
  }

  const serverError = new ServerError('An unexpected error occurred');
  ResponseHandler.error(res, serverError.message, 500);
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
