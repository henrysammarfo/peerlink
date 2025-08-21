import { z } from 'zod';

// Auth Schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().optional(),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  location: z.string().optional(),
  role: z.enum(['MENTOR', 'LEARNER']).default('LEARNER'),
  availability: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

// User Schemas
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).min(1, 'At least one skill is required').optional(),
  location: z.string().optional(),
  role: z.enum(['MENTOR', 'LEARNER']).optional(),
  availability: z.string().optional()
});

export const getUserSchema = z.object({
  id: z.string().cuid('Invalid user ID')
});

export const getUsersQuerySchema = z.object({
  skill: z.string().optional(),
  location: z.string().optional(),
  role: z.enum(['MENTOR', 'LEARNER']).optional(),
  availability: z.string().optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).default('10')
});

// Mentorship Schemas
export const createMentorshipRequestSchema = z.object({
  toUserId: z.string().cuid('Invalid user ID'),
  message: z.string().optional()
});

export const updateMentorshipRequestSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED']),
  message: z.string().optional()
});

export const getMentorshipRequestSchema = z.object({
  id: z.string().cuid('Invalid request ID')
});

// Message Schemas
export const sendMessageSchema = z.object({
  receiverId: z.string().cuid('Invalid user ID'),
  content: z.string().min(1, 'Message content is required').max(1000, 'Message too long')
});

export const getMessagesQuerySchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('50')
});

// File Upload Schema
export const fileUploadSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string().refine(
    (type) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(type),
    'Only image files are allowed'
  ),
  size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB')
});

// Export types
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateMentorshipRequestInput = z.infer<typeof createMentorshipRequestSchema>;
export type UpdateMentorshipRequestInput = z.infer<typeof updateMentorshipRequestSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type GetUsersQueryInput = z.infer<typeof getUsersQuerySchema>;
export type GetMessagesQueryInput = z.infer<typeof getMessagesQuerySchema>;
