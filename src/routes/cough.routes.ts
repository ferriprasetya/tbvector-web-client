import { Router } from 'express'
import { coughController } from '../controllers/cough.controller'
import { apiKeyAuth } from '../middlewares/apiKeyAuth'
import { uploadAudio } from '../middlewares/upload'
import { authenticate } from '../middlewares/authenticate'
import { isAdmin } from '../middlewares/isAdmin'
import { requireAuth } from '../middlewares/auth.middleware'

class CoughRoutes {
  public router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // Endpoint for edge devices to upload initial cough data and audio file.
    // It is protected by a static API Key.
    this.router.post(
      '/device/upload',
      apiKeyAuth,
      uploadAudio,
      coughController.createCoughEvent,
    )

    // Endpoint for web users to upload cough audio
    // Protected by session authentication (already applied at router level)
    this.router.post(
      '/upload',
      requireAuth,
      uploadAudio,
      coughController.createCoughEvent,
    )

    // Endpoint for the analysis system to submit the detection result.
    // It finds the event by its unique coughId and updates it.
    // This is also protected by the same API Key for machine-to-machine communication.
    this.router.patch(
      '/:coughId/result',
      apiKeyAuth,
      coughController.updateCoughEventResult,
    )

    // Endpoint to receive detection results from external ML service
    // Receives record_id, status (0/1), and confidence_score
    // Public endpoint (no authentication required)
    this.router.patch('/detection', coughController.receiveDetectionResult)

    // Protected by JWT (authenticate), accessible by any logged-in user.
    this.router.get('/', authenticate, coughController.getAllCoughEvents)
    this.router.get('/:id', authenticate, coughController.getCoughEventById)
    this.router.post(
      '/:id/notes',
      authenticate,
      coughController.addNoteToCoughEvent,
    )

    // Delete a specific cough event (only admins can delete records)
    this.router.delete(
      '/:id',
      authenticate,
      isAdmin,
      coughController.deleteCoughEvent,
    )
  }
}

export const coughRoutes = new CoughRoutes().router
