import { Router } from 'express';
import { mentorshipController } from '../controllers/mentorshipController';
import { authenticateToken } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validation';
import { 
  createMentorshipRequestSchema, 
  updateMentorshipRequestSchema, 
  getMentorshipRequestSchema 
} from '../utils/validationSchemas';

const router = Router();

// POST /api/mentorship/request - Create mentorship request
router.post(
  '/request',
  authenticateToken,
  validateBody(createMentorshipRequestSchema),
  mentorshipController.createRequest
);

// PATCH /api/mentorship/:id - Update mentorship request status
router.patch(
  '/:id',
  authenticateToken,
  validateParams(getMentorshipRequestSchema),
  validateBody(updateMentorshipRequestSchema),
  mentorshipController.updateRequestStatus
);

// GET /api/mentorship/:id - Get mentorship request details
router.get(
  '/:id',
  validateParams(getMentorshipRequestSchema),
  mentorshipController.getRequestById
);

// GET /api/mentorship/user/requests - Get user's mentorship requests
router.get(
  '/user/requests',
  authenticateToken,
  mentorshipController.getUserRequests
);

// GET /api/mentorship/user/pending-count - Get pending requests count
router.get(
  '/user/pending-count',
  authenticateToken,
  mentorshipController.getPendingRequestsCount
);

export default router;
