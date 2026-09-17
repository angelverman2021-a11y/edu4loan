import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateJwt, requireRole('admin'));

router.get('/metrics', adminController.getDashboardMetrics);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/data-quality', adminController.getDataQuality);
router.post('/scan-freshness', adminController.triggerFreshnessScan);
router.post('/reset-demo', adminController.resetDemoData);
router.post('/verify/:entity/:id', adminController.verifyEntity);

export default router;
