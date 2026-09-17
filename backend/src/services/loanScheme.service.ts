import { LoanScheme, ILoanScheme } from '../models/LoanScheme';
import { logAuditAction } from './audit.service';

export interface SchemeQueryFilter {
  bankId?: string;
  degreeLevel?: string;
  status?: string;
  maxAmountMin?: number;
  vitBhopalEligible?: boolean;
}

export const listLoanSchemes = async (query: SchemeQueryFilter): Promise<ILoanScheme[]> => {
  const filter: any = {};

  if (query.bankId) {
    filter.bankId = query.bankId;
  }
  if (query.degreeLevel) {
    filter.targetDegreeLevel = query.degreeLevel;
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (query.vitBhopalEligible !== undefined) {
    filter.vitBhopalEligible = query.vitBhopalEligible;
  }
  if (query.maxAmountMin !== undefined) {
    filter['maxLoanAmountInland.value'] = { $gte: query.maxAmountMin };
  }

  // Factual sort by schemeName or rate — strictly ZERO subjective ranking/rating
  return LoanScheme.find(filter).sort({ schemeName: 1 });
};

export const getLoanSchemeById = async (id: string): Promise<ILoanScheme> => {
  const scheme = await LoanScheme.findById(id).populate('bankId', 'name shortCode logoUrl officialWebsite');
  if (!scheme) {
    const error: any = new Error(`Loan scheme not found with id: ${id}`);
    error.statusCode = 404;
    error.code = 'SCHEME_NOT_FOUND';
    throw error;
  }
  return scheme;
};

export const createLoanScheme = async (
  data: any,
  adminUser: { id: string; email: string; role: string },
  ipAddress?: string
): Promise<ILoanScheme> => {
  // Financial Data Safety Guard:
  // If source information is missing or incomplete, downgrade status from 'verified' to 'needs_verification'
  if (
    data.status === 'verified' &&
    (!data.source || !data.source.sourceUrl || !data.source.sourceUrl.startsWith('http'))
  ) {
    data.status = 'needs_verification';
  }

  const scheme = await LoanScheme.create(data);

  await logAuditAction({
    userId: adminUser.id,
    userEmail: adminUser.email,
    userRole: adminUser.role,
    action: 'CREATE',
    entityType: 'loanScheme',
    entityId: scheme._id.toString(),
    newValue: scheme.toObject(),
    reason: 'Admin created loan scheme with verified source metadata',
    ipAddress,
  });

  return scheme;
};

export const updateLoanScheme = async (
  id: string,
  data: any,
  adminUser: { id: string; email: string; role: string },
  ipAddress?: string
): Promise<ILoanScheme> => {
  const scheme = await LoanScheme.findById(id);
  if (!scheme) {
    const error: any = new Error(`Loan scheme not found with id: ${id}`);
    error.statusCode = 404;
    error.code = 'SCHEME_NOT_FOUND';
    throw error;
  }

  const oldValue = scheme.toObject();

  // Safety check on update
  if (
    data.status === 'verified' &&
    (!data.source || !data.source.sourceUrl || !data.source.sourceUrl.startsWith('http'))
  ) {
    data.status = 'needs_verification';
  }

  Object.assign(scheme, data);
  await scheme.save();

  await logAuditAction({
    userId: adminUser.id,
    userEmail: adminUser.email,
    userRole: adminUser.role,
    action: 'UPDATE',
    entityType: 'loanScheme',
    entityId: scheme._id.toString(),
    oldValue,
    newValue: scheme.toObject(),
    reason: 'Admin modified loan scheme parameters/rates',
    ipAddress,
  });

  return scheme;
};

export const deleteLoanScheme = async (
  id: string,
  adminUser: { id: string; email: string; role: string },
  ipAddress?: string
): Promise<ILoanScheme> => {
  const scheme = await LoanScheme.findByIdAndDelete(id);
  if (!scheme) {
    const error: any = new Error(`Loan scheme not found with id: ${id}`);
    error.statusCode = 404;
    error.code = 'SCHEME_NOT_FOUND';
    throw error;
  }

  await logAuditAction({
    userId: adminUser.id,
    userEmail: adminUser.email,
    userRole: adminUser.role,
    action: 'DELETE',
    entityType: 'loanScheme',
    entityId: scheme._id.toString(),
    oldValue: scheme.toObject(),
    reason: 'Admin deleted loan scheme',
    ipAddress,
  });

  return scheme;
};
