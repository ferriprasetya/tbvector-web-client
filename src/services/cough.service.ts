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

export interface IQueryOptions {
  page: number
  limit: number
  status?: 'POSITIVE_TB' | 'NEGATIVE_TB' | 'ANALYZING'
  startDate?: string // ISO 8601 date string
  endDate?: string // ISO 8601 date string
  deviceId?: string // Device ID to filter
}

class CoughService {
  /**
   * Creates an initial record for a cough event with 'ANALYZING' status.
   * This method only handles the file upload and initial metadata.
   * @param file The audio file uploaded via multer.
   * @param eventData The initial metadata (without detection result).
   * @returns The newly created cough event document.
   */
  public async createCoughEvent(
    file: Express.Multer.File | undefined,
    eventData: CreateCoughEventDto,
  ): Promise<ICoughEvent> {
    try {
      const device = await Device.findOne({ deviceId: eventData.deviceId })
      if (!device) {
        throw new HttpException(
          404,
          `Device with ID '${eventData.deviceId}' not found.`,
        )
      }

      const audioPath = storageService.uploadAudioFile(file)

      const newCoughEvent = new CoughEvent({
        ...eventData,
        device: device._id,
        audioPath: audioPath,
        timestamp: new Date(eventData.timestamp),
        directionOfArrival: parseFloat(eventData.directionOfArrival),
        status: 'ANALYZING', // Status is now hardcoded to 'ANALYZING'
      })

      await newCoughEvent.save()

      // --- NOTIFICATION LOGIC ---
      await newCoughEvent.populate('device', 'name location')
      const io = getIoInstance()
      io.emit('cough_event:new', newCoughEvent)

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
    await coughNotificationService.createNotification({
      type: 'POSITIVE_TB_RESULT',
      message: `Terdeteksi indikasi batuk TB pada perangkat ${(coughEvent.device as any)?.name}.`,
      coughEventId: coughEvent._id as Types.ObjectId,
    })

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
    const { page, limit, status, startDate, endDate, deviceId } = options
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
