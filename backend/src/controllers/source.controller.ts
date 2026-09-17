import { Request, Response, NextFunction } from 'express';
import { Source } from '../models/Source';
import * as sourceService from '../services/source.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { escapeRegex, parsePagination, buildPaginationMeta, isValidObjectId } from '../utils/querySafety';

export const getSources = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const status = req.query.status as string | undefined;
    const sourceType = req.query.sourceType as string | undefined;
    const search = req.query.search as string | undefined;

    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (sourceType) filter.sourceType = sourceType;

    if (search && search.trim()) {
      const safePattern = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [
        { name: safePattern },
        { organization: safePattern },
        { description: safePattern },
      ];
    }

    const [sources, total] = await Promise.all([
      Source.find(filter).sort({ verifiedAt: -1 }).skip(skip).limit(limit).lean(),
      Source.countDocuments(filter),
    ]);

    const pagination = buildPaginationMeta(page, limit, total);
    sendSuccess(res, sources, 200, undefined, {
      count: sources.length,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};

export const getSource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!isValidObjectId(req.params.id)) {
      sendError(res, 400, 'INVALID_ID', 'Invalid source ID format.');
      return;
    }
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
