import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../utils/HttpException'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response<any, Record<string, any>> => {
  console.error(err)

  if (err instanceof HttpException) {
    return res.status(err.status).json({
      status: 'error',
      message: err.message,
    })
  }

  // Handle Mongoose validation errors, etc.
  if (err.name === 'ValidationError') {
    return res.status(400).json({ status: 'error', message: err.message })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  })
}
