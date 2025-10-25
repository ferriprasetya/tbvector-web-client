import mongoose from 'mongoose'
import { config } from './env'

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri)
    console.log('MongoDB Connected...')
  } catch (err: any) {
    console.error(`MongoDB Connection Error: ${err.message}`)
    // Exit process with failure
    process.exit(1)
  }
}
