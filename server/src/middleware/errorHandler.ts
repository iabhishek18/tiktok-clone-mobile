import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(public statusCode: number, public code: string, message: string) { super(message); }
  static notFound(resource: string, id: string) { return new AppError(404, 'NOT_FOUND', `${resource} '${id}' not found`); }
  static badRequest(message: string) { return new AppError(400, 'BAD_REQUEST', message); }
  static forbidden(message: string) { return new AppError(403, 'FORBIDDEN', message); }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, error: { code: err.code, message: err.message } });
    return;
  }
  console.error('[Error]', err);
  res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } });
}
