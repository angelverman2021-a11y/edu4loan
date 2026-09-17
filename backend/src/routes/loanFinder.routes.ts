import { Router } from 'express';
import * as loanFinderController from '../controllers/loanFinder.controller';

const router = Router();

// POST /api/loan-finder
router.post('/', loanFinderController.findLoanSchemes);

export default router;
