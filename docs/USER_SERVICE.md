# User Service Documentation

## Overview
User Service mengelola operasi CRUD dan fungsi terkait user dengan proper error handling menggunakan HttpException.

## Features
- ✅ Comprehensive error handling
- ✅ Validation untuk semua input
- ✅ MongoDB ObjectId validation
- ✅ Duplicate checking (email & username)
- ✅ Search functionality
- ✅ Email verification support
- ✅ Password change with validation
- ✅ Avatar management

## Methods

### `create(data: CreateUserDTO): Promise<IUser>`
Membuat user baru dengan validasi lengkap.

**Parameters:**
```typescript
{
  email: string          // Required, unique
  username: string       // Required, unique
  name: string          // Required
  password: string      // Required, min 6 chars
  role?: 'user' | 'admin'  // Optional, default: 'user'
  avatar?: string       // Optional
  bio?: string          // Optional
}
```

**Throws:**
- `400` - Email, username, nama, dan password wajib diisi
- `400` - Email sudah terdaftar
- `400` - Username sudah digunakan
- `400` - Validation errors
- `500` - Gagal membuat user

**Example:**
```typescript
const user = await userService.create({
  email: 'john@example.com',
  username: 'johndoe',
  name: 'John Doe',
  password: 'password123',
  role: 'user'
})
```

---

### `findById(id: string): Promise<IUser>`
Mencari user berdasarkan ID.

**Throws:**
- `400` - ID user tidak valid
- `404` - User tidak ditemukan
- `500` - Gagal mengambil data user

**Example:**
```typescript
const user = await userService.findById('507f1f77bcf86cd799439011')
```

---

### `findByEmail(email: string): Promise<IUser | null>`
Mencari user berdasarkan email.

**Throws:**
- `400` - Email wajib diisi
- `500` - Gagal mencari user

**Example:**
```typescript
const user = await userService.findByEmail('john@example.com')
```

---

### `findByUsername(username: string): Promise<IUser | null>`
Mencari user berdasarkan username.

**Throws:**
- `400` - Username wajib diisi
- `500` - Gagal mencari user

**Example:**
```typescript
const user = await userService.findByUsername('johndoe')
```

---

### `findAll(filters?: UserFilters): Promise<IUser[]>`
Mengambil semua user dengan filter opsional.

**Filters:**
```typescript
{
  role?: 'user' | 'admin'
  isEmailVerified?: boolean
  search?: string  // Search by name, email, or username
}
```

**Example:**
```typescript
// Get all users
const users = await userService.findAll()

// Get only admins
const admins = await userService.findAll({ role: 'admin' })

// Search users
const results = await userService.findAll({ search: 'john' })

// Get verified users
const verified = await userService.findAll({ isEmailVerified: true })
```

---

### `update(id: string, data: UpdateUserDTO): Promise<IUser>`
Update data user.

**Parameters:**
```typescript
{
  email?: string
  username?: string
  name?: string
  password?: string
  role?: 'user' | 'admin'
  avatar?: string
  bio?: string
}
```

**Throws:**
- `400` - ID user tidak valid
- `404` - User tidak ditemukan
- `400` - Email sudah digunakan oleh user lain
- `400` - Username sudah digunakan oleh user lain
- `400` - Validation errors
- `500` - Gagal mengupdate user

**Example:**
```typescript
const updatedUser = await userService.update('507f1f77bcf86cd799439011', {
  name: 'John Smith',
  bio: 'Software developer'
})
```

---

### `delete(id: string): Promise<void>`
Menghapus user.

**Throws:**
- `400` - ID user tidak valid
- `404` - User tidak ditemukan
- `500` - Gagal menghapus user

**Example:**
```typescript
await userService.delete('507f1f77bcf86cd799439011')
```

---

### `count(filters?: UserFilters): Promise<number>`
Menghitung jumlah user dengan filter opsional.

**Example:**
```typescript
const totalUsers = await userService.count()
const totalAdmins = await userService.count({ role: 'admin' })
```

---

### `verifyEmail(id: string): Promise<IUser>`
Verifikasi email user.

**Throws:**
- `400` - ID user tidak valid
- `404` - User tidak ditemukan
- `400` - Email sudah terverifikasi
- `500` - Gagal memverifikasi email

**Example:**
```typescript
const user = await userService.verifyEmail('507f1f77bcf86cd799439011')
```

---

### `changePassword(id: string, currentPassword: string, newPassword: string): Promise<void>`
Mengubah password user.

**Throws:**
- `400` - ID user tidak valid
- `400` - Password lama dan baru wajib diisi
- `400` - Password baru minimal 6 karakter
- `404` - User tidak ditemukan
- `400` - Password lama salah
- `500` - Gagal mengubah password

**Example:**
```typescript
await userService.changePassword(
  '507f1f77bcf86cd799439011',
  'oldPassword123',
  'newPassword456'
)
```

---

### `updateAvatar(id: string, avatarUrl: string): Promise<IUser>`
Update avatar user.

**Throws:**
- `400` - ID user tidak valid
- `404` - User tidak ditemukan
- `500` - Gagal mengupdate avatar

**Example:**
```typescript
const user = await userService.updateAvatar(
  '507f1f77bcf86cd799439011',
  '/uploads/avatars/user-123.jpg'
)
```

---

## Error Handling

Semua method menggunakan try-catch dengan proper error handling:

1. **HttpException errors** - Langsung di-throw
2. **Mongoose ValidationError** - Dikonversi ke HttpException dengan message gabungan
3. **Generic errors** - Dikonversi ke HttpException dengan status 500

## Best Practices

### Controller Usage
```typescript
import { userService } from '../services/user.service'
import { HttpException } from '../utils/HttpException'

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.create(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      })
    }
    next(error)
  }
}
```

### With Error Middleware
```typescript
import { asyncHandler } from '../utils/errors'

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.create(req.body)
  res.status(201).json({ success: true, data: user })
})
```

## Types

### CreateUserDTO
```typescript
interface CreateUserDTO {
  email: string
  username: string
  name: string
  password: string
  role?: 'user' | 'admin'
  avatar?: string
  bio?: string
}
```

### UpdateUserDTO
```typescript
interface UpdateUserDTO {
  email?: string
  username?: string
  name?: string
  password?: string
  role?: 'user' | 'admin'
  avatar?: string
  bio?: string
}
```

### UserFilters
```typescript
interface UserFilters {
  role?: 'user' | 'admin'
  isEmailVerified?: boolean
  search?: string
}
```
