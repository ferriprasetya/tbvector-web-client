import { Request, Response, NextFunction } from 'express'

export const localsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // User data from session
  res.locals.user = req.session?.user || null
  res.locals.isAuthenticated = !!req.session?.user

  // Flash messages
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.info = req.flash('info')
  res.locals.warning = req.flash('warning')

  // Helper functions
  res.locals.formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  res.locals.formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Current path for active nav
  res.locals.currentPath = req.path

  next()
}
