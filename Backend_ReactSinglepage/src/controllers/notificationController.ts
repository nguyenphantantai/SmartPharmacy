import { Response } from 'express';
import { Notification } from '../models/schema';
import { AuthenticatedRequest } from '../middleware/auth';

export class NotificationController {
  // Get user's notifications
  static async getNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { type, isRead, limit = 50, offset = 0 } = req.query;

      const query: any = { userId };

      // Filter by type
      if (type && ['order', 'brand', 'promotion', 'health', 'news', 'system'].includes(type as string)) {
        query.type = type;
      }

      // Filter by read status
      if (isRead !== undefined) {
        query.isRead = isRead === 'true';
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(offset))
        .lean();

      const total = await Notification.countDocuments(query);
      const unreadCount = await Notification.countDocuments({ userId, isRead: false });

      res.json({
        success: true,
        data: {
          notifications,
          total,
          unreadCount,
          limit: Number(limit),
          offset: Number(offset),
        }
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Mark notification as read
  static async markAsRead(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { notificationId } = req.params;

      const notification = await Notification.findOne({
        _id: notificationId,
        userId,
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      notification.isRead = true;
      await notification.save();

      res.json({
        success: true,
        message: 'Notification marked as read',
        data: notification
      });
    } catch (error) {
      console.error('Mark notification as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { type } = req.body;

      const query: any = { userId, isRead: false };
      if (type && ['order', 'brand', 'promotion', 'health', 'news', 'system'].includes(type)) {
        query.type = type;
      }

      const result = await Notification.updateMany(query, { isRead: true });

      res.json({
        success: true,
        message: 'All notifications marked as read',
        data: {
          updatedCount: result.modifiedCount
        }
      });
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get unread count
  static async getUnreadCount(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const unreadCount = await Notification.countDocuments({
        userId,
        isRead: false,
      });

      res.json({
        success: true,
        data: {
          unreadCount
        }
      });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create notification (for system use)
  static async createNotification(
    userId: string,
    type: 'order' | 'brand' | 'promotion' | 'health' | 'news' | 'system',
    title: string,
    content: string,
    link?: string,
    metadata?: any
  ) {
    try {
      const notification = await Notification.create({
        userId: userId as any,
        type,
        title,
        content,
        link,
        metadata: metadata || {},
        isRead: false,
      });

      return notification;
    } catch (error) {
      console.error('Create notification error:', error);
      return null;
    }
  }
}

