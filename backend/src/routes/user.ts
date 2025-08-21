import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../middleware/validation';
import { updateProfileSchema, getUsersQuerySchema, getUserSchema } from '../utils/validationSchemas';
import { uploadProfilePicture, handleUploadError } from '../middleware/upload';

const router = Router();

// GET /api/user/me - Get current user profile
router.get(
  '/me',
  authenticateToken,
  userController.getCurrentUser
);

// PATCH /api/user/update - Update current user profile
router.patch(
  '/update',
  authenticateToken,
  validateBody(updateProfileSchema),
  userController.updateProfile
);

// POST /api/user/upload-picture - Upload profile picture
router.post(
  '/upload-picture',
  authenticateToken,
  uploadProfilePicture,
  handleUploadError,
  userController.uploadProfilePicture
);

// GET /api/users - Search/browse users
router.get(
  '/',
  validateQuery(getUsersQuerySchema),
  userController.getUsers
);

// GET /api/users/:id - Get specific user profile
router.get(
  '/:id',
  validateParams(getUserSchema),
  userController.getUserById
);

export default router;
