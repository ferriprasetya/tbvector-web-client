import { HttpException } from '../utils/HttpException'
import { storageService } from './storage.service'
import {
  ICoughEvent,
  CoughEvent,
  IDetectionResult,
  CreateCoughEventDto,
} from '../models/cough.model'
import Device from '../models/device.model'
import { IUser } from '../models/user.model'
import { Types } from 'mongoose'
import { getIoInstance } from '../listeners'
import { coughNotificationService } from './coughNotification.service'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import type { SessionUser } from '../types/session'

export interface IQueryOptions {
  page: number
  limit: number
  status?: 'POSITIVE_TB' | 'NEGATIVE_TB' | 'ANALYZING'
  startDate?: string // ISO 8601 date string
  endDate?: string // ISO 8601 date string
  deviceId?: string // Device ID to filter
  userId?: string // User ID to filter (for showing only user's own records)
}

class CoughService {
  /**
   * Creates an initial record for a cough event with 'ANALYZING' status.
   * This method handles the file upload, saves to database, and sends to external service.
   * @param file The audio file uploaded via multer.
   * @param eventData The initial metadata (without detection result).
   * @param currentUser The current logged-in user from session.
   * @returns The newly created cough event document.
   */
  public async createCoughEvent(
    file: Express.Multer.File | undefined,
    eventData: CreateCoughEventDto,
    currentUser?: SessionUser,
  ): Promise<ICoughEvent> {
    try {
      // Upload file to local storage
      const audioPath = storageService.uploadAudioFile(file)

      // Create and save cough event to database
      const newCoughEvent = new CoughEvent({
        ...eventData,
        user: currentUser?.id
          ? (currentUser.id as unknown as Types.ObjectId)
          : undefined,
        audioPath: audioPath,
        timestamp: new Date(),
        status: 'ANALYZING',
      })

      await newCoughEvent.save()

      // --- NOTIFICATION LOGIC ---
      await newCoughEvent.populate('device', 'name location')
      const io = getIoInstance()
      io.emit('cough_event:new', newCoughEvent)

      // Send to external service in background (non-blocking)
      this.sendToExternalService(
        file,
        currentUser?.name || eventData.nama,
        newCoughEvent._id.toString(),
      ).catch((error) => {
        console.error('Failed to send to external service:', error)
        // Don't fail the whole request if external service fails
      })

      return newCoughEvent
    } catch (error) {
      // If file upload or database save fails, we should clean up the uploaded file
      if (file) {
        await storageService.deleteAudioFile(`/uploads/${file.filename}`)
      }
      return Promise.reject(error as Error)
    }
  }

  /**
   * Sends cough event data to external ML service for analysis.
   * @param file The audio file to send.
   * @param nama The name of the user.
   * @param recordId The ID of the cough event record.
   * @private
   */
  private async sendToExternalService(
    file: Express.Multer.File | undefined,
    nama: string,
    recordId: string,
  ): Promise<void> {
    if (!file) {
      throw new Error('No file provided to send to external service')
    }

    try {
      // Resolve the full path to the uploaded file
      const filePath = path.join(
        process.cwd(),
        'public',
        'uploads',
        file.filename,
      )

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }

      // Create form-data
      const formData = new FormData()
      formData.append('file_batuk', fs.createReadStream(filePath), {
        filename: file.originalname || file.filename,
        contentType: file.mimetype || 'audio/wav',
      })
      formData.append('nama', nama)
      formData.append('record_id', recordId)

      // Send to external service using axios
      const response = await axios.post(
        'https://tbvector.com/api/device/sendData_sub2/401',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 30000, // 30 seconds timeout
        },
      )

      console.log('Successfully sent to external service:', response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error sending to external service:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        console.error('Error sending to external service:', error)
      }
      throw error
    }
  }

  /**
   * Updates an existing cough event with the detection result from the analysis model.
   * It finds the event by the unique coughId provided by the edge device.
   * @param coughId The unique ID of the cough event.
   * @param resultData The detection result data.
   * @returns The updated cough event document.
   */
  public async updateCoughEventResult(
    coughId: string,
    resultData: IDetectionResult,
  ): Promise<ICoughEvent> {
    const coughEvent = await CoughEvent.findById(coughId)
    if (!coughEvent) {
      throw new HttpException(
        404,
        `Cough event with ID '${coughId}' not found.`,
      )
    }

    // Update the detection result and status
    coughEvent.detectionResult = resultData
    coughEvent.status = resultData.isTBCough ? 'POSITIVE_TB' : 'NEGATIVE_TB'

    await coughEvent.save()

    await coughEvent.populate('device', 'name location')

    // --- NOTIFICATION LOGIC ---
    if (resultData.isTBCough) {
      await coughNotificationService.createNotification({
        type: 'POSITIVE_TB_RESULT',
        message: `Terdeteksi indikasi batuk TB pada hasil deteksi Anda dengan confidence ${(resultData.confidenceScore * 100).toFixed(1)}%.`,
        coughEventId: coughEvent._id as Types.ObjectId,
      })
    }

    return coughEvent
  }

  /**
   * Updates cough event from external detection service callback.
   * Receives status (0/1) and confidence_score from external service.
   * @param recordId The MongoDB ID of the cough event.
   * @param status 0 for NEGATIVE_TB, 1 for POSITIVE_TB
   * @param confidenceScore Float value between 0 and 1
   * @returns The updated cough event document.
   */
  public async updateFromExternalDetection(
    recordId: string,
    status: number,
    confidenceScore: number,
  ): Promise<ICoughEvent> {
    const coughEvent = await CoughEvent.findById(recordId)
    if (!coughEvent) {
      throw new HttpException(
        404,
        `Cough event with ID '${recordId}' not found.`,
      )
    }

    // Map external status (0/1) to internal status
    const isTBCough = status === 1
    const detectionStatus = isTBCough ? 'POSITIVE_TB' : 'NEGATIVE_TB'

    // Update the detection result and status
    coughEvent.detectionResult = {
      isTBCough,
      confidenceScore,
    }
    coughEvent.status = detectionStatus

    await coughEvent.save()

    await coughEvent.populate('user', 'name email')

    // --- NOTIFICATION LOGIC ---
    if (isTBCough) {
      await coughNotificationService.createNotification({
        type: 'POSITIVE_TB_RESULT',
        message: `Terdeteksi indikasi batuk TB pada hasil deteksi ${(coughEvent.user as any)?.name || 'pasien'} dengan confidence ${(confidenceScore * 100).toFixed(1)}%.`,
        coughEventId: coughEvent._id as Types.ObjectId,
      })
    }

    // Emit socket event for real-time notification to user
    const io = getIoInstance()
    io.emit('cough_event:detection_complete', {
      recordId,
      status: detectionStatus,
      isTBCough,
      confidenceScore,
      userName: (coughEvent.user as any)?.name || 'Pasien',
      timestamp: new Date(),
    })

    console.log(
      `Updated cough event ${recordId} with status: ${detectionStatus}, confidence: ${confidenceScore}`,
    )

    return coughEvent
  }

  /**
   * Retrieves a paginated and filtered list of cough events.
   * @param options Options for pagination and filtering.
   * @returns A promise that resolves to the list of cough events.
   */
  public async getAllCoughEvents(options: IQueryOptions): Promise<{
    events: ICoughEvent[]
    total: number
    page: number
    pages: number
  }> {
    const { page, limit, status, startDate, endDate, deviceId, userId } =
      options
    const skip = (page - 1) * limit

    const query: any = {}
    if (status) {
      query.status = status
    }
    if (startDate || endDate) {
      query.timestamp = {}
      if (startDate) {
        const convertedStartDate = new Date(startDate)

        convertedStartDate.setHours(0, 0, 0, 0)
        query.timestamp.$gte = convertedStartDate
      }
      if (endDate) {
        const convertedEndDate = new Date(endDate)
        convertedEndDate.setHours(23, 59, 59, 999)
        query.timestamp.$lte = convertedEndDate
      }
    }
    if (userId) {
      // Filter by user ID to show only user's own records
      query.user = new Types.ObjectId(userId)
    }
    if (deviceId) {
      // device is an ObjectId reference, so we need to look up the device by deviceId
      const deviceModel = await import('../models/device.model')
      const Device = deviceModel.default
      const device = await Device.findOne({ deviceId })
      if (device) {
        query.device = device._id
      } else {
        // If deviceId is provided but not found, return empty result
        return {
          events: [],
          total: 0,
          page,
          pages: 0,
        }
      }
    }

    const events = await CoughEvent.find(query)
      .populate('device', 'name location') // Retrieve the name and location of the associated device
      .sort({ timestamp: -1 }) // Sort by the most recent
      .skip(skip)
      .limit(limit)

    const total = await CoughEvent.countDocuments(query)

    return {
      events: events,
      total,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  /**
   * Retrieves a single cough event by its MongoDB ID.
   * @param id The ID of the cough event.
   * @returns A promise that resolves to the cough event document.
   */
  public async getCoughEventById(id: string): Promise<ICoughEvent> {
    const event = await CoughEvent.findById(id)
      .populate('device', 'name location deviceId')
      .populate('notes.author', 'name')
      .populate('user', 'name email')

    if (!event) {
      throw new HttpException(404, `Cough event with ID '${id}' not found.`)
    }

    return event
  }

  /**
   * Adds a new note to a specific cough event.
   * @param id The MongoDB ID of the cough event.
   * @param content The text content of the note.
   * @param author The user who is adding the note.
   * @returns The updated cough event document with the new note.
   */
  public async addNoteToCoughEvent(
    id: string,
    content: string,
    author: IUser,
  ): Promise<ICoughEvent> {
    const event = await CoughEvent.findById(id)
    if (!event) {
      throw new HttpException(404, `Cough event with ID '${id}' not found.`)
    }

    event.notes.unshift({
      content,
      author: author._id as Types.ObjectId,
    })

    await event.save()
    return event
  }

  /**
   * Deletes a cough event record and its associated audio file.
   * @param id The MongoDB ID of the cough event to delete.
   */
  public async deleteCoughEvent(id: string): Promise<void> {
    const event = await CoughEvent.findById(id)
    if (!event) {
      throw new HttpException(404, `Cough event with ID '${id}' not found.`)
    }

    // Best Practice: Delete the associated file from storage first.
    await storageService.deleteAudioFile(event.audioPath)

    // Then, delete the record from the database.
    await event.deleteOne()
  }
}

export const coughService = new CoughService()
