import { Request, Response, NextFunction } from 'express'
import { coughNotificationService } from '../services/coughNotification.service'

class CoughNotificationController {
  public getUnreadNotifications = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await coughNotificationService.getUnreadNotifications()
      res.status(200).json({ status: 'success', data: result })
    } catch (error) {
      next(error)
    }
  }

  public markAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await coughNotificationService.markNotificationAsRead(
        req.params.id,
        req.user,
      )
      res.status(200).json({ status: 'success', data: result })
    } catch (error) {
      next(error)
    }
  }
}

export const coughNotificationController = new CoughNotificationController()
