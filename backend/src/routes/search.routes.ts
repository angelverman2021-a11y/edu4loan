import { Router } from 'express';
import * as searchController from '../controllers/search.controller';

const router = Router();

// GET /api/search?q=
router.get('/', searchController.globalSearch);

export default router;
