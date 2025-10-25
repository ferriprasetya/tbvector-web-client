import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'
import { HttpException } from '../utils/HttpException'
import path from 'path'
import fs from 'fs'

// Define the destination directory for uploads
const uploadDir = path.join(process.cwd(), 'public/uploads')

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure multer to use disk storage for development.
// This saves files directly to a folder in the project.
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, uploadDir)
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    // Create a unique filename to prevent overwriting files.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
    )
  },
})

// Define a file filter to only accept specific audio types.
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const allowedMimeTypes = [
    'audio/mpeg',
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
  ]

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    // Reject the file if it's not an accepted audio type
    cb(
      new HttpException(
        400,
        'Invalid file type. Only WAV or MP3 audio is allowed.',
      ),
    )
  }
}

// Create the multer instance with our configuration.
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB file size limit
  },
})

// Export a middleware for handling a single file upload from a field named 'audio'.
export const uploadAudio = upload.single('audio')
