import { Request, Response, NextFunction } from 'express';
import { Institution } from '../models/Institution';
import { sendSuccess } from '../utils/apiResponse';

export const getInstitutionDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const institution = await Institution.findOne({ name: 'VIT Bhopal University' });
    if (!institution) {
      // Fallback empty default template if not seeded yet
      sendSuccess(res, {
        name: 'VIT Bhopal University',
        status: 'pending_seed',
        message: 'Institution profile ready for seed ingestion in Phase 3.',
      });
      return;
    }
    sendSuccess(res, institution, 200);
  } catch (err) {
    next(err);
  }
};

export const updateInstitutionDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const institution = await Institution.findOneAndUpdate(
      { name: 'VIT Bhopal University' },
      req.body,
      { new: true, upsert: true }
    );
    sendSuccess(res, institution, 200, 'VIT Bhopal institution details updated.');
  } catch (err) {
    next(err);
  }
};
