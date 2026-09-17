import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog';
import { Bank } from '../models/Bank';
import { LoanScheme } from '../models/LoanScheme';
import { GovernmentScheme } from '../models/GovernmentScheme';
import { Institution } from '../models/Institution';
import { DocumentModel } from '../models/Document';
import { Source } from '../models/Source';
import { Application } from '../models/Application';
import { sendSuccess, AppError } from '../utils/apiResponse';
import { runDataQualityAudit } from '../services/dataQuality.service';
import { scanAndFlagExpiredRecords } from '../services/dataFreshness.service';
import { executeResetDemo } from '../seeds/resetDemo';
import { logAuditAction } from '../services/audit.service';

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

export const getDataQuality = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const report = await runDataQualityAudit();
    sendSuccess(res, report, 200, 'Data quality and source integrity audit report generated successfully.');
  } catch (err) {
    next(err);
  }
};

export const triggerFreshnessScan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    const actor = user
      ? { id: user.id || user.userId, email: user.email, role: user.role }
      : undefined;

    const result = await scanAndFlagExpiredRecords(actor);
    sendSuccess(res, result, 200, `Data freshness scan completed. Flagged ${result.expiredCount} expired records.`);
  } catch (err) {
    next(err);
  }
};

export const resetDemoData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    const actor = user
      ? { id: user.id || user.userId, email: user.email || 'admin@edu4loan.org', role: user.role }
      : undefined;

    const result = await executeResetDemo(actor);
    sendSuccess(res, result, 200, `Demo reset complete. Safely removed ${result.totalDeleted} demo records.`);
  } catch (err) {
    next(err);
  }
};

export const verifyEntity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { entity, id } = req.params;
    const user = (req as any).user;
    const normalizedEntity = entity.toLowerCase().replace(/[-_]/g, '');
    const today = new Date().toISOString().split('T')[0];

    let record: any = null;
    let oldStatus = 'needs_verification';

    switch (normalizedEntity) {
      case 'bank': {
        const bank = await Bank.findById(id);
        if (!bank) throw new AppError('Bank not found', 404);
        if (bank.isDemo) throw new AppError('Cannot verify demo bank. Reset demo data or update isDemo flag.', 400);
        if (!bank.overallSource?.sourceUrl || !bank.overallSource.sourceUrl.startsWith('http')) {
          throw new AppError('Cannot verify bank without a valid HTTP/HTTPS source citation URL.', 400);
        }
        oldStatus = bank.overallSource.status;
        bank.overallSource.status = 'verified';
        bank.overallSource.lastVerified = today;
        if (bank.vitBhopalTieUp) {
          bank.vitBhopalTieUp.status = 'verified';
          bank.vitBhopalTieUp.lastVerified = today;
        }
        await bank.save();
        record = bank;
        break;
      }

      case 'loanscheme': {
        const scheme = await LoanScheme.findById(id);
        if (!scheme) throw new AppError('Loan scheme not found', 404);
        if (scheme.isDemo) throw new AppError('Cannot verify demo loan scheme.', 400);
        if (!scheme.source?.sourceUrl || !scheme.source.sourceUrl.startsWith('http')) {
          throw new AppError('Cannot verify loan scheme without a valid sourceUrl.', 400);
        }
        oldStatus = scheme.status;
        scheme.status = 'verified';
        scheme.lastVerified = today;
        if (scheme.interestRate?.minRate) scheme.interestRate.minRate.status = 'verified';
        if (scheme.interestRate?.maxRate) scheme.interestRate.maxRate.status = 'verified';
        await scheme.save();
        record = scheme;
        break;
      }

      case 'governmentscheme': {
        const gov = await GovernmentScheme.findById(id);
        if (!gov) throw new AppError('Government scheme not found', 404);
        if (gov.isDemo) throw new AppError('Cannot verify demo government scheme.', 400);
        if (!gov.source?.sourceUrl || !gov.source.sourceUrl.startsWith('http')) {
          throw new AppError('Cannot verify government scheme without a valid sourceUrl.', 400);
        }
        oldStatus = gov.source.status;
        gov.source.status = 'verified';
        gov.source.lastVerified = today;
        await gov.save();
        record = gov;
        break;
      }

      case 'institution': {
        const inst = await Institution.findById(id);
        if (!inst) throw new AppError('Institution not found', 404);
        if (inst.isDemo) throw new AppError('Cannot verify demo institution.', 400);
        if (inst.officialBankHelpdesk?.source) {
          inst.officialBankHelpdesk.source.status = 'verified';
          inst.officialBankHelpdesk.source.lastVerified = today;
        }
        for (const prog of inst.programs) {
          if (prog.source) {
            prog.source.status = 'verified';
            prog.source.lastVerified = today;
          }
        }
        await inst.save();
        record = inst;
        break;
      }

      case 'document': {
        const doc = await DocumentModel.findById(id);
        if (!doc) throw new AppError('Document not found', 404);
        if (doc.isDemo) throw new AppError('Cannot verify demo document.', 400);
        if (!doc.source?.sourceUrl || !doc.source.sourceUrl.startsWith('http')) {
          throw new AppError('Cannot verify document without a valid sourceUrl.', 400);
        }
        oldStatus = doc.source.status;
        doc.source.status = 'verified';
        doc.source.lastVerified = today;
        await doc.save();
        record = doc;
        break;
      }

      case 'source': {
        const src = await Source.findById(id);
        if (!src) throw new AppError('Source not found', 404);
        if (src.isDemo) throw new AppError('Cannot verify demo source.', 400);
        if (!src.sourceUrl || !src.sourceUrl.startsWith('http')) {
          throw new AppError('Cannot verify source without a valid HTTP sourceUrl.', 400);
        }
        oldStatus = src.status;
        src.status = 'verified';
        src.verifiedAt = new Date();
        src.verifiedBy = user?.email || 'ADMIN';
        await src.save();
        record = src;
        break;
      }

      default:
        throw new AppError(
          `Invalid entity type: ${entity}. Supported: bank, loanscheme, governmentscheme, institution, document, source.`,
          400
        );
    }

    // Log the verification action in AuditLog
    await logAuditAction({
      userId: user?.id || user?.userId || 'ADMIN_USER',
      userEmail: user?.email || 'admin@edu4loan.org',
      userRole: user?.role || 'admin',
      action: 'STATUS_CHANGE',
      entityType: normalizedEntity as any,
      entityId: id,
      fieldChanged: 'status',
      oldValue: oldStatus,
      newValue: 'verified',
      reason: req.body.reason || 'Admin manual verification via administrative portal with authoritative citation check.',
    });

    sendSuccess(res, record, 200, `Successfully verified ${entity} record [${id}].`);
  } catch (err) {
    next(err);
  }
};

