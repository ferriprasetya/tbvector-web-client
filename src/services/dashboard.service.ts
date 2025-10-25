import { CoughEvent } from '../models/cough.model'
import Device from '../models/device.model'

class DashboardService {
  /**
   * Retrieves aggregate statistics for display on the dashboard.
   * Executes multiple database queries in parallel for efficiency.
   * @returns An object containing dashboard statistics.
   */
  public async getDashboardStats() {
    // Set the time limit for the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    // Execute all query promises concurrently
    const [positiveLast24h, totalLast24h, activeDevices, totalDevices] =
      await Promise.all([
        // 1. Count positive TB cough events in the last 24 hours
        CoughEvent.countDocuments({
          status: 'POSITIVE_TB',
          createdAt: { $gte: twentyFourHoursAgo },
        }),
        // 2. Count all cough events in the last 24 hours
        CoughEvent.countDocuments({
          createdAt: { $gte: twentyFourHoursAgo },
        }),
        // 3. Count devices currently with ONLINE status
        Device.countDocuments({ status: 'ONLINE' }),
        // 4. Count all registered devices
        Device.countDocuments(),
      ])

    return {
      positiveLast24h,
      totalLast24h,
      activeDevices,
      totalDevices,
    }
  }
}

export const dashboardService = new DashboardService()
