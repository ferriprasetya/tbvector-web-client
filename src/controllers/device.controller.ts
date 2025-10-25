import { Request, Response, NextFunction } from 'express'
import { DeviceService } from '../services/device.service'
import { HttpException } from '../utils/HttpException'

/**
 * Controller for handling device-related API requests.
 */
export class DeviceController {
  public deviceService = new DeviceService()

  /**
   * Handles the request to create a new device.
   */
  public createDevice = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const deviceData = req.body
      const newDevice = await this.deviceService.createDevice(deviceData)
      res
        .status(201)
        .json({ data: newDevice, message: 'Device created successfully.' })
    } catch (error) {
      next(error) // Pass error to the global error handler
    }
  }

  /**
   * Handles the request to get all devices.
   */
  public getDevices = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const allDevices = await this.deviceService.getAllDevices()
      res
        .status(200)
        .json({ data: allDevices, message: 'Retrieved all devices.' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles the request to get a single device by its ID.
   */
  public getDeviceById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const deviceId = req.params.id
      const device = await this.deviceService.getDeviceById(deviceId)

      if (!device) {
        throw new HttpException(404, 'Device not found.')
      }

      res.status(200).json({ data: device, message: 'Retrieved device.' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles the request to update a device.
   */
  public updateDevice = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const deviceId = req.params.id
      const deviceData = req.body
      const updatedDevice = await this.deviceService.updateDevice(
        deviceId,
        deviceData,
      )
      res
        .status(200)
        .json({ data: updatedDevice, message: 'Device updated successfully.' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles the request to delete a device.
   */
  public deleteDevice = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const deviceId = req.params.id
      const deletedDevice = await this.deviceService.deleteDevice(deviceId)
      res
        .status(200)
        .json({ data: deletedDevice, message: 'Device deleted successfully.' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles the heartbeat signal from a device.
   */
  public handleHeartbeat = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { deviceId } = req.body
      if (!deviceId) {
        throw new HttpException(
          400,
          'Bad Request: deviceId is required in the body.',
        )
      }

      const updatedDevice = await this.deviceService.handleHeartbeat(deviceId)
      res.status(200).json({
        data: updatedDevice,
        message: 'Heartbeat received successfully.',
      })
    } catch (error) {
      next(error)
    }
  }
}

export const deviceController = new DeviceController()
