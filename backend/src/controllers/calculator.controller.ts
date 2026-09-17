import { Request, Response, NextFunction } from 'express';
import { calculateEmi } from '../services/calculator.service';
import { sendSuccess } from '../utils/apiResponse';

export const handleEmiCalculation = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const result = calculateEmi(req.body);
    sendSuccess(res, result, 200);
  } catch (err) {
    next(err);
  }
};
