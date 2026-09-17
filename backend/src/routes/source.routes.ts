import { Router } from 'express';
import * as sourceController from '../controllers/source.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Public source audit viewing
router.get('/', sourceController.getSources);
router.get('/:id', sourceController.getSource);

// Admin-only mutation endpoints
router.post('/', authenticateJwt, requireRole('admin'), sourceController.createSource);
router.patch('/:id/status', authenticateJwt, requireRole('admin'), sourceController.updateStatus);

export default router;
