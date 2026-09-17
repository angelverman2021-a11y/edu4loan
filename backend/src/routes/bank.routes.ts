import { Router } from 'express';
import * as bankController from '../controllers/bank.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { createBankSchema, updateBankSchema } from '../validators/bank.validator';

const router = Router();

// Public discovery endpoints
router.get('/', bankController.getBanks);
router.get('/:id', bankController.getBank);

// Admin-only mutation endpoints
router.post(
  '/',
  authenticateJwt,
  requireRole('admin'),
  validateBody(createBankSchema),
  bankController.createBank
);
router.put(
  '/:id',
  authenticateJwt,
  requireRole('admin'),
  validateBody(updateBankSchema),
  bankController.updateBank
);
router.delete('/:id', authenticateJwt, requireRole('admin'), bankController.deleteBank);

export default router;
