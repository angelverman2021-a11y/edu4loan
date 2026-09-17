import { Bank } from '../models/Bank';
import { LoanScheme } from '../models/LoanScheme';
import { GovernmentScheme } from '../models/GovernmentScheme';
import { Source } from '../models/Source';
import { logAuditAction } from './audit.service';

export const getReviewThresholdDays = (): number => {
  const envDays = process.env.DATA_REVIEW_DAYS;
  if (envDays) {
    const parsed = parseInt(envDays, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return 90; // Default review threshold: 90 days
};

export interface FreshnessStatus {
  isFresh: boolean;
  daysSinceVerification: number;
  thresholdDays: number;
  status: 'verified' | 'needs_verification' | 'expired';
}

export const evaluateFreshness = (
  lastVerifiedString: string | undefined,
  currentStatus: 'verified' | 'needs_verification' | 'expired',
  customThreshold?: number
): FreshnessStatus => {
  const thresholdDays = customThreshold || getReviewThresholdDays();

  if (!lastVerifiedString) {
    return {
      isFresh: false,
      daysSinceVerification: 9999,
      thresholdDays,
      status: 'needs_verification',
    };
  }

  const verifiedDate = new Date(lastVerifiedString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - verifiedDate.getTime());
  const daysSinceVerification = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (currentStatus === 'verified' && daysSinceVerification > thresholdDays) {
    return {
      isFresh: false,
      daysSinceVerification,
      thresholdDays,
      status: 'expired',
    };
  }

  return {
    isFresh: daysSinceVerification <= thresholdDays && currentStatus === 'verified',
    daysSinceVerification,
    thresholdDays,
    status: currentStatus,
  };
};

export const scanAndFlagExpiredRecords = async (adminActor?: {
  id: string;
  email: string;
  role: string;
}): Promise<{
  totalScanned: number;
  expiredCount: number;
  flaggedSchemes: string[];
  flaggedBanks: string[];
  flaggedSources: string[];
}> => {
  const thresholdDays = getReviewThresholdDays();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - thresholdDays);
  const cutoffIso = cutoffDate.toISOString().split('T')[0];

  const actor = adminActor || {
    id: 'SYSTEM_FRESHNESS_JOB',
    email: 'system.job@edu4loan.org',
    role: 'admin',
  };

  const flaggedSchemes: string[] = [];
  const flaggedBanks: string[] = [];
  const flaggedSources: string[] = [];

  // 1. Scan Loan Schemes
  const schemesToFlag = await LoanScheme.find({
    status: 'verified',
    isDemo: false,
    lastVerified: { $lt: cutoffIso },
  });

  for (const scheme of schemesToFlag) {
    const oldStatus = scheme.status;
    scheme.status = 'expired';
    await scheme.save();
    flaggedSchemes.push(scheme.schemeName);

    await logAuditAction({
      userId: actor.id,
      userEmail: actor.email,
      userRole: actor.role,
      action: 'STATUS_CHANGE',
      entityType: 'loanScheme',
      entityId: scheme._id.toString(),
      fieldChanged: 'status',
      oldValue: oldStatus,
      newValue: 'expired',
      reason: `Automated Data Freshness Engine: Verification date (${scheme.lastVerified}) exceeded review threshold of ${thresholdDays} days.`,
    });
  }

  // 2. Scan Banks
  const banksToFlag = await Bank.find({
    'overallSource.status': 'verified',
    isDemo: false,
    'overallSource.lastVerified': { $lt: cutoffIso },
  });

  for (const bank of banksToFlag) {
    const oldStatus = bank.overallSource.status;
    bank.overallSource.status = 'expired';
    await bank.save();
    flaggedBanks.push(bank.name);

    await logAuditAction({
      userId: actor.id,
      userEmail: actor.email,
      userRole: actor.role,
      action: 'STATUS_CHANGE',
      entityType: 'bank',
      entityId: bank._id.toString(),
      fieldChanged: 'overallSource.status',
      oldValue: oldStatus,
      newValue: 'expired',
      reason: `Automated Data Freshness Engine: Verification date exceeded review threshold of ${thresholdDays} days.`,
    });
  }

  // 3. Scan Sources
  const sourcesToFlag = await Source.find({
    status: 'verified',
    isDemo: false,
    verifiedAt: { $lt: cutoffDate },
  });

  for (const source of sourcesToFlag) {
    const oldStatus = source.status;
    source.status = 'expired';
    await source.save();
    flaggedSources.push(source.sourceName);

    await logAuditAction({
      userId: actor.id,
      userEmail: actor.email,
      userRole: actor.role,
      action: 'STATUS_CHANGE',
      entityType: 'source',
      entityId: source._id.toString(),
      fieldChanged: 'status',
      oldValue: oldStatus,
      newValue: 'expired',
      reason: `Automated Data Freshness Engine: Verification date exceeded review threshold of ${thresholdDays} days.`,
    });
  }

  const expiredCount = flaggedSchemes.length + flaggedBanks.length + flaggedSources.length;
  return {
    totalScanned: schemesToFlag.length + banksToFlag.length + sourcesToFlag.length,
    expiredCount,
    flaggedSchemes,
    flaggedBanks,
    flaggedSources,
  };
};
