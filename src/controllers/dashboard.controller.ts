import { Request, Response, NextFunction } from 'express'
import { dashboardService } from '../services/dashboard.service'

class DashboardController {
  /**
   * Handles requests to get dashboard statistics.
   */
  public getStats = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const stats = await dashboardService.getDashboardStats()
      res.status(200).json({
        status: 'success',
        data: stats,
      })
    } catch (error) {
      next(error)
    }
  }
}

export const dashboardController = new DashboardController()
