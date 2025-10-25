import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../utils/HttpException'
import { config } from '../config/env'

/**
 * Middleware to protect routes with a static API key.
 * The device must include the API key in the 'X-API-Key' header.
 */
export const apiKeyAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const apiKey = req.header('X-API-Key')
    const expectedApiKey = config.deviceApiKey

    if (!apiKey) {
      throw new HttpException(401, 'Unauthorized: API Key is missing.')
    }

    if (apiKey !== expectedApiKey) {
      throw new HttpException(403, 'Forbidden: Invalid API Key.')
    }

    next()
  } catch (error) {
    next(error)
  }
}
