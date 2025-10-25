import { Router } from 'express'
import authRoutes from './auth.routes'
import deviceRoutes from './device.routes'
import { coughRoutes } from './cough.routes'
import { dashboardRoutes } from './dashboard.routes'
import { coughNotificationRoutes } from './coughNotification.routes'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

// Public Home Page
router.get('/', (req, res) => {
  if (req.session?.user) {
    return res.redirect('/dashboard')
  }
  res.render('pages/home', {
    title: 'Home',
    layout: false,
  })
})

// Auth routes (public)
router.use('/auth', authRoutes)

// Protected routes - require authentication
router.use('/dashboard', requireAuth, dashboardRoutes)
router.use('/devices', requireAuth, deviceRoutes)
router.use('/coughs', requireAuth, coughRoutes)
router.use('/notifications', requireAuth, coughNotificationRoutes)

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
