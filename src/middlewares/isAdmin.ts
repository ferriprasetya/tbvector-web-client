import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../utils/HttpException'

/**
 * Middleware to ensure the authenticated user has an 'ADMIN' role.
 * This must be used AFTER the `authenticate` middleware in the route chain.
 */
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // The `authenticate` middleware should have already attached the user object to the request.
    if (!req.user) {
      // This is a safeguard, but should ideally not be reached if `authenticate` runs first.
      throw new HttpException(
        401,
        'Authentication error: User object not found in request.',
      )
    }

    if (req.user.role !== 'ADMIN') {
      throw new HttpException(
        403,
        'Forbidden: This action requires admin privileges.',
      )
    }

    // If the user's role is 'ADMIN', proceed to the next middleware or route handler.
    next()
  } catch (error) {
    next(error)
  }
}
