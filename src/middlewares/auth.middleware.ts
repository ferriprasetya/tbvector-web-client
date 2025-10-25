import { Request, Response, NextFunction } from 'express'

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session?.user) {
    return next()
  }
  req.flash('error', 'Silakan login terlebih dahulu')
  res.redirect('/auth/login')
}

export const requireGuest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session?.user) {
    return next()
  }
  res.redirect('/dashboard')
}

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session?.user?.role === 'admin') {
    return next()
  }
  req.flash('error', 'Akses ditolak. Hanya admin yang diizinkan.')
  res.redirect('/dashboard')
}
