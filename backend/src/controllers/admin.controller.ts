import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog';
import { Bank } from '../models/Bank';
import { LoanScheme } from '../models/LoanScheme';
import { GovernmentScheme } from '../models/GovernmentScheme';
import { Institution } from '../models/Institution';
import { DocumentModel } from '../models/Document';
import { Source } from '../models/Source';
import { Application } from '../models/Application';
import { FAQ } from '../models/FAQ';
import { WhatIfScenario } from '../models/WhatIfScenario';
import { ChatbotKnowledge } from '../models/ChatbotKnowledge';
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

export const getCatalogEntities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { entity } = req.params;
    const normalized = entity.toLowerCase().replace(/[-_]/g, '');

    let records: any[] = [];
    switch (normalized) {
      case 'bank':
      case 'banks':
        records = await Bank.find().sort({ name: 1 });
        break;
      case 'loanscheme':
      case 'loanschemes':
      case 'scheme':
      case 'schemes':
        records = await LoanScheme.find().sort({ schemeName: 1 });
        break;
      case 'document':
      case 'documents':
        records = await DocumentModel.find().sort({ category: 1, name: 1 });
        break;
      case 'faq':
      case 'faqs':
        records = await FAQ.find().sort({ category: 1 });
        break;
      case 'whatifscenario':
      case 'whatifscenarios':
      case 'whatif':
        records = await WhatIfScenario.find().sort({ scenarioCode: 1 });
        break;
      case 'chatbotknowledge':
      case 'chatbot':
        records = await ChatbotKnowledge.find().sort({ topicKey: 1 });
        break;
      case 'source':
      case 'sources':
        records = await Source.find().sort({ issuingAuthority: 1 });
        break;
      case 'governmentscheme':
      case 'governmentschemes':
        records = await GovernmentScheme.find().sort({ schemeName: 1 });
        break;
      default:
        throw new AppError(
          `Invalid catalog entity: ${entity}. Supported: bank, loanscheme, document, faq, whatifscenario, chatbotknowledge, source, governmentscheme`,
          400
        );
    }

    sendSuccess(res, records, 200, undefined, { count: records.length, entity: normalized });
  } catch (err) {
    next(err);
  }
};

export const updateEntityStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { entity, id } = req.params;
    const { status, verificationDate, source, sourceUrl, reason, notes } = req.body;
    const user = (req as any).user;
    const normalizedEntity = entity.toLowerCase().replace(/[-_]/g, '');
    const today = verificationDate || new Date().toISOString().split('T')[0];

    // Normalized status: VERIFIED | NEEDS_REVIEW | OUTDATED | UNAVAILABLE
    const validStatuses = ['VERIFIED', 'NEEDS_REVIEW', 'OUTDATED', 'UNAVAILABLE'];
    const upperStatus = (status || 'VERIFIED').toUpperCase();
    if (!validStatuses.includes(upperStatus)) {
      throw new AppError(`Invalid status: ${status}. Supported: ${validStatuses.join(', ')}`, 400);
    }

    // Map to schema internal status: 'verified' | 'needs_verification' | 'expired'
    const schemaStatus: 'verified' | 'needs_verification' | 'expired' =
      upperStatus === 'VERIFIED'
        ? 'verified'
        : upperStatus === 'OUTDATED'
        ? 'expired'
        : 'needs_verification';

    let record: any = null;
    let oldStatus = 'NEEDS_REVIEW';

    switch (normalizedEntity) {
      case 'bank':
      case 'banks': {
        const bank = await Bank.findById(id);
        if (!bank) throw new AppError('Bank not found', 404);
        oldStatus = bank.verificationStatus || bank.overallSource?.status || 'NEEDS_REVIEW';
        bank.verificationStatus = upperStatus as any;
        bank.lastVerifiedAt = today;
        if (source) bank.source = source;
        if (sourceUrl) bank.sourceUrl = sourceUrl;
        if (bank.overallSource) {
          bank.overallSource.status = schemaStatus;
          bank.overallSource.lastVerified = today;
          if (source) bank.overallSource.source = source;
          if (sourceUrl) bank.overallSource.sourceUrl = sourceUrl;
        }
        await bank.save();
        record = bank;
        break;
      }

      case 'loanscheme':
      case 'loanschemes':
      case 'scheme':
      case 'schemes': {
        const scheme = await LoanScheme.findById(id);
        if (!scheme) throw new AppError('Loan scheme not found', 404);
        oldStatus = scheme.verificationStatus || scheme.status || 'NEEDS_REVIEW';
        scheme.verificationStatus = upperStatus as any;
        scheme.lastVerifiedAt = today;
        scheme.lastVerified = today;
        scheme.status = schemaStatus;
        if (sourceUrl) scheme.sourceUrl = sourceUrl;
        if (scheme.source) {
          scheme.source.status = schemaStatus;
          scheme.source.lastVerified = today;
          if (source) scheme.source.source = source;
          if (sourceUrl) scheme.source.sourceUrl = sourceUrl;
        }
        await scheme.save();
        record = scheme;
        break;
      }

      case 'document':
      case 'documents': {
        const doc = await DocumentModel.findById(id);
        if (!doc) throw new AppError('Document not found', 404);
        oldStatus = doc.source?.status || 'NEEDS_REVIEW';
        if (doc.source) {
          doc.source.status = schemaStatus;
          doc.source.lastVerified = today;
          if (source) doc.source.source = source;
          if (sourceUrl) doc.source.sourceUrl = sourceUrl;
        }
        await doc.save();
        record = doc;
        break;
      }

      case 'faq':
      case 'faqs': {
        const faq = await FAQ.findById(id);
        if (!faq) throw new AppError('FAQ not found', 404);
        oldStatus = 'VERIFIED';
        if (source) faq.officialReference = source;
        if (sourceUrl) faq.officialReferenceUrl = sourceUrl;
        await faq.save();
        record = faq;
        break;
      }

      case 'whatifscenario':
      case 'whatifscenarios':
      case 'whatif': {
        const scenario = await WhatIfScenario.findById(id);
        if (!scenario) throw new AppError('What-If scenario not found', 404);
        oldStatus = scenario.officialSource?.status || 'NEEDS_REVIEW';
        if (scenario.officialSource) {
          scenario.officialSource.status = schemaStatus;
          scenario.officialSource.lastVerified = today;
          if (source) scenario.officialSource.source = source;
          if (sourceUrl) scenario.officialSource.sourceUrl = sourceUrl;
        }
        await scenario.save();
        record = scenario;
        break;
      }

      case 'chatbotknowledge':
      case 'chatbot': {
        const knowledge = await ChatbotKnowledge.findById(id);
        if (!knowledge) throw new AppError('Chatbot knowledge not found', 404);
        oldStatus = knowledge.verificationStatus || 'NEEDS_REVIEW';
        knowledge.verificationStatus = schemaStatus;
        knowledge.lastVerified = today;
        if (source) knowledge.sourceTitle = source;
        if (sourceUrl) knowledge.sourceUrl = sourceUrl;
        await knowledge.save();
        record = knowledge;
        break;
      }

      case 'source':
      case 'sources': {
        const src = await Source.findById(id);
        if (!src) throw new AppError('Source not found', 404);
        oldStatus = src.status || 'NEEDS_REVIEW';
        src.status = schemaStatus;
        src.verifiedAt = new Date(today);
        src.verifiedBy = user?.email || 'ADMIN';
        if (sourceUrl) src.sourceUrl = sourceUrl;
        if (notes) src.notes = notes;
        await src.save();
        record = src;
        break;
      }

      default:
        throw new AppError(
          `Invalid entity type: ${entity}. Supported: bank, loanscheme, document, faq, whatifscenario, chatbotknowledge, source.`,
          400
        );
    }

    // Record audit log
    await logAuditAction({
      userId: user?.id || user?.userId || 'ADMIN_USER',
      userEmail: user?.email || 'admin@edu4loan.org',
      userRole: user?.role || 'admin',
      action: 'STATUS_CHANGE',
      entityType: normalizedEntity as any,
      entityId: id,
      fieldChanged: 'verificationStatus',
      oldValue: String(oldStatus),
      newValue: upperStatus,
      reason: reason || `Admin updated status to ${upperStatus} and verification date to ${today}`,
    });

    sendSuccess(res, record, 200, `Successfully updated ${entity} [${id}] status to ${upperStatus}`);
  } catch (err) {
    next(err);
  }
};

