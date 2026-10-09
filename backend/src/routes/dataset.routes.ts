import { Router } from 'express';
import { DatasetController } from '../controllers/dataset.controller';

const router = Router();

router.get('/banks', DatasetController.getBanks);
router.get('/loan-types', DatasetController.getLoanTypes);
router.get('/products/:type', DatasetController.getLoanProducts);
router.post('/compare', DatasetController.compareLoans);
router.get('/interest-rates', DatasetController.getInterestRates);

export default router;
