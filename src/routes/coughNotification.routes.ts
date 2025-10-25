import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate'
import { coughNotificationController } from '../controllers/coughNotification.controller'

class CoughNotificationRoutes {
  public router = Router()
  constructor() {
    this.initializeRoutes()
  }
  private initializeRoutes(): void {
    // Protected by JWT (authenticate), accessible by any logged-in user.
    this.router.use(authenticate)
    this.router.get('/', coughNotificationController.getUnreadNotifications)
    this.router.patch('/:id/read', coughNotificationController.markAsRead)
  }
}

export const coughNotificationRoutes = new CoughNotificationRoutes().router
