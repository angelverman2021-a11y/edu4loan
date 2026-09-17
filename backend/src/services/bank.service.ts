import { Bank, IBank } from '../models/Bank';
import { logAuditAction } from './audit.service';

export const listBanks = async (query: {
  category?: string;
  hasVitTieUp?: boolean;
  status?: string;
}): Promise<IBank[]> => {
  const filter: any = {};
  if (query.category) {
    filter.category = query.category;
  }
  if (query.hasVitTieUp !== undefined) {
    filter['vitBhopalTieUp.hasFormalMOU'] = query.hasVitTieUp;
  }
  if (query.status) {
    filter['overallSource.status'] = query.status;
  }

  // Strictly neutral alphabetical sorting — NO subjective scoring or rankings
  return Bank.find(filter).sort({ name: 1 });
};

export const getBankByIdOrSlug = async (identifier: string): Promise<IBank> => {
  const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
  const bank = isObjectId
    ? await Bank.findById(identifier)
    : await Bank.findOne({ slug: identifier.toLowerCase() });

  if (!bank) {
    const error: any = new Error(`Bank not found for identifier: ${identifier}`);
    error.statusCode = 404;
    error.code = 'BANK_NOT_FOUND';
    throw error;
  }
  return bank;
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
