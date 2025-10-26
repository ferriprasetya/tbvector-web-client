import { Request, Response, NextFunction } from 'express'
import { coughService } from '../services/cough.service'

/**
 * Show recordings history page for the current user
 */
export const showRecordingsPage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = 10
    const status = req.query.status as
      | 'POSITIVE_TB'
      | 'NEGATIVE_TB'
      | 'ANALYZING'
      | undefined

    // Get current user ID from session
    const userId = req.user?.id

    // Get cough events filtered by current user
    const result = await coughService.getAllCoughEvents({
      page,
      limit,
      status,
      userId, // Only show current user's records
    })

    res.render('pages/recordings', {
      title: 'Riwayat Deteksi',
      events: result.events,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
      },
      currentStatus: status || 'all',
    })
  } catch (error) {
    next(error)
  }
}
