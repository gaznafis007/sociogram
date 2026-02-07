import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export class ResponseHandler {
  static success<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    } as ApiResponse<T>);
  }

  static error(res: Response, message: string, statusCode: number = 500, error?: string): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error || message,
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  static created<T>(res: Response, data: T, message: string = 'Created successfully'): Response {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response, message: string = 'No content'): Response {
    return res.status(204).json({
      success: true,
      message,
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Success'
  ): Response {
    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
