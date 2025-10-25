import { Router } from 'express'
import { deviceController } from '../controllers/device.controller'
import { apiKeyAuth } from '../middlewares/apiKeyAuth'
import { authenticate } from '../middlewares/authenticate'
import { isAdmin } from '../middlewares/isAdmin'

/**
 * Defines the API routes for device management with proper authorization.
 */
class DeviceRoutes {
  public router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // --- Machine-to-Machine Route ---
    // Protected by a static API Key.
    this.router.post('/heartbeat', apiKeyAuth, deviceController.handleHeartbeat)

    // --- User-Facing Routes (Admin Only) ---
    // Protected by JWT (authenticate) and requires ADMIN role (isAdmin).
    this.router.post('/', authenticate, isAdmin, deviceController.createDevice)
    this.router.put(
      '/:id',
      authenticate,
      isAdmin,
      deviceController.updateDevice,
    )
    this.router.delete(
      '/:id',
      authenticate,
      isAdmin,
      deviceController.deleteDevice,
    )

    // --- User-Facing Routes (All Authenticated Users) ---
    // Protected by JWT (authenticate), accessible by any logged-in user.
    this.router.get('/', authenticate, deviceController.getDevices)
    this.router.get('/:id', authenticate, deviceController.getDeviceById)
  }
}

export default new DeviceRoutes().router
