import { Router } from 'express';
import * as calculatorController from '../controllers/calculator.controller';

const router = Router();

// POST /api/calculator/emi
router.post('/emi', calculatorController.handleEmiCalculation);

export default router;
