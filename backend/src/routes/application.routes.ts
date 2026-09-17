import { Router } from 'express';
import * as appController from '../controllers/application.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

// All application routes require student authentication
router.use(authenticateJwt);

router.get('/', appController.getMyApplications);
router.get('/:id', appController.getApplicationById);
router.post('/', appController.createApplication);
router.put('/:id', appController.updateApplication);
router.post('/:id/logs', appController.addBankVisitLog);
router.post('/:id/bank-visits', appController.addBankVisitLog);
router.delete('/:id', appController.deleteApplication);

export default router;
