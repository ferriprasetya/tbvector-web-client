import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGO_URI || '',
  deviceApiKey: process.env.DEVICE_API_KEY,
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  env: process.env.NODE_ENV || 'development',
  sessionSecret:
    process.env.SESSION_SECRET || 'tbvector-secret-key-change-in-production',
}
