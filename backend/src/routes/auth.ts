import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { signupSchema, loginSchema, refreshTokenSchema } from '../utils/validationSchemas';

const router = Router();

// POST /api/auth/signup
router.post(
  '/signup',
  validateBody(signupSchema),
  authController.signup
);

// POST /api/auth/login
router.post(
  '/login',
  validateBody(loginSchema),
  authController.login
);

// POST /api/auth/refresh
router.post(
  '/refresh',
  validateBody(refreshTokenSchema),
  authController.refreshToken
);

// POST /api/auth/logout
router.post(
  '/logout',
  authenticateToken,
  authController.logout
);

export default router;
