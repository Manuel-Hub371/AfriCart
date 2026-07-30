import { db } from "@/lib/db";
import { CreateNotificationInput } from "./dto";

export class NotificationRepository {
  /**
   * Find notifications for a user
   */
  async findUserNotifications(userId: string) {
    return db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Create notification
   */
  async createNotification(input: CreateNotificationInput) {
    return db.notification.create({
      data: {
        userId: input.userId,
        title: input.title,
        message: input.message,
        type: input.type || "INFO",
        link: input.link,
      },
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId: string, notificationId: string) {
    return db.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    return db.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  /**
   * Delete a notification
   */
  async deleteNotification(userId: string, notificationId: string) {
    return db.notification.deleteMany({
      where: { id: notificationId, userId },
    });
  }
}

export const notificationRepository = new NotificationRepository();
