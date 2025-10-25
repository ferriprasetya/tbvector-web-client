import { Router } from 'express'
import * as authController from '../controllers/auth.controller'

const router = Router()

// Show login page
router.get('/login', authController.showLogin)

// Handle login
router.post('/login', authController.login)

// Show register page
router.get('/register', authController.showRegister)

// Handle registration
router.post('/register', authController.register)

// Handle logout
router.get('/logout', authController.logout)

export default router
