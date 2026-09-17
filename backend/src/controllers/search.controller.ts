import { Request, Response, NextFunction } from 'express';
import { executeGlobalSearch } from '../services/search.service';
import { sendSuccess, AppError } from '../utils/apiResponse';

export const globalSearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawQuery = (req.query.q || req.query.query) as string | undefined;
    if (!rawQuery || !rawQuery.trim()) {
      throw new AppError('Search query parameter q is required.', 400, 'VALIDATION_ERROR');
    }
    const results = await executeGlobalSearch(rawQuery.trim());
    sendSuccess(res, results, 200);
  } catch (err) {
    next(err);
  }
};
