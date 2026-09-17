import { Request, Response, NextFunction } from 'express';
import { findRelevantLoanSchemes } from '../services/loanFinder.service';
import { sendSuccess } from '../utils/apiResponse';

export const findLoanSchemes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await findRelevantLoanSchemes(req.body);
    sendSuccess(res, result, 200);
  } catch (err) {
    next(err);
  }
};
