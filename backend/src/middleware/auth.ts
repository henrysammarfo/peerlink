import { Request, Response, NextFunction } from 'express';
import { TokenUtils, TokenPayload } from '../utils/tokenUtils';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'Access token is required' 
      });
      return;
    }

    try {
      const decoded = TokenUtils.verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      logger.warn('Invalid access token', { error, token: token.substring(0, 10) + '...' });
      res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired access token' 
      });
    }
  } catch (error) {
    logger.error('Error in authentication middleware', { error });
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during authentication' 
    });
  }
};

export const authenticateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ 
        success: false, 
        message: 'Refresh token is required' 
      });
      return;
    }

    try {
      const decoded = TokenUtils.verifyRefreshToken(refreshToken);
      req.user = decoded;
      next();
    } catch (error) {
      logger.warn('Invalid refresh token', { error });
      res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired refresh token' 
      });
    }
  } catch (error) {
    logger.error('Error in refresh token authentication', { error });
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during refresh token authentication' 
    });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = TokenUtils.verifyAccessToken(token);
        req.user = decoded;
      } catch (error) {
        // Token is invalid, but we continue without authentication
        logger.debug('Invalid token in optional auth, continuing without user', { error });
      }
    }

    next();
  } catch (error) {
    logger.error('Error in optional authentication middleware', { error });
    next(); // Continue without authentication
  }
};
