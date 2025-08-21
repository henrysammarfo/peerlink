import { Prisma, MentorshipRequest, MentorshipRequestStatus } from '@prisma/client';
import { databaseService } from './database';
import { logger } from '../utils/logger';
import { CreateMentorshipRequestInput, UpdateMentorshipRequestInput } from '../utils/validationSchemas';

export interface MentorshipRequestWithUsers {
  id: string;
  status: MentorshipRequestStatus;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  fromUser: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  toUser: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface MentorshipRequestsResult {
  requests: MentorshipRequestWithUsers[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class MentorshipService {
  private prisma = databaseService.getPrisma();

  async createRequest(fromUserId: string, requestData: CreateMentorshipRequestInput): Promise<MentorshipRequest> {
    try {
      // Check if a request already exists between these users
      const existingRequest = await this.prisma.mentorshipRequest.findFirst({
        where: {
          OR: [
            {
              fromUserId,
              toUserId: requestData.toUserId
            },
            {
              fromUserId: requestData.toUserId,
              toUserId: fromUserId
            }
          ]
        }
      });

      if (existingRequest) {
        throw new Error('A mentorship request already exists between these users');
      }

      const request = await this.prisma.mentorshipRequest.create({
        data: {
          fromUserId,
          toUserId: requestData.toUserId,
          message: requestData.message,
          status: 'PENDING'
        }
      });

      logger.info('Mentorship request created successfully', { 
        requestId: request.id, 
        fromUserId, 
        toUserId: requestData.toUserId 
      });

      return request;
    } catch (error) {
      logger.error('Error creating mentorship request', { error, fromUserId, requestData });
      throw error;
    }
  }

  async updateRequestStatus(
    requestId: string, 
    userId: string, 
    updateData: UpdateMentorshipRequestInput
  ): Promise<MentorshipRequest> {
    try {
      // Verify the user can update this request (must be the recipient)
      const request = await this.prisma.mentorshipRequest.findUnique({
        where: { id: requestId }
      });

      if (!request) {
        throw new Error('Mentorship request not found');
      }

      if (request.toUserId !== userId) {
        throw new Error('Unauthorized to update this request');
      }

      if (request.status !== 'PENDING') {
        throw new Error('Request has already been processed');
      }

      const updatedRequest = await this.prisma.mentorshipRequest.update({
        where: { id: requestId },
        data: {
          status: updateData.status,
          message: updateData.message
        }
      });

      logger.info('Mentorship request status updated', { 
        requestId, 
        userId, 
        newStatus: updateData.status 
      });

      return updatedRequest;
    } catch (error) {
      logger.error('Error updating mentorship request status', { error, requestId, userId, updateData });
      throw error;
    }
  }

  async getRequestById(requestId: string): Promise<MentorshipRequestWithUsers | null> {
    try {
      const request = await this.prisma.mentorshipRequest.findUnique({
        where: { id: requestId },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          toUser: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      });

      return request ? this.mapToMentorshipRequestWithUsers(request) : null;
    } catch (error) {
      logger.error('Error getting mentorship request by ID', { error, requestId });
      throw error;
    }
  }

  async getUserRequests(
    userId: string, 
    type: 'sent' | 'received' = 'received',
    page: number = 1,
    limit: number = 10
  ): Promise<MentorshipRequestsResult> {
    try {
      const skip = (page - 1) * limit;

      const where: Prisma.MentorshipRequestWhereInput = type === 'sent' 
        ? { fromUserId: userId }
        : { toUserId: userId };

      const [requests, total] = await Promise.all([
        this.prisma.mentorshipRequest.findMany({
          where,
          include: {
            fromUser: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            },
            toUser: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.mentorshipRequest.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        requests: requests.map(request => this.mapToMentorshipRequestWithUsers(request)),
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      logger.error('Error getting user mentorship requests', { error, userId, type, page, limit });
      throw error;
    }
  }

  async getPendingRequestsCount(userId: string): Promise<number> {
    try {
      return await this.prisma.mentorshipRequest.count({
        where: {
          toUserId: userId,
          status: 'PENDING'
        }
      });
    } catch (error) {
      logger.error('Error getting pending requests count', { error, userId });
      throw error;
    }
  }

  private mapToMentorshipRequestWithUsers(request: any): MentorshipRequestWithUsers {
    return {
      id: request.id,
      status: request.status,
      message: request.message,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      fromUser: request.fromUser,
      toUser: request.toUser
    };
  }
}

export const mentorshipService = new MentorshipService();
export default mentorshipService;
