import { Request, Response, NextFunction } from 'express';
import * as sourceService from '../services/source.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { sendSuccess } from '../utils/apiResponse';

export const getSources = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const status = req.query.status as string | undefined;
    const sources = await sourceService.listSources(status);
    sendSuccess(res, sources, 200, undefined, { count: sources.length });
  } catch (err) {
    next(err);
  }
};

export const getSource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const source = await sourceService.getSourceById(req.params.id);
    sendSuccess(res, source, 200);
  } catch (err) {
    next(err);
  }
};

export const createSource = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminUser = {
      id: req.user!.userId,
      email: (req as any).userEmail || 'admin@edu4loan.org',
      role: req.user!.role,
    };
    const source = await sourceService.createSource(req.body, adminUser, req.ip);
    sendSuccess(res, source, 201, 'Primary official source registered.');
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, notes } = req.body;
    const adminUser = {
      id: req.user!.userId,
      email: (req as any).userEmail || 'admin@edu4loan.org',
      role: req.user!.role,
    };
    const source = await sourceService.updateSourceVerificationStatus(
      req.params.id,
      status,
      adminUser,
      notes,
      req.ip
    );
    sendSuccess(res, source, 200, `Source status updated to ${status}`);
  } catch (err) {
    next(err);
  }
};
