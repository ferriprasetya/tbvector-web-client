import { Router } from 'express'
import { dashboardController } from '../controllers/dashboard.controller'

class DashboardRoutes {
  public router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/stats', dashboardController.getStats)
  }
}

export const dashboardRoutes = new DashboardRoutes().router
