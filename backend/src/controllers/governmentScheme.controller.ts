import { Request, Response, NextFunction } from 'express';
import { GovernmentScheme } from '../models/GovernmentScheme';
import { sendSuccess } from '../utils/apiResponse';

export const getGovernmentSchemes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const schemes = await GovernmentScheme.find({}).sort({ schemeName: 1 });
    sendSuccess(res, schemes, 200, undefined, { count: schemes.length });
  } catch (err) {
    next(err);
  }
};

export const getGovernmentSchemeByCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const scheme = await GovernmentScheme.findOne({ schemeCode: req.params.code.toUpperCase() });
    if (!scheme) {
      res.status(404).json({ success: false, error: { code: 'SCHEME_NOT_FOUND', message: 'Government scheme not found' } });
      return;
    }
    sendSuccess(res, scheme, 200);
  } catch (err) {
    next(err);
  }
};

export const createGovernmentScheme = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const scheme = await GovernmentScheme.create(req.body);
    sendSuccess(res, scheme, 201, 'Government scheme created.');
  } catch (err) {
    next(err);
  }
};

export const updateGovernmentScheme = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const scheme = await GovernmentScheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendSuccess(res, scheme, 200, 'Government scheme updated.');
  } catch (err) {
    next(err);
  }
};
