import { User, IUser } from '../models/user.model'
import { HttpException } from '../utils/HttpException'
import mongoose from 'mongoose'

interface CreateUserDTO {
  email: string
  username: string
  name: string
  password: string
  role?: 'user' | 'admin'
  avatar?: string
  bio?: string
}

interface UpdateUserDTO {
  email?: string
  username?: string
  name?: string
  password?: string
  role?: 'user' | 'admin'
  avatar?: string
  bio?: string
}

interface UserFilters {
  role?: 'user' | 'admin'
  isEmailVerified?: boolean
  search?: string
}

export class UserService {
  /**
   * Create a new user
   */
  async create(data: CreateUserDTO): Promise<IUser> {
    try {
      // Validate required fields
      if (!data.email || !data.username || !data.name || !data.password) {
        throw new HttpException(
          400,
          'Email, username, nama, dan password wajib diisi',
        )
      }

      // Check if email already exists
      const existingEmail = await User.findOne({ email: data.email })
      if (existingEmail) {
        throw new HttpException(400, 'Email sudah terdaftar')
      }

      // Check if username already exists
      const existingUsername = await User.findOne({ username: data.username })
      if (existingUsername) {
        throw new HttpException(400, 'Username sudah digunakan')
      }

      // Create user
      const user = new User({
        email: data.email,
        username: data.username,
        name: data.name,
        password: data.password,
        role: data.role || 'user',
        avatar: data.avatar,
        bio: data.bio,
        isEmailVerified: false,
      })

      await user.save()
      return user
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      if (error instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(error.errors).map((err) => err.message)
        throw new HttpException(400, messages.join(', '))
      }
      throw new HttpException(500, 'Gagal membuat user')
    }
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new HttpException(400, 'ID user tidak valid')
      }

      const user = await User.findById(id)
      if (!user) {
        throw new HttpException(404, 'User tidak ditemukan')
      }

      return user
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(500, 'Gagal mengambil data user')
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      if (!email) {
        throw new HttpException(400, 'Email wajib diisi')
      }

      return User.findOne({ email })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(500, 'Gagal mencari user')
    }
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<IUser | null> {
    try {
      if (!username) {
        throw new HttpException(400, 'Username wajib diisi')
      }

      return User.findOne({ username })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(500, 'Gagal mencari user')
    }
  }

  /**
   * Find all users with optional filters
   */
  async findAll(filters?: UserFilters): Promise<IUser[]> {
    try {
      const query: any = {}

      if (filters?.role) {
        query.role = filters.role
      }

      if (filters?.isEmailVerified !== undefined) {
        query.isEmailVerified = filters.isEmailVerified
      }

      // Search by name, email, or username
      if (filters?.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
          { username: { $regex: filters.search, $options: 'i' } },
        ]
      }

      return User.find(query).sort({ createdAt: -1 })
    } catch (error) {
      throw new HttpException(500, 'Gagal mengambil daftar user')
    }
  }

  /**
   * Update user
   */
  async update(id: string, data: UpdateUserDTO): Promise<IUser> {
    try {
      // Validate ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new HttpException(400, 'ID user tidak valid')
      }

      // Find user
      const user = await User.findById(id)
      if (!user) {
        throw new HttpException(404, 'User tidak ditemukan')
      }

      // Check if email is being changed and already exists
      if (data.email && data.email !== user.email) {
        const existingEmail = await User.findOne({
          email: data.email,
          _id: { $ne: id },
        })
        if (existingEmail) {
          throw new HttpException(400, 'Email sudah digunakan oleh user lain')
        }
      }

      // Check if username is being changed and already exists
      if (data.username && data.username !== user.username) {
        const existingUsername = await User.findOne({
          username: data.username,
          _id: { $ne: id },
        })
        if (existingUsername) {
          throw new HttpException(
            400,
            'Username sudah digunakan oleh user lain',
          )
        }
      }

      // Update fields
      if (data.email) user.email = data.email
      if (data.username) user.username = data.username
      if (data.name) user.name = data.name
      if (data.password) user.password = data.password
      if (data.role) user.role = data.role
      if (data.avatar !== undefined) user.avatar = data.avatar
      if (data.bio !== undefined) user.bio = data.bio

      await user.save()
      return user
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      if (error instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(error.errors).map((err) => err.message)
        throw new HttpException(400, messages.join(', '))
      }
      throw new HttpException(500, 'Gagal mengupdate user')
    }
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    try {
      // Validate ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new HttpException(400, 'ID user tidak valid')
      }

      const result = await User.findByIdAndDelete(id)
      if (!result) {
        throw new HttpException(404, 'User tidak ditemukan')
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(500, 'Gagal menghapus user')
    }
  }

  /**
   * Count users with optional filters
   */
  async count(filters?: UserFilters): Promise<number> {
    try {
      const query: any = {}

      if (filters?.role) {
        query.role = filters.role
      }

      if (filters?.isEmailVerified !== undefined) {
        query.isEmailVerified = filters.isEmailVerified
      }

      return User.countDocuments(query)
    } catch (error) {
      throw new HttpException(500, 'Gagal menghitung jumlah user')
    }
  }

  /**
   * Verify user email
   */
  async verifyEmail(id: string): Promise<IUser> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new HttpException(400, 'ID user tidak valid')
      }

      const user = await User.findById(id)
      if (!user) {
        throw new HttpException(404, 'User tidak ditemukan')
      }

      if (user.isEmailVerified) {
        throw new HttpException(400, 'Email sudah terverifikasi')
      }

      user.isEmailVerified = true
      await user.save()

      return user
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(500, 'Gagal memverifikasi email')
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new HttpException(400, 'ID user tidak valid')
      }

      if (!currentPassword || !newPassword) {
        throw new HttpException(400, 'Password lama dan baru wajib diisi')
      }

      if (newPassword.length < 6) {
        throw new HttpException(400, 'Password baru minimal 6 karakter')
      }

      const user = (await User.findById(id).select('+password')) as IUser
      if (!user) {
        throw new HttpException(404, 'User tidak ditemukan')
      }

      const isPasswordValid = await user.comparePassword(currentPassword)
      if (!isPasswordValid) {
        throw new HttpException(400, 'Password lama salah')
      }

      user.password = newPassword
      await user.save()
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(500, 'Gagal mengubah password')
    }
  }

  /**
   * Update user avatar
   */
  async updateAvatar(id: string, avatarUrl: string): Promise<IUser> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new HttpException(400, 'ID user tidak valid')
      }

      const user = await User.findById(id)
      if (!user) {
        throw new HttpException(404, 'User tidak ditemukan')
      }

      user.avatar = avatarUrl
      await user.save()

      return user
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(500, 'Gagal mengupdate avatar')
    }
  }
}

export const userService = new UserService()
