import { Request, Response, NextFunction } from 'express';
import { Institution } from '../models/Institution';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { isValidObjectId } from '../utils/querySafety';

export const getInstitutionDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const institution = await Institution.findOne({ name: 'VIT Bhopal University' }).lean();
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

export const getInstitutionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    let institution = null;

    if (isValidObjectId(id)) {
      institution = await Institution.findById(id).lean();
    }

    if (!institution) {
      // Allow lookup by slug or name
      institution = await Institution.findOne({
        $or: [
          { name: new RegExp(id.replace(/-/g, ' '), 'i') },
          { name: 'VIT Bhopal University' },
        ],
      }).lean();
    }

    if (!institution) {
      sendError(res, 404, 'INSTITUTION_NOT_FOUND', 'Institution not found.');
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
