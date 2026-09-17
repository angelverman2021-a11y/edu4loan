import { Router } from 'express';
import * as documentController from '../controllers/document.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Public checklist & personalized generator endpoints
router.get('/', documentController.getDocuments);
router.post('/personalized', documentController.generatePersonalizedChecklist);

// Admin-only mutation endpoints
router.post('/', authenticateJwt, requireRole('admin'), documentController.createDocument);
router.put('/:id', authenticateJwt, requireRole('admin'), documentController.updateDocument);
router.delete('/:id', authenticateJwt, requireRole('admin'), documentController.deleteDocument);

export default router;
