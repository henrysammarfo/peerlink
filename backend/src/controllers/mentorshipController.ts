import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { mentorshipService } from '../services/mentorshipService';
import { logger } from '../utils/logger';
import { CreateMentorshipRequestInput, UpdateMentorshipRequestInput } from '../utils/validationSchemas';

export class MentorshipController {
  async createRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const requestData: CreateMentorshipRequestInput = req.body;
      const request = await mentorshipService.createRequest(req.user.userId, requestData);

      logger.info('Mentorship request created', { 
        requestId: request.id, 
        fromUserId: req.user.userId, 
        toUserId: requestData.toUserId 
      });

      res.status(201).json({
        success: true,
        message: 'Mentorship request sent successfully',
        data: { request }
      });
    } catch (error) {
      logger.error('Error creating mentorship request', { error, userId: req.user?.userId });
      
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to create mentorship request'
        });
      }
    }
  }

  async updateRequestStatus(
    req: AuthenticatedRequest, 
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { id } = req.params;
      const updateData: UpdateMentorshipRequestInput = req.body;

      const updatedRequest = await mentorshipService.updateRequestStatus(
        id, 
        req.user.userId, 
        updateData
      );

      logger.info('Mentorship request status updated', { 
        requestId: id, 
        userId: req.user.userId, 
        newStatus: updateData.status 
      });

      res.status(200).json({
        success: true,
        message: `Mentorship request ${updateData.status.toLowerCase()} successfully`,
        data: { request: updatedRequest }
      });
    } catch (error) {
      logger.error('Error updating mentorship request status', { error, userId: req.user?.userId });
      
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update mentorship request'
        });
      }
    }
  }

  async getRequestById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const request = await mentorshipService.getRequestById(id);

      if (!request) {
        res.status(404).json({
          success: false,
          message: 'Mentorship request not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { request }
      });
    } catch (error) {
      logger.error('Error getting mentorship request by ID', { error, requestId: req.params.id });
      res.status(500).json({
        success: false,
        message: 'Failed to get mentorship request'
      });
    }
  }

  async getUserRequests(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { type = 'received', page = 1, limit = 10 } = req.query;
      const result = await mentorshipService.getUserRequests(
        req.user.userId,
        type as 'sent' | 'received',
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Error getting user mentorship requests', { error, userId: req.user?.userId });
      res.status(500).json({
        success: false,
        message: 'Failed to get mentorship requests'
      });
    }
  }

  async getPendingRequestsCount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const count = await mentorshipService.getPendingRequestsCount(req.user.userId);

      res.status(200).json({
        success: true,
        data: { count }
      });
    } catch (error) {
      logger.error('Error getting pending requests count', { error, userId: req.user?.userId });
      res.status(500).json({
        success: false,
        message: 'Failed to get pending requests count'
      });
    }
  }
}

export const mentorshipController = new MentorshipController();
export default mentorshipController;
