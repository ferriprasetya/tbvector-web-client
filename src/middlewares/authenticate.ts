import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User, IUser } from '../models/user.model'
import { config } from '../config/env'
import { HttpException } from '../utils/HttpException'

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(
      new HttpException(
        401,
        'You are not logged in. Please log in to get access.',
      ),
    )
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { id: string }
    const currentUser = await User.findById(decoded.id)

    if (!currentUser) {
      return next(
        new HttpException(
          401,
          'The user belonging to this token does no longer exist.',
        ),
      )
    }

    req.user = currentUser
    next()
  } catch (_error) {
    return next(new HttpException(401, 'Invalid token. Please log in again.'))
  }
}
