import { Types } from 'mongoose'
import CoughNotification from '../models/coughNotification.model'
import { getIoInstance } from '../listeners'
import { IUser } from '../models/user.model'
import { HttpException } from '../utils/HttpException'

interface ICreateCoughNotificationDto {
  type: 'POSITIVE_TB_RESULT'
  message: string
  coughEventId: Types.ObjectId
}

class CoughNotificationService {
  /**
   * Creates a new cough notification, saves it to the database, populates related fields,
   * and emits a real-time event to connected clients.
   *
   * @param data - The data required to create a cough notification, including the cough event ID.
   * @returns A promise that resolves when the notification has been created and the event emitted.
   */
  public async createNotification(
    data: ICreateCoughNotificationDto,
  ): Promise<void> {
    const notification = new CoughNotification({
      ...data,
      coughEvent: data.coughEventId,
    })
    await notification.save()

    await notification.populate({
      path: 'coughEvent',
      select: 'timestamp status',
      populate: { path: 'device', select: 'name' },
    })

    const io = getIoInstance()
    io.emit('cough_notification:new', notification)
  }

  /**
   * Retrieves all unread cough notifications and their total count.
   *
   * @returns A promise that resolves to an object containing:
   * - `notifications`: An array of unread cough notifications with populated cough event and device details.
   * - `unreadCount`: The total number of unread notifications.
   */
  public async getUnreadNotifications() {
    const query = { readBy: { $exists: false } }

    const [notifications, unreadCount] = await Promise.all([
      CoughNotification.find(query)
        .sort({ createdAt: -1 })
        .populate({
          path: 'coughEvent',
          select: 'timestamp status',
          populate: { path: 'device', select: 'name' },
        }),
      CoughNotification.countDocuments(query),
    ])

    return { notifications, unreadCount }
  }

  /**
   * Marks a cough notification as read by the current user.
   *
   * This method finds a notification by its ID and, if it exists and has not already been acknowledged,
   * marks it as read by the current user. It also records the timestamp of when it was read.
   * If the notification has already been acknowledged by another user, a conflict error is thrown.
   * After successfully marking the notification as read, an event is emitted to notify listeners.
   *
   * @param notificationId - The unique identifier of the notification to mark as read.
   * @param currentUser - The user who is acknowledging the notification.
   * @throws {HttpException} 404 - If the notification is not found.
   * @throws {HttpException} 409 - If the notification has already been acknowledged by another user.
   * @returns An object containing a success message upon successful acknowledgment.
   */
  public async markNotificationAsRead(
    notificationId: string,
    currentUser: IUser,
  ) {
    const notification = await CoughNotification.findById(notificationId)
    if (!notification) {
      throw new HttpException(404, 'Notification not found.')
    }

    // Best Practice: Prevent race conditions or double marking.
    // If 'readBy' already exists, another user has already handled it.
    if (notification.readBy) {
      throw new HttpException(
        409,
        'This notification has already been acknowledged by another user.',
      )
    }

    notification.readBy = currentUser._id as Types.ObjectId
    notification.readAt = new Date()
    await notification.save()

    // Emit event that this notification has been handled
    const io = getIoInstance()
    io.emit('cough_notification:acknowledged', {
      notificationId: notification._id,
      user: { _id: currentUser._id, name: currentUser.name },
    })

    return { message: 'Notification acknowledged successfully.' }
  }
}

export const coughNotificationService = new CoughNotificationService()
