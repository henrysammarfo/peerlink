import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { messageService } from '../services/messageService';
import { logger } from '../utils/logger';
import { SendMessageInput } from '../utils/validationSchemas';

export class MessageController {
  async sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const messageData: SendMessageInput = req.body;
      const message = await messageService.sendMessage(req.user.userId, messageData);

      logger.info('Message sent', { 
        messageId: message.id, 
        senderId: req.user.userId, 
        receiverId: messageData.receiverId 
      });

      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: { message }
      });
    } catch (error) {
      logger.error('Error sending message', { error, userId: req.user?.userId });
      res.status(500).json({
        success: false,
        message: 'Failed to send message'
      });
    }
  }

  async getMessages(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { userId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const result = await messageService.getMessagesBetweenUsers(
        req.user.userId,
        userId,
        {
          userId,
          page: Number(page),
          limit: Number(limit)
        }
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Error getting messages', { error, userId: req.user?.userId });
      res.status(500).json({
        success: false,
        message: 'Failed to get messages'
      });
    }
  }

  async getUserChats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const chats = await messageService.getUserChats(req.user.userId);

      res.status(200).json({
        success: true,
        data: { chats }
      });
    } catch (error) {
      logger.error('Error getting user chats', { error, userId: req.user?.userId });
      res.status(500).json({
        success: false,
        message: 'Failed to get user chats'
      });
    }
  }

  async markMessagesAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { senderId } = req.params;
      await messageService.markMessagesAsRead(req.user.userId, senderId);

      logger.info('Messages marked as read', { userId: req.user.userId, senderId });

      res.status(200).json({
        success: true,
        message: 'Messages marked as read'
      });
    } catch (error) {
      logger.error('Error marking messages as read', { error, userId: req.user?.userId });
      res.status(500).json({
        success: false,
        message: 'Failed to mark messages as read'
      });
    }
  }
}

export const messageController = new MessageController();
export default messageController;
