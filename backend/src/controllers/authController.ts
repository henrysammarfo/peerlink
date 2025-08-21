import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { TokenUtils, TokenPayload } from '../utils/tokenUtils';
import { logger } from '../utils/logger';
import { SignupInput, LoginInput, RefreshTokenInput } from '../utils/validationSchemas';

export class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const userData: SignupInput = req.body;

      // Check if user already exists
      const existingUser = await userService.getUserByEmail(userData.email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
        return;
      }

      // Create new user
      const newUser = await userService.createUser(userData);

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      };

      const tokens = TokenUtils.generateTokenPair(tokenPayload);

      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;

      logger.info('User signed up successfully', { userId: newUser.id, email: newUser.email });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          user: userWithoutPassword,
          tokens
        }
      });
    } catch (error) {
      logger.error('Error in signup', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to create user'
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginInput = req.body;

      // Find user by email
      const user = await userService.getUserByEmail(email);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      // Verify password
      const isPasswordValid = await userService.verifyPassword(user, password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const tokens = TokenUtils.generateTokenPair(tokenPayload);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      logger.info('User logged in successfully', { userId: user.id, email: user.email });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          tokens
        }
      });
    } catch (error) {
      logger.error('Error in login', { error });
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken }: RefreshTokenInput = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
        return;
      }

      // Verify refresh token
      const decoded = TokenUtils.verifyRefreshToken(refreshToken);

      // Get user to ensure they still exist
      const user = await userService.getUserById(decoded.userId);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Generate new token pair
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const newTokens = TokenUtils.generateTokenPair(tokenPayload);

      logger.info('Tokens refreshed successfully', { userId: user.id });

      res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: {
          tokens: newTokens
        }
      });
    } catch (error) {
      logger.error('Error refreshing token', { error });
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      // In a real implementation, you might want to blacklist the token
      // For now, we'll just return a success response
      logger.info('User logged out', { userId: req.user?.userId });

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Error in logout', { error });
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }
}

export const authController = new AuthController();
export default authController;
