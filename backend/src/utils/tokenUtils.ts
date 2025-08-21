import jwt from 'jsonwebtoken';
import { logger } from './logger';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class TokenUtils {
  private static readonly ACCESS_TOKEN_EXPIRY = '15m';
  private static readonly REFRESH_TOKEN_EXPIRY = '7d';

  static generateAccessToken(payload: TokenPayload): string {
    try {
      const secret = process.env.JWT_ACCESS_SECRET;
      if (!secret) {
        throw new Error('JWT_ACCESS_SECRET not configured');
      }

      return jwt.sign(payload, secret, {
        expiresIn: this.ACCESS_TOKEN_EXPIRY,
        issuer: 'peerlink',
        audience: 'peerlink-users'
      });
    } catch (error) {
      logger.error('Error generating access token', { error, payload });
      throw error;
    }
  }

  static generateRefreshToken(payload: TokenPayload): string {
    try {
      const secret = process.env.JWT_REFRESH_SECRET;
      if (!secret) {
        throw new Error('JWT_REFRESH_SECRET not configured');
      }

      return jwt.sign(payload, secret, {
        expiresIn: this.REFRESH_TOKEN_EXPIRY,
        issuer: 'peerlink',
        audience: 'peerlink-users'
      });
    } catch (error) {
      logger.error('Error generating refresh token', { error, payload });
      throw error;
    }
  }

  static generateTokenPair(payload: TokenPayload): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    };
  }

  static verifyAccessToken(token: string): TokenPayload {
    try {
      const secret = process.env.JWT_ACCESS_SECRET;
      if (!secret) {
        throw new Error('JWT_ACCESS_SECRET not configured');
      }

      const decoded = jwt.verify(token, secret, {
        issuer: 'peerlink',
        audience: 'peerlink-users'
      }) as TokenPayload;

      return decoded;
    } catch (error) {
      logger.error('Error verifying access token', { error, token });
      throw error;
    }
  }

  static verifyRefreshToken(token: string): TokenPayload {
    try {
      const secret = process.env.JWT_REFRESH_SECRET;
      if (!secret) {
        throw new Error('JWT_REFRESH_SECRET not configured');
      }

      const decoded = jwt.verify(token, secret, {
        issuer: 'peerlink',
        audience: 'peerlink-users'
      }) as TokenPayload;

      return decoded;
    } catch (error) {
      logger.error('Error verifying refresh token', { error, token });
      throw error;
    }
  }

  static decodeToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.decode(token) as TokenPayload;
      return decoded;
    } catch (error) {
      logger.error('Error decoding token', { error, token });
      return null;
    }
  }
}

export default TokenUtils;
