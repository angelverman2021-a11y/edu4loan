import { Router } from 'express';
import * as faqController from '../controllers/faq.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Public FAQ queries
router.get('/', faqController.getFAQs);

// Admin-only FAQ management
router.post('/', authenticateJwt, requireRole('admin'), faqController.createFAQ);
router.put('/:id', authenticateJwt, requireRole('admin'), faqController.updateFAQ);
router.delete('/:id', authenticateJwt, requireRole('admin'), faqController.deleteFAQ);

export default router;
