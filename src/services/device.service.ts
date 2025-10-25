import Device, { IDevice } from '../models/device.model'
import { HttpException } from '../utils/HttpException'

/**
 * A service class for handling device-related business logic.
 */
export class DeviceService {
  /**
   * Creates a new device in the database.
   * @param deviceData - The data for the new device.
   * @returns The newly created device document.
   * @throws HttpException if a device with the same deviceId already exists.
   */
  public async createDevice(deviceData: {
    deviceId: string
    name: string
    location?: string
  }): Promise<IDevice> {
    const existingDevice = await Device.findOne({
      deviceId: deviceData.deviceId,
    })
    if (existingDevice) {
      throw new HttpException(
        409,
        `Device with ID '${deviceData.deviceId}' already exists.`,
      )
    }

    const newDevice = new Device(deviceData)
    await newDevice.save()
    return newDevice
  }

  /**
   * Retrieves all devices from the database.
   * @returns A promise that resolves to an array of device documents.
   */
  public async getAllDevices(): Promise<IDevice[]> {
    const devices = await Device.find()
    return devices
  }

  /**
   * Finds a single device by its MongoDB ObjectId.
   * @param id - The ObjectId of the device.
   * @returns The found device document or null if not found.
   */
  public async getDeviceById(id: string): Promise<IDevice | null> {
    const device = await Device.findOne({ deviceId: id })
    return device
  }

  /**
   * Updates an existing device.
   * @param id - The ObjectId of the device to update.
   * @param deviceData - An object containing the fields to update.
   * @returns The updated device document.
   * @throws HttpException if the device is not found.
   */
  public async updateDevice(
    id: string,
    deviceData: Partial<Pick<IDevice, 'name' | 'location'>>,
  ): Promise<IDevice> {
    const updatedDevice = await Device.findByIdAndUpdate(id, deviceData, {
      new: true,
    })
    if (!updatedDevice) {
      throw new HttpException(404, 'Device not found.')
    }
    return updatedDevice
  }

  /**
   * Deletes a device from the database.
   * @param id - The ObjectId of the device to delete.
   * @returns The deleted device document.
   * @throws HttpException if the device is not found.
   */
  public async deleteDevice(id: string): Promise<IDevice> {
    const deletedDevice = await Device.findByIdAndDelete(id)
    if (!deletedDevice) {
      throw new HttpException(404, 'Device not found.')
    }
    return deletedDevice
  }

  /**
   * Handles an incoming heartbeat from a device.
   * Updates the device's status to 'ONLINE' and sets the lastHeartbeat timestamp.
   * @param deviceId - The unique identifier of the device sending the heartbeat.
   * @returns The updated device document.
   * @throws HttpException if the device is not found.
   */
  public async handleHeartbeat(deviceId: string): Promise<IDevice> {
    const device = await Device.findOneAndUpdate(
      { deviceId }, // Find device by its unique deviceId
      {
        status: 'ONLINE',
        lastHeartbeat: new Date(),
      },
      { new: true }, // Option to return the updated document
    )

    if (!device) {
      throw new HttpException(404, `Device with ID '${deviceId}' not found.`)
    }

    return device
  }

  /**
   * Checks for devices that have missed their heartbeat and updates their status to OFFLINE.
   * Emits a real-time notification for each device that is updated.
   */
  public async updateOfflineDevices(): Promise<void> {
    // Define the threshold, e.g., 3 minutes ago
    const threshold = new Date(Date.now() - 3 * 60 * 1000)

    // Find all devices that are currently ONLINE but their last heartbeat is older than the threshold
    const offlineCandidates = await Device.find({
      status: 'ONLINE',
      lastHeartbeat: { $lt: threshold },
    })

    if (offlineCandidates.length === 0) {
      return // No devices to update
    }

    console.log(`Found ${offlineCandidates.length} devices to mark as OFFLINE.`)

    // Update each device
    for (const device of offlineCandidates) {
      device.status = 'OFFLINE'
      await device.save()
    }
  }
}

export const deviceService = new DeviceService()
