import { Request, Response, NextFunction } from 'express'
import { coughService, IQueryOptions } from '../services/cough.service'
import { CreateCoughEventDto, IDetectionResult } from '../models/cough.model'
import { HttpException } from '../utils/HttpException'

class CoughController {
  /**
   * Handles the incoming request to create a new cough event.
   * It orchestrates the flow by calling the service layer and sending
   * the appropriate HTTP response.
   */
  public createCoughEvent = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // The request body contains the metadata for the cough event.
      const eventData: CreateCoughEventDto = req.body

      // The uploaded audio file is available on req.file thanks to the multer middleware.
      const audioFile = req.file

      // Call the service to handle the business logic.
      const newCoughEvent = await coughService.createCoughEvent(
        audioFile,
        eventData,
      )

      // Send a success response.
      res.status(201).json({
        status: 'success',
        message: 'Cough event recorded successfully.',
        data: newCoughEvent,
      })
    } catch (error) {
      // Pass any errors to the global error handler middleware.
      next(error)
    }
  }

  /**
   * Handles the request to update a cough event with its detection result.
   */
  public updateCoughEventResult = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // The unique UUID of the cough event is in the URL parameters.
      const coughId = req.params.coughId

      // The detection result is in the request body.
      const resultData: IDetectionResult = req.body

      // Call the service to update the event.
      const updatedCoughEvent = await coughService.updateCoughEventResult(
        coughId,
        resultData,
      )

      // Send a success response.
      res.status(200).json({
        status: 'success',
        message: 'Cough event result updated successfully.',
        data: updatedCoughEvent,
      })
    } catch (error) {
      // Pass any errors to the global error handler middleware.
      next(error)
    }
  }

  /**
   * Retrieves all cough events with pagination and filtering.
   */
  public getAllCoughEvents = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Parse query parameters with safe default values
      const options: IQueryOptions = {
        page: parseInt(req.query.page as string, 10) || 1,
        limit: parseInt(req.query.limit as string, 10) || 10,
        status: (req.query.status as IQueryOptions['status']) || undefined,
        startDate: (req.query.startDate as string) || undefined,
        endDate: (req.query.endDate as string) || undefined,
        deviceId: (req.query.deviceId as string) || undefined,
      }

      const result = await coughService.getAllCoughEvents(options)

      res.status(200).json({
        status: 'success',
        ...result,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Retrieves a single cough event by its ID.
   */
  public getCoughEventById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const event = await coughService.getCoughEventById(id)

      res.status(200).json({
        status: 'success',
        data: event,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Adds a note to a specific cough event.
   */
  public addNoteToCoughEvent = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const { content } = req.body
      const author = req.user // req.user is guaranteed to exist by the 'authenticate' middleware

      if (!content) {
        throw new HttpException(400, 'Note content cannot be empty.')
      }

      const updatedEvent = await coughService.addNoteToCoughEvent(
        id,
        content,
        author,
      )

      res.status(200).json({
        status: 'success',
        message: 'Note added successfully.',
        data: updatedEvent,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes a specific cough event.
   */
  public deleteCoughEvent = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params
      await coughService.deleteCoughEvent(id)

      res.status(200).json({
        status: 'success',
        message: 'Cough event deleted successfully.',
      })
    } catch (error) {
      next(error)
    }
  }
}

export const coughController = new CoughController()
