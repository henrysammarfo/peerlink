import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import mentorshipRoutes from './mentorship';
import messageRoutes from './message';

const router = Router();

// API version prefix
const API_PREFIX = '/api';

// Mount routes
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/user`, userRoutes);
router.use(`${API_PREFIX}/users`, userRoutes);
router.use(`${API_PREFIX}/mentorship`, mentorshipRoutes);
router.use(`${API_PREFIX}/messages`, messageRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PeerLink API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;
