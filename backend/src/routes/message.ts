import { Router } from 'express';
import { messageController } from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validation';
import { sendMessageSchema, getMessagesQuerySchema } from '../utils/validationSchemas';

const router = Router();

// POST /api/messages - Send a message
router.post(
  '/',
  authenticateToken,
  validateBody(sendMessageSchema),
  messageController.sendMessage
);

// GET /api/messages/:userId - Get messages between current user and another user
router.get(
  '/:userId',
  authenticateToken,
  validateParams(getMessagesQuerySchema),
  messageController.getMessages
);

// GET /api/messages/chats - Get user's chat list
router.get(
  '/chats',
  authenticateToken,
  messageController.getUserChats
);

// POST /api/messages/:senderId/read - Mark messages as read
router.post(
  '/:senderId/read',
  authenticateToken,
  validateParams(getMessagesQuerySchema),
  messageController.markMessagesAsRead
);

export default router;
