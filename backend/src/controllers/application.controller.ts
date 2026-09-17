import { Response, NextFunction } from 'express';
import { Application } from '../models/Application';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { isValidObjectId } from '../utils/querySafety';

export const getMyApplications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const apps = await Application.find({ userId }).sort({ updatedAt: -1 });
    sendSuccess(res, apps, 200, undefined, { count: apps.length });
  } catch (err) {
    next(err);
  }
};

export const getApplicationById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isValidObjectId(req.params.id)) {
      sendError(res, 400, 'INVALID_ID', 'Invalid application tracking ID format.');
      return;
    }
    const userId = req.user!.userId;
    const app = await Application.findOne({ _id: req.params.id, userId });
    if (!app) {
      sendError(res, 404, 'APPLICATION_NOT_FOUND', 'Application tracker not found.');
      return;
    }
    sendSuccess(res, app, 200);
  } catch (err) {
    next(err);
  }
};

export const createApplication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const app = await Application.create({
      ...req.body,
      userId,
      isStudentEnteredSelfReported: true, // Never claim live bank feed
    });
    sendSuccess(res, app, 201, 'Application tracking entry initialized.');
  } catch (err) {
    next(err);
  }
};

export const updateApplication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isValidObjectId(req.params.id)) {
      sendError(res, 400, 'INVALID_ID', 'Invalid application tracking ID format.');
      return;
    }
    const userId = req.user!.userId;
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: req.body },
      { new: true }
    );
    if (!app) {
      sendError(res, 404, 'APPLICATION_NOT_FOUND', 'Application tracker not found.');
      return;
    }
    sendSuccess(res, app, 200, 'Application status updated.');
  } catch (err) {
    next(err);
  }
};

export const addBankVisitLog = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isValidObjectId(req.params.id)) {
      sendError(res, 400, 'INVALID_ID', 'Invalid application tracking ID format.');
      return;
    }
    const userId = req.user!.userId;
    const app = await Application.findOne({ _id: req.params.id, userId });
    if (!app) {
      sendError(res, 404, 'APPLICATION_NOT_FOUND', 'Application tracker not found.');
      return;
    }

    app.bankVisitLogs.push(req.body);
    await app.save();

    sendSuccess(res, app, 200, 'Bank branch visit log added.');
  } catch (err) {
    next(err);
  }
};

export const deleteApplication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isValidObjectId(req.params.id)) {
      sendError(res, 400, 'INVALID_ID', 'Invalid application tracking ID format.');
      return;
    }
    const userId = req.user!.userId;
    const app = await Application.findOneAndDelete({ _id: req.params.id, userId });
    if (!app) {
      sendError(res, 404, 'APPLICATION_NOT_FOUND', 'Application tracker not found.');
      return;
    }
    sendSuccess(res, { deletedId: req.params.id }, 200, 'Application tracker deleted.');
  } catch (err) {
    next(err);
  }
};
