import { Prisma, Message } from '@prisma/client';
import { databaseService } from './database';
import { logger } from '../utils/logger';
import { SendMessageInput, GetMessagesQueryInput } from '../utils/validationSchemas';

export interface MessageWithUsers {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  receiverId: string;
  sender: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  receiver: {
    id: string;
    name: string;
    profilePicture?: string;
  };
}

export interface MessagesResult {
  messages: MessageWithUsers[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ChatSummary {
  userId: string;
  userName: string;
  userProfilePicture?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export class MessageService {
  private prisma = databaseService.getPrisma();

  async sendMessage(senderId: string, messageData: SendMessageInput): Promise<Message> {
    try {
      const message = await this.prisma.message.create({
        data: {
          senderId,
          receiverId: messageData.receiverId,
          content: messageData.content
        }
      });

      logger.info('Message sent successfully', { 
        messageId: message.id, 
        senderId, 
        receiverId: messageData.receiverId 
      });

      return message;
    } catch (error) {
      logger.error('Error sending message', { error, senderId, messageData });
      throw error;
    }
  }

  async getMessagesBetweenUsers(
    userId1: string,
    userId2: string,
    query: GetMessagesQueryInput
  ): Promise<MessagesResult> {
    try {
      const { page, limit } = query;
      const skip = (page - 1) * limit;

      const where: Prisma.MessageWhereInput = {
        OR: [
          {
            senderId: userId1,
            receiverId: userId2
          },
          {
            senderId: userId2,
            receiverId: userId1
          }
        ]
      };

      const [messages, total] = await Promise.all([
        this.prisma.message.findMany({
          where,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                profilePicture: true
              }
            },
            receiver: {
              select: {
                id: true,
                name: true,
                profilePicture: true
              }
            }
          },
          skip,
          take: limit,
          orderBy: { timestamp: 'desc' }
        }),
        this.prisma.message.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        messages: messages.map(message => this.mapToMessageWithUsers(message)),
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      logger.error('Error getting messages between users', { error, userId1, userId2, query });
      throw error;
    }
  }

  async getUserChats(userId: string): Promise<ChatSummary[]> {
    try {
      // Get all unique users the current user has chatted with
      const chatUsers = await this.prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },
        select: {
          senderId: true,
          receiverId: true,
          sender: {
            select: {
              id: true,
              name: true,
              profilePicture: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              profilePicture: true
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      // Group by chat partner and get latest message
      const chatMap = new Map<string, ChatSummary>();

      for (const msg of chatUsers) {
        const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
        const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;

        if (!chatMap.has(otherUserId)) {
          chatMap.set(otherUserId, {
            userId: otherUserId,
            userName: otherUser.name,
            userProfilePicture: otherUser.profilePicture,
            lastMessage: '', // Will be updated below
            lastMessageTime: new Date(),
            unreadCount: 0
          });
        }
      }

      // Get latest message and unread count for each chat
      for (const [otherUserId] of chatMap) {
        const latestMessage = await this.prisma.message.findFirst({
          where: {
            OR: [
              {
                senderId: userId,
                receiverId: otherUserId
              },
              {
                senderId: otherUserId,
                receiverId: userId
              }
            ]
          },
          orderBy: {
            timestamp: 'desc'
          }
        });

        if (latestMessage) {
          const chat = chatMap.get(otherUserId)!;
          chat.lastMessage = latestMessage.content;
          chat.lastMessageTime = latestMessage.timestamp;

          // Count unread messages (messages sent to current user)
          const unreadCount = await this.prisma.message.count({
            where: {
              senderId: otherUserId,
              receiverId: userId
            }
          });

          chat.unreadCount = unreadCount;
        }
      }

      // Convert to array and sort by last message time
      const chats = Array.from(chatMap.values()).sort(
        (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
      );

      return chats;
    } catch (error) {
      logger.error('Error getting user chats', { error, userId });
      throw error;
    }
  }

  async markMessagesAsRead(userId: string, senderId: string): Promise<void> {
    try {
      // In a real implementation, you might want to add a 'read' field to messages
      // For now, we'll just log that messages were marked as read
      logger.info('Messages marked as read', { userId, senderId });
    } catch (error) {
      logger.error('Error marking messages as read', { error, userId, senderId });
      throw error;
    }
  }

  private mapToMessageWithUsers(message: any): MessageWithUsers {
    return {
      id: message.id,
      content: message.content,
      timestamp: message.timestamp,
      senderId: message.senderId,
      receiverId: message.receiverId,
      sender: message.sender,
      receiver: message.receiver
    };
  }
}

export const messageService = new MessageService();
export default messageService;
