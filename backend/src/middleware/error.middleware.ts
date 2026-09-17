import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '../config/env';
import { sendError } from '../utils/apiResponse';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // Log internal error for server diagnostics
  console.error('[UNHANDLED ERROR]', {
    message: err.message,
    name: err.name,
    path: req.path,
    method: req.method,
    stack: config.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // AppError or Custom Status Error
  if (err.statusCode && err.statusCode < 500) {
    sendError(res, err.statusCode, err.code || 'BAD_REQUEST', err.message, err.details);
    return;
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const issues = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 400, 'VALIDATION_ERROR', 'Input validation failed.', issues);
    return;
  }

  // Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    sendError(
      res,
      409,
      'DUPLICATE_KEY_ERROR',
      `A record with this ${field} already exists.`
    );
    return;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError' && err.errors) {
    const issues = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message,
    }));
    sendError(res, 400, 'DATABASE_VALIDATION_ERROR', 'Database validation constraint violated.', issues);
    return;
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    sendError(res, 400, 'INVALID_IDENTIFIER', `Invalid format for identifier '${err.path}'.`);
    return;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 401, 'INVALID_TOKEN', 'Malformed or invalid authentication token.');
    return;
  }
  if (err.name === 'TokenExpiredError') {
    sendError(res, 401, 'TOKEN_EXPIRED', 'Authentication token has expired. Please log in again.');
    return;
  }

  // Default Internal Server Error
  const statusCode = err.statusCode || 500;
  const message =
    config.NODE_ENV === 'production'
      ? 'An unexpected server error occurred. Please try again later.'
      : err.message || 'Internal Server Error';

  sendError(res, statusCode, 'INTERNAL_SERVER_ERROR', message);
};
