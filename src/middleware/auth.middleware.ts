import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthenticationError } from '../utils/errors';
import { ResponseHandler } from '../utils/response';
import { AuthRequest } from '../types';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AuthenticationError('Authorization header is missing');
    }

    const token = authService.extractTokenFromHeader(authHeader);
    const payload = authService.verifyToken(token);

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      ResponseHandler.error(res, error.message, error.statusCode);
    } else {
      ResponseHandler.error(res, 'Authentication failed', 401);
    }
  }
};
