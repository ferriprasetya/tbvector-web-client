import { HttpException } from './HttpException'

/**
 * Custom error classes for better error handling
 */

export class ValidationError extends HttpException {
  constructor(message: string) {
    super(400, message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends HttpException {
  constructor(message: string = 'Resource tidak ditemukan') {
    super(404, message)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(401, message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends HttpException {
  constructor(message: string = 'Akses ditolak') {
    super(403, message)
    this.name = 'ForbiddenError'
  }
}

export class ConflictError extends HttpException {
  constructor(message: string) {
    super(409, message)
    this.name = 'ConflictError'
  }
}

export class InternalServerError extends HttpException {
  constructor(message: string = 'Internal server error') {
    super(500, message)
    this.name = 'InternalServerError'
  }
}

/**
 * Helper function to handle async route errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * AppError alias for backward compatibility
 */
export const AppError = HttpException
