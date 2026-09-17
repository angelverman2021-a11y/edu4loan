import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog';
import { Bank } from '../models/Bank';
import { LoanScheme } from '../models/LoanScheme';
import { Source } from '../models/Source';
import { Application } from '../models/Application';
import { sendSuccess } from '../utils/apiResponse';

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = parseInt((req.query.limit as string) || '50', 10);
    const entityType = req.query.entityType as string | undefined;
    const filter: any = {};
    if (entityType) filter.entityType = entityType;

    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(limit);
    sendSuccess(res, logs, 200, undefined, { count: logs.length });
  } catch (err) {
    next(err);
  }
};

export const getDashboardMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [bankCount, schemeCount, sourceCount, applicationCount, unverifiedSources, recentLogs] =
      await Promise.all([
        Bank.countDocuments(),
        LoanScheme.countDocuments(),
        Source.countDocuments(),
        Application.countDocuments(),
        Source.countDocuments({ status: { $ne: 'verified' } }),
        AuditLog.find().sort({ createdAt: -1 }).limit(10),
      ]);

    sendSuccess(res, {
      banks: { total: bankCount },
      loanSchemes: { total: schemeCount },
      sources: {
        total: sourceCount,
        unverifiedCount: unverifiedSources,
      },
      studentApplicationsTracked: applicationCount,
      recentAuditActivity: recentLogs,
    });
  } catch (err) {
    next(err);
  }
};
