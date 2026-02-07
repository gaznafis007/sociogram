import { admin } from '../config/firebase';
import { logger } from '../utils/logger';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export class NotificationService {
  async sendNotification(deviceToken: string, payload: NotificationPayload): Promise<void> {
    try {
      if (!deviceToken) {
        logger.warn('No device token provided for notification');
        return;
      }

      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
        token: deviceToken,
      };

      const response = await admin.messaging().send(message);
      logger.info(`✓ Notification sent successfully: ${response}`);
    } catch (error) {
      logger.error('Failed to send notification:', error);
      // Don't throw error - notifications should not break main flow
    }
  }

  async sendMulticastNotification(deviceTokens: string[], payload: NotificationPayload): Promise<void> {
    try {
      if (!deviceTokens || deviceTokens.length === 0) {
        logger.warn('No device tokens provided for multicast notification');
        return;
      }

      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
        tokens: deviceTokens,
      };

      const response = await admin.messaging().sendMulticast(message);
      logger.info(`✓ Multicast notification sent. Success: ${response.successCount}, Failed: ${response.failureCount}`);
    } catch (error) {
      logger.error('Failed to send multicast notification:', error);
    }
  }
}

export const notificationService = new NotificationService();
