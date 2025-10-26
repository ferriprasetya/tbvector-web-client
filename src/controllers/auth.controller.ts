import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'

/**
 * Show login page
 */
export const showLogin = (req: Request, res: Response) => {
  // Redirect if already logged in
  if (req.session?.user) {
    return res.redirect('/')
  }

  res.render('auth/login', {
    title: 'Login',
    layout: false,
  })
}

/**
 * Show registration page
 */
export const showRegister = (req: Request, res: Response) => {
  // Redirect if already logged in
  if (req.session?.user) {
    return res.redirect('/')
  }

  res.render('auth/register', {
    title: 'Daftar Akun Baru',
    layout: false,
  })
}

/**
 * Handle login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body

    const result = await authService.login({ email, password })

    // Set session
    req.session.user = {
      id: result.user.id,
      email: result.user.email,
      username: result.user.username,
      name: result.user.name,
      role: result.user.role,
      avatar: result.user.avatar,
    }

    req.flash('success', `Selamat datang kembali, ${result.user.name}!`)
    res.redirect('/')
  } catch (error: any) {
    req.flash('error', error.message || 'Login gagal')
    res.redirect('/auth/login')
  }
}

/**
 * Handle registration
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, username, name, password, confirmPassword } = req.body

    const user = await authService.register({
      email,
      username,
      name,
      password,
      confirmPassword,
    })

    req.flash('success', 'Registrasi berhasil! Silakan login dengan akun Anda.')
    res.redirect('/auth/login')
  } catch (error: any) {
    req.flash('error', error.message || 'Registrasi gagal')

    // Preserve form data on error
    res.render('auth/register', {
      title: 'Daftar Akun Baru',
      layout: false,
      formData: {
        email: req.body.email,
        username: req.body.username,
        name: req.body.name,
      },
      error: [error.message],
    })
  }
}

/**
 * Handle logout
 */
export const logout = (req: Request, res: Response) => {
  const userName = req.session?.user?.name

  req.session.destroy((err) => {
    if (err) {
      req.flash('error', 'Logout gagal')
      return res.redirect('/')
    }
    res.redirect('/auth/login')
  })
}
