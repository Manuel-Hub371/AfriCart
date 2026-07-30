import { notificationRepository } from "./repository";
import { CreateNotificationInput, NotificationDTO } from "./dto";
import { domainEvents, EVENT_TOPICS } from "@/lib/events";

export class NotificationService {
  constructor() {
    this.registerEventListeners();
  }

  /**
   * Register event listeners for automatic system notifications
   */
  private registerEventListeners() {
    domainEvents.on(EVENT_TOPICS.ORDER_CREATED, async (data: any) => {
      try {
        if (data.userId && data.orderId) {
          await this.createNotification({
            userId: data.userId,
            title: "Order Placed Successfully",
            message: `Your order #${data.orderId.slice(0, 8)} has been received and is being processed.`,
            type: "ORDER",
            link: `/profile/orders/${data.orderId}`,
          });
        }
      } catch (err) {
        console.error("Error creating ORDER_CREATED notification:", err);
      }
    });

    domainEvents.on(EVENT_TOPICS.ORDER_STATUS_CHANGED, async (data: any) => {
      try {
        if (data.userId && data.orderId && data.status) {
          await this.createNotification({
            userId: data.userId,
            title: "Order Status Updated",
            message: `Your order #${data.orderId.slice(0, 8)} status is now ${data.status}.`,
            type: "ORDER",
            link: `/profile/orders/${data.orderId}`,
          });
        }
      } catch (err) {
        console.error("Error creating ORDER_STATUS_CHANGED notification:", err);
      }
    });
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string): Promise<NotificationDTO[]> {
    const notifications = await notificationRepository.findUserNotifications(userId);
    return notifications.map((n) => ({
      id: n.id,
      userId: n.userId,
      title: n.title,
      message: n.message,
      type: n.type as any,
      isRead: n.isRead,
      link: n.link,
      createdAt: n.createdAt,
    }));
  }

  /**
   * Create notification
   */
  async createNotification(input: CreateNotificationInput): Promise<NotificationDTO> {
    const n = await notificationRepository.createNotification(input);
    return {
      id: n.id,
      userId: n.userId,
      title: n.title,
      message: n.message,
      type: n.type as any,
      isRead: n.isRead,
      link: n.link,
      createdAt: n.createdAt,
    };
  }

  /**
   * Mark single notification as read
   */
  async markAsRead(userId: string, notificationId: string): Promise<void> {
    await notificationRepository.markAsRead(userId, notificationId);
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await notificationRepository.markAllAsRead(userId);
  }

  /**
   * Delete notification
   */
  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    await notificationRepository.deleteNotification(userId, notificationId);
  }
}

export const notificationService = new NotificationService();
