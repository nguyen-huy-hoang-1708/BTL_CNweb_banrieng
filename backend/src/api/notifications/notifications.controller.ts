import { Request, Response } from 'express';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '../../services/notification.service';

function extractUserId(req: Request): string | undefined {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function getNotificationsHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized',
      });
    }

    const unreadOnly = req.query.unread === 'true';
    const notifications = getUserNotifications(userId, unreadOnly);

    return res.status(200).json({
      success: true,
      data: notifications,
      error: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      error: 'Internal Server Error',
    });
  }
}

export async function markAsReadHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized',
      });
    }

    const { notificationId } = req.params;
    const success = markNotificationAsRead(userId, notificationId);

    if (!success) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Notification not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { message: 'Notification marked as read' },
      error: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      error: 'Internal Server Error',
    });
  }
}

export async function markAllAsReadHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized',
      });
    }

    const count = markAllNotificationsAsRead(userId);

    return res.status(200).json({
      success: true,
      data: { count, message: `${count} notifications marked as read` },
      error: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      error: 'Internal Server Error',
    });
  }
}
