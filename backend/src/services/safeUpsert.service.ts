import { Bank, IBank } from '../models/Bank';
import { LoanScheme, ILoanScheme } from '../models/LoanScheme';
import { GovernmentScheme, IGovernmentScheme } from '../models/GovernmentScheme';
import { DocumentModel, IDocumentItem } from '../models/Document';
import { Institution, IInstitution } from '../models/Institution';
import { Source, ISource } from '../models/Source';
import { logAuditAction } from './audit.service';

export interface UpsertOptions {
  allowVerifiedDowngrade?: boolean;
  actor?: {
    id: string;
    email: string;
    role: string;
  };
  reason?: string;
}

const defaultActor = {
  id: 'SYSTEM_INGESTION_ENGINE',
  email: 'ingestion@edu4loan.org',
  role: 'admin',
};

// 1. Safe Upsert Source
export const safeUpsertSource = async (
  data: any,
  options: UpsertOptions = {}
): Promise<{ record: ISource; action: 'INSERTED' | 'UPDATED' | 'SKIPPED' }> => {
  const actor = options.actor || defaultActor;
  const existing = await Source.findOne({ sourceUrl: data.sourceUrl });

  if (existing) {
    if (existing.status === 'verified' && !existing.isDemo && data.isDemo) {
      console.warn(`[SAFE UPSERT] Blocked attempt to overwrite verified Source '${existing.sourceName}' with demo data.`);
      return { record: existing, action: 'SKIPPED' };
    }

    if (
      existing.status === 'verified' &&
      !existing.isDemo &&
      data.status === 'needs_verification' &&
      !options.allowVerifiedDowngrade
    ) {
      console.warn(
        `[SAFE UPSERT] Blocked attempt to downgrade verified Source '${existing.sourceName}' without explicit allowVerifiedDowngrade flag.`
      );
      return { record: existing, action: 'SKIPPED' };
    }

    const oldValue = existing.toObject();
    Object.assign(existing, data);
    await existing.save();

    await logAuditAction({
      userId: actor.id,
      userEmail: actor.email,
      userRole: actor.role,
      action: 'UPDATE',
      entityType: 'source',
      entityId: existing._id.toString(),
      oldValue,
      newValue: existing.toObject(),
      reason: options.reason || 'Safe upsert updated source citation',
    });

    return { record: existing, action: 'UPDATED' };
  }

  const newSource = await Source.create(data);

  await logAuditAction({
    userId: actor.id,
    userEmail: actor.email,
    userRole: actor.role,
    action: 'CREATE',
    entityType: 'source',
    entityId: newSource._id.toString(),
    newValue: newSource.toObject(),
    reason: options.reason || 'Safe upsert created new source citation',
  });

  return { record: newSource, action: 'INSERTED' };
};

// 2. Safe Upsert Bank
export const safeUpsertBank = async (
  data: any,
  options: UpsertOptions = {}
): Promise<{ record: IBank; action: 'INSERTED' | 'UPDATED' | 'SKIPPED' }> => {
  const actor = options.actor || defaultActor;
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const existing = await Bank.findOne({ slug });

  if (existing) {
    // CRITICAL: Never overwrite verified data with demo or unverified data automatically
    if (existing.overallSource?.status === 'verified' && !existing.isDemo && data.isDemo) {
      console.warn(`[SAFE UPSERT] Blocked attempt to overwrite verified Bank '${existing.name}' with demo data.`);
      return { record: existing, action: 'SKIPPED' };
    }

    if (
      existing.overallSource?.status === 'verified' &&
      !existing.isDemo &&
      data.overallSource?.status === 'needs_verification' &&
      !options.allowVerifiedDowngrade
    ) {
      console.warn(
        `[SAFE UPSERT] Blocked attempt to downgrade verified Bank '${existing.name}' without explicit allowVerifiedDowngrade flag.`
      );
      return { record: existing, action: 'SKIPPED' };
    }

    const oldValue = existing.toObject();
    Object.assign(existing, { ...data, slug });
    await existing.save();

    await logAuditAction({
      userId: actor.id,
      userEmail: actor.email,
      userRole: actor.role,
      action: 'UPDATE',
      entityType: 'bank',
      entityId: existing._id.toString(),
      oldValue,
      newValue: existing.toObject(),
      reason: options.reason || 'Safe upsert updated bank',
    });

    return { record: existing, action: 'UPDATED' };
  }

  const newBank = await Bank.create({ ...data, slug });

  await logAuditAction({
    userId: actor.id,
    userEmail: actor.email,
    userRole: actor.role,
    action: 'CREATE',
    entityType: 'bank',
    entityId: newBank._id.toString(),
    newValue: newBank.toObject(),
    reason: options.reason || 'Safe upsert created new bank',
  });

  return { record: newBank, action: 'INSERTED' };
};

// 3. Safe Upsert Loan Scheme
export const safeUpsertLoanScheme = async (
  data: any,
  options: UpsertOptions = {}
): Promise<{ record: ILoanScheme; action: 'INSERTED' | 'UPDATED' | 'SKIPPED' }> => {
  const actor = options.actor || defaultActor;

  // Uniqueness rule: bankId + normalized schemeName
  const existing = await LoanScheme.findOne({
    bankId: data.bankId,
    schemeName: { $regex: new RegExp(`^${data.schemeName.trim()}$`, 'i') },
  });

  if (existing) {
    if (existing.status === 'verified' && !existing.isDemo && data.isDemo) {
      console.warn(
        `[SAFE UPSERT] Blocked attempt to overwrite verified Loan Scheme '${existing.schemeName}' with demo data.`
      );
      return { record: existing, action: 'SKIPPED' };
    }

    if (
      existing.status === 'verified' &&
      !existing.isDemo &&
      data.status === 'needs_verification' &&
      !options.allowVerifiedDowngrade
    ) {
      console.warn(
        `[SAFE UPSERT] Blocked attempt to downgrade verified Loan Scheme '${existing.schemeName}' without explicit allowVerifiedDowngrade flag.`
      );
      return { record: existing, action: 'SKIPPED' };
    }

    const oldValue = existing.toObject();
    Object.assign(existing, data);
    await existing.save();

    await logAuditAction({
      userId: actor.id,
      userEmail: actor.email,
      userRole: actor.role,
      action: 'UPDATE',
      entityType: 'loanScheme',
      entityId: existing._id.toString(),
      oldValue,
      newValue: existing.toObject(),
      reason: options.reason || 'Safe upsert updated loan scheme',
    });

    return { record: existing, action: 'UPDATED' };
  }

  const newScheme = await LoanScheme.create(data);

  await logAuditAction({
    userId: actor.id,
    userEmail: actor.email,
    userRole: actor.role,
    action: 'CREATE',
    entityType: 'loanScheme',
    entityId: newScheme._id.toString(),
    newValue: newScheme.toObject(),
    reason: options.reason || 'Safe upsert created new loan scheme',
  });

  return { record: newScheme, action: 'INSERTED' };
};

// 4. Safe Upsert Government Scheme
export const safeUpsertGovernmentScheme = async (
  data: any,
  options: UpsertOptions = {}
): Promise<{ record: IGovernmentScheme; action: 'INSERTED' | 'UPDATED' | 'SKIPPED' }> => {
  const actor = options.actor || defaultActor;

  const existing = await GovernmentScheme.findOne({ schemeCode: data.schemeCode });

  if (existing) {
    if (existing.source?.status === 'verified' && !existing.isDemo && data.isDemo) {
      return { record: existing, action: 'SKIPPED' };
    }

    const oldValue = existing.toObject();
    Object.assign(existing, data);
    await existing.save();

    await logAuditAction({
      userId: actor.id,
      userEmail: actor.email,
      userRole: actor.role,
      action: 'UPDATE',
      entityType: 'governmentScheme',
      entityId: existing._id.toString(),
      oldValue,
      newValue: existing.toObject(),
      reason: options.reason || 'Safe upsert updated government scheme',
    });

    return { record: existing, action: 'UPDATED' };
  }

  const newGov = await GovernmentScheme.create(data);

  await logAuditAction({
    userId: actor.id,
    userEmail: actor.email,
    userRole: actor.role,
    action: 'CREATE',
    entityType: 'governmentScheme',
    entityId: newGov._id.toString(),
    newValue: newGov.toObject(),
    reason: options.reason || 'Safe upsert created new government scheme',
  });

  return { record: newGov, action: 'INSERTED' };
};

// 5. Safe Upsert Document
export const safeUpsertDocument = async (
  data: any,
  options: UpsertOptions = {}
): Promise<{ record: IDocumentItem; action: 'INSERTED' | 'UPDATED' | 'SKIPPED' }> => {
  const actor = options.actor || defaultActor;

  const existing = await DocumentModel.findOne({
    name: data.name,
    category: data.category,
  });

  if (existing) {
    if (existing.source?.status === 'verified' && !existing.isDemo && data.isDemo) {
      return { record: existing, action: 'SKIPPED' };
    }

    const oldValue = existing.toObject();
    Object.assign(existing, data);
    await existing.save();

    return { record: existing, action: 'UPDATED' };
  }

  const newDoc = await DocumentModel.create(data);
  return { record: newDoc, action: 'INSERTED' };
};

// 6. Safe Upsert Institution
export const safeUpsertInstitution = async (
  data: any,
  options: UpsertOptions = {}
): Promise<{ record: IInstitution; action: 'INSERTED' | 'UPDATED' | 'SKIPPED' }> => {
  const actor = options.actor || defaultActor;

  const existing = await Institution.findOne({ name: data.name });

  if (existing) {
    if (!existing.isDemo && data.isDemo) {
      return { record: existing, action: 'SKIPPED' };
    }

    const oldValue = existing.toObject();
    Object.assign(existing, data);
    await existing.save();

    await logAuditAction({
      userId: actor.id,
      userEmail: actor.email,
      userRole: actor.role,
      action: 'UPDATE',
      entityType: 'bank',
      entityId: existing._id.toString(),
      oldValue,
      newValue: existing.toObject(),
      reason: options.reason || 'Safe upsert updated institution details',
    });

    return { record: existing, action: 'UPDATED' };
  }

  const newInst = await Institution.create(data);
  return { record: newInst, action: 'INSERTED' };
};
