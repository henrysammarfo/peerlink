import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { userService } from '../services/userService';
import { logger } from '../utils/logger';
import { UpdateProfileInput } from '../utils/validationSchemas';
import { getFileUrl, deleteFile } from '../middleware/upload';

export class UserController {
  async getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const user = await userService.getUserById(req.user.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      logger.error('Error getting current user', { error, userId: req.user?.userId });
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile'
      });
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const updateData: UpdateProfileInput = req.body;
      const updatedUser = await userService.updateUser(req.user.userId, updateData);

      logger.info('User profile updated', { userId: req.user.userId });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      logger.error('Error updating user profile', { error, userId: req.user?.userId });
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  }

  async uploadProfilePicture(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
        return;
      }

      // Get current user to check if they have an existing profile picture
      const currentUser = await userService.getUserById(req.user.userId);
      if (currentUser?.profilePicture) {
        // Delete old profile picture
        deleteFile(currentUser.profilePicture);
      }

      // Update user with new profile picture
      const filename = req.file.filename;
      const updatedUser = await userService.updateProfilePicture(req.user.userId, filename);

      logger.info('Profile picture uploaded', { userId: req.user.userId, filename });

      res.status(200).json({
        success: true,
        message: 'Profile picture uploaded successfully',
        data: { 
          user: updatedUser,
          profilePictureUrl: getFileUrl(filename)
        }
      });
    } catch (error) {
      logger.error('Error uploading profile picture', { error, userId: req.user?.userId });
      res.status(500).json({
        success: false,
        message: 'Failed to upload profile picture'
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      logger.error('Error getting user by ID', { error, userId: req.params.id });
      res.status(500).json({
        success: false,
        message: 'Failed to get user'
      });
    }
  }

  async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const result = await userService.searchUsers(query);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Error searching users', { error, query: req.query });
      res.status(500).json({
        success: false,
        message: 'Failed to search users'
      });
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query;
      const result = await userService.searchUsers(query);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Error getting users', { error, query: req.query });
      res.status(500).json({
        success: false,
        message: 'Failed to get users'
      });
    }
  }
}

export const userController = new UserController();
export default userController;
