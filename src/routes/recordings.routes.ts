import { Router } from 'express'
import * as recordingsController from '../controllers/recordings.controller'

const router = Router()

// Show recordings history page
router.get('/', recordingsController.showRecordingsPage)

export default router
