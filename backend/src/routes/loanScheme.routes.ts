import { Router } from 'express';
import * as schemeController from '../controllers/loanScheme.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { createLoanSchemeSchema, updateLoanSchemeSchema } from '../validators/loanScheme.validator';

const router = Router();

// Public discovery endpoints
router.get('/', schemeController.getLoanSchemes);
router.get('/compare', schemeController.compareSchemes);
router.get('/:id', schemeController.getLoanScheme);

// Admin-only mutation endpoints
router.post(
  '/',
  authenticateJwt,
  requireRole('admin'),
  validateBody(createLoanSchemeSchema),
  schemeController.createLoanScheme
);
router.put(
  '/:id',
  authenticateJwt,
  requireRole('admin'),
  validateBody(updateLoanSchemeSchema),
  schemeController.updateLoanScheme
);
router.delete('/:id', authenticateJwt, requireRole('admin'), schemeController.deleteLoanScheme);

export default router;
