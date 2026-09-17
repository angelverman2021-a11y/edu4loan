import { Router } from 'express';
import * as instController from '../controllers/institution.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Public discovery endpoint
router.get('/', instController.getInstitutionDetails);

// Admin-only mutation endpoint
router.put('/', authenticateJwt, requireRole('admin'), instController.updateInstitutionDetails);

export default router;
