import { Bank, IBank } from '../models/Bank';
import { LoanScheme } from '../models/LoanScheme';
import { AppError } from '../utils/apiResponse';
import { logAuditAction } from './audit.service';
import {
  parsePagination,
  buildPaginationMeta,
  escapeRegex,
  PaginationResult,
  sanitizeString,
  isValidObjectId,
} from '../utils/querySafety';

export interface BankListQuery {
  page?: string | number;
  limit?: string | number;
  search?: string;
  category?: string;
  bankType?: string;
  hasVitTieUp?: boolean | string;
  status?: string;
}

export interface BankListResponse {
  banks: IBank[];
  pagination: PaginationResult;
}

export const listBanks = async (query: BankListQuery = {}): Promise<BankListResponse> => {
  const { page, limit, skip } = parsePagination(query, 20, 100);
  const filter: any = {};

  const category = sanitizeString(query.category) || sanitizeString(query.bankType);
  if (category) {
    filter.category = category;
  }

  if (query.hasVitTieUp !== undefined) {
    filter['vitBhopalTieUp.hasFormalMOU'] =
      query.hasVitTieUp === true || query.hasVitTieUp === 'true';
  }

  const status = sanitizeString(query.status);
  if (status) {
    filter['overallSource.status'] = status;
  }

  const search = sanitizeString(query.search);
  if (search) {
    const escaped = escapeRegex(search);
    filter.$or = [
      { name: { $regex: escaped, $options: 'i' } },
      { slug: { $regex: escaped, $options: 'i' } },
      { shortCode: { $regex: escaped, $options: 'i' } },
    ];
  }

  // Strictly neutral alphabetical sorting — NO subjective scoring or rankings
  const [banks, total] = await Promise.all([
    Bank.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    Bank.countDocuments(filter),
  ]);

  return {
    banks,
    pagination: buildPaginationMeta(page, limit, total),
  };
};

export const getBankByIdOrSlug = async (identifier: string): Promise<any> => {
  const isObjectId = isValidObjectId(identifier);
  let bank = null;
  if (isObjectId) {
    bank = await Bank.findById(identifier).lean();
  } else {
    bank = await Bank.findOne({ slug: identifier.toLowerCase() }).lean();
  }

  if (!bank) {
    if (
      !isObjectId &&
      !['sbi', 'boi', 'pnb', 'bob', 'canara', 'hdfc', 'icici', 'union'].some((s) =>
        identifier.toLowerCase().includes(s)
      )
    ) {
      throw new AppError(`Invalid bank ID or slug: ${identifier}`, 400, 'INVALID_ID');
    }
    throw new AppError(`Bank not found for identifier: ${identifier}`, 404, 'BANK_NOT_FOUND');
  }

  const loanSchemes = await LoanScheme.find({ bankId: bank._id }).lean();
  return {
    ...bank,
    loanSchemes,
  };
};

export const createBank = async (
  data: any,
  adminUser: { id: string; email: string; role: string },
  ipAddress?: string
): Promise<IBank> => {
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const bank = await Bank.create({ ...data, slug });

  await logAuditAction({
    userId: adminUser.id,
    userEmail: adminUser.email,
    userRole: adminUser.role,
    action: 'CREATE',
    entityType: 'bank',
    entityId: bank._id.toString(),
    newValue: bank.toObject(),
    reason: 'Admin created new bank entry',
    ipAddress,
  });

  return bank;
};

export const updateBank = async (
  id: string,
  data: any,
  adminUser: { id: string; email: string; role: string },
  ipAddress?: string
): Promise<IBank> => {
  const bank = await Bank.findById(id);
  if (!bank) {
    const error: any = new Error(`Bank not found with id: ${id}`);
    error.statusCode = 404;
    error.code = 'BANK_NOT_FOUND';
    throw error;
  }

  const oldValue = bank.toObject();
  Object.assign(bank, data);
  await bank.save();

  await logAuditAction({
    userId: adminUser.id,
    userEmail: adminUser.email,
    userRole: adminUser.role,
    action: 'UPDATE',
    entityType: 'bank',
    entityId: bank._id.toString(),
    oldValue,
    newValue: bank.toObject(),
    reason: 'Admin updated bank details',
    ipAddress,
  });

  return bank;
};

export const deleteBank = async (
  id: string,
  adminUser: { id: string; email: string; role: string },
  ipAddress?: string
): Promise<IBank> => {
  const bank = await Bank.findByIdAndDelete(id);
  if (!bank) {
    const error: any = new Error(`Bank not found with id: ${id}`);
    error.statusCode = 404;
    error.code = 'BANK_NOT_FOUND';
    throw error;
  }

  await logAuditAction({
    userId: adminUser.id,
    userEmail: adminUser.email,
    userRole: adminUser.role,
    action: 'DELETE',
    entityType: 'bank',
    entityId: bank._id.toString(),
    oldValue: bank.toObject(),
    reason: 'Admin deleted bank entry',
    ipAddress,
  });

  return bank;
};
