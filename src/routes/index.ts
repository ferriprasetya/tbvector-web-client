import { Router, RequestHandler } from 'express'
import authRoutes from './auth.routes'
// import deviceRoutes from './device.routes'
// import { coughRoutes } from './cough.routes'
// import { dashboardRoutes } from './dashboard.routes'
// import { coughNotificationRoutes } from './coughNotification.routes'
import recordingsRoutes from './recordings.routes'
import { requireAuth } from '../middlewares/auth.middleware'
import { coughRoutes } from './cough.routes'

const router = Router()

// Public Landing Page
const landingHandler: RequestHandler = (req, res) => {
  res.render('pages/landing', {
    title: 'TBVector - Sistem Monitoring Deteksi TB',
    layout: false,
  })
}
router.get('/landing', landingHandler)

// Auth routes (public)
router.use('/auth', authRoutes)

// Protected Home Page - require authentication
const homeHandler: RequestHandler = (req, res) => {
  res.render('pages/home', {
    title: 'Home',
  })
}
router.get('/', requireAuth, homeHandler)

// Protected routes - require authentication
// router.use('/dashboard', requireAuth, dashboardRoutes)
// router.use('/devices', requireAuth, deviceRoutes)
router.use('/coughs', coughRoutes)
// router.use('/notifications', requireAuth, coughNotificationRoutes)
router.use('/recordings', requireAuth, recordingsRoutes)

// Riwayat Deteksi Detail Page
import { coughController } from '../controllers/cough.controller'
const detailHandler: RequestHandler = coughController.renderCoughEventDetail
router.get('/riwayat-deteksi/:id', requireAuth, detailHandler)

// 404 Handler
router.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - Halaman Tidak Ditemukan',
    error: {
      status: 404,
      message: 'Halaman yang Anda cari tidak ditemukan',
    },
    layout: false,
  })
})

export default router
