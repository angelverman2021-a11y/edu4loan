import { Router } from 'express';
import * as govController from '../controllers/governmentScheme.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Public discovery endpoints
router.get('/', govController.getGovernmentSchemes);
router.get('/:code', govController.getGovernmentSchemeByCode);

// Admin-only mutation endpoints
router.post('/', authenticateJwt, requireRole('admin'), govController.createGovernmentScheme);
router.put('/:id', authenticateJwt, requireRole('admin'), govController.updateGovernmentScheme);

export default router;
