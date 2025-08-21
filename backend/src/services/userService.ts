import { Prisma, User, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { databaseService } from './database';
import { logger } from '../utils/logger';
import { SignupInput, UpdateProfileInput, GetUsersQueryInput } from '../utils/validationSchemas';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  bio?: string;
  skills: string[];
  location?: string;
  role: UserRole;
  availability?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSearchResult {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class UserService {
  private prisma = databaseService.getPrisma();

  async createUser(userData: SignupInput): Promise<UserProfile> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      const user = await this.prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          bio: userData.bio,
          skills: userData.skills,
          location: userData.location,
          role: userData.role as UserRole,
          availability: userData.availability
        }
      });

      logger.info('User created successfully', { userId: user.id, email: user.email });
      return this.mapToUserProfile(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Email already exists');
        }
      }
      logger.error('Error creating user', { error, userData });
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserProfile | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id }
      });

      return user ? this.mapToUserProfile(user) : null;
    } catch (error) {
      logger.error('Error getting user by ID', { error, id });
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      logger.error('Error getting user by email', { error, email });
      throw error;
    }
  }

  async updateUser(id: string, updateData: UpdateProfileInput): Promise<UserProfile> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateData
      });

      logger.info('User updated successfully', { userId: id });
      return this.mapToUserProfile(user);
    } catch (error) {
      logger.error('Error updating user', { error, id, updateData });
      throw error;
    }
  }

  async updateProfilePicture(id: string, profilePicture: string): Promise<UserProfile> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { profilePicture }
      });

      logger.info('Profile picture updated successfully', { userId: id });
      return this.mapToUserProfile(user);
    } catch (error) {
      logger.error('Error updating profile picture', { error, id });
      throw error;
    }
  }

  async searchUsers(query: GetUsersQueryInput): Promise<UserSearchResult> {
    try {
      const { skill, location, role, availability, page, limit } = query;
      const skip = (page - 1) * limit;

      const where: Prisma.UserWhereInput = {};

      if (skill) {
        where.skills = {
          has: skill
        };
      }

      if (location) {
        where.location = {
          contains: location,
          mode: 'insensitive'
        };
      }

      if (role) {
        where.role = role;
      }

      if (availability) {
        where.availability = {
          contains: availability,
          mode: 'insensitive'
        };
      }

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            name: true,
            bio: true,
            skills: true,
            location: true,
            role: true,
            availability: true,
            profilePicture: true,
            createdAt: true,
            updatedAt: true
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.user.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        users: users.map(user => this.mapToUserProfile(user)),
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      logger.error('Error searching users', { error, query });
      throw error;
    }
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, user.password);
    } catch (error) {
      logger.error('Error verifying password', { error, userId: user.id });
      return false;
    }
  }

  private mapToUserProfile(user: User): UserProfile {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      skills: user.skills,
      location: user.location,
      role: user.role,
      availability: user.availability,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}

export const userService = new UserService();
export default userService;
