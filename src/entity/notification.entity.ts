import { Model } from 'mongoose';
import NotificationModel from '@models/notification.model';
import { toObjectId } from '@utils';
import BaseEntity from './base.entity';

class NotificationEntity extends BaseEntity {
  constructor(model: Model<any>) {
    super(model);
  }

  // Create a new notification
  public async createNotification(data: any) {
    return this.create(data);
  }

  // Find a notification by ID
  public async findNotificationById(notificationId: string) {
    return this.findOne({ _id: notificationId });
  }

  // Find all notifications by user
  public async findNotificationsByUser(userId: string) {
    return this.find({ userId: toObjectId(userId) });
  }

  // Mark a notification as read
  public async markNotificationAsRead(notificationId: string) {
    return this.updateOne({ _id: toObjectId(notificationId) }, { read: true });
  }

  // Mark all notifications as read for a user
  public async markAllNotificationsAsRead(userId: string) {
    return this.updateMany({ userId: toObjectId(userId), read: false }, { read: true });
  }

  // Delete a notification by ID
  public async deleteNotification(notificationId: string) {
    return this.deleteOne({ _id: toObjectId(notificationId) });
  }

  // Delete all notifications for a user
  public async deleteAllNotifications(userId: string) {
    return this.deleteMany({ userId: toObjectId(userId) });
  }
}

export const NotificationEntities = new NotificationEntity(NotificationModel);
