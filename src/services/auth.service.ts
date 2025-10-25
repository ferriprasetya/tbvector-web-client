import { User, IUser } from '../models/user.model'
import { HttpException } from '../utils/HttpException'

interface RegisterData {
  email: string
  username: string
  name: string
  password: string
  confirmPassword?: string
}

interface LoginData {
  email: string
  password: string
}

class AuthService {
  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<IUser> {
    const { email, username, name, password, confirmPassword } = userData

    // Validation
    if (!email || !username || !name || !password) {
      throw new HttpException(400, 'Semua field wajib diisi')
    }

    if (confirmPassword && password !== confirmPassword) {
      throw new HttpException(
        400,
        'Password dan konfirmasi password tidak cocok',
      )
    }

    if (password.length < 6) {
      throw new HttpException(400, 'Password minimal 6 karakter')
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email })
    if (emailExists) {
      throw new HttpException(400, 'Email sudah terdaftar')
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ username })
    if (usernameExists) {
      throw new HttpException(400, 'Username sudah digunakan')
    }

    // Create user
    const user = await User.create({
      email,
      username,
      name,
      password,
      role: 'user',
      isEmailVerified: false,
    })

    return user
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginData): Promise<{ user: IUser }> {
    const { email, password } = credentials

    // Validation
    if (!email || !password) {
      throw new HttpException(400, 'Email dan password wajib diisi')
    }

    // Find user with password field
    const user = (await User.findOne({ email }).select('+password')) as IUser

    if (!user) {
      throw new HttpException(401, 'Email atau password salah')
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw new HttpException(401, 'Email atau password salah')
    }

    // Remove password from response
    const userObject = user.toJSON() as IUser
    delete userObject.password

    return { user: userObject }
  }

  /**
   * Find user by ID
   */
  async findById(userId: string): Promise<IUser | null> {
    return User.findById(userId)
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email })
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: Partial<IUser>,
  ): Promise<IUser | null> {
    const allowedUpdates = ['name', 'username', 'bio', 'avatar']
    const updates: any = {}

    Object.keys(data).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = data[key as keyof IUser]
      }
    })

    return User.findByIdAndUpdate(userId, updates, { new: true })
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = (await User.findById(userId).select('+password')) as IUser

    if (!user) {
      throw new HttpException(404, 'User tidak ditemukan')
    }

    const isPasswordValid = await user.comparePassword(currentPassword)
    if (!isPasswordValid) {
      throw new HttpException(400, 'Password saat ini salah')
    }

    if (newPassword.length < 6) {
      throw new HttpException(400, 'Password baru minimal 6 karakter')
    }

    user.password = newPassword
    await user.save()
  }
}

export const authService = new AuthService()
