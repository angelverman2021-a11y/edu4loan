import { Source, ISource } from '../models/Source';
import { logAuditAction } from './audit.service';

export const listSources = async (status?: string): Promise<ISource[]> => {
  const filter: any = {};
  if (status) {
    filter.status = status;
  }
  return Source.find(filter).sort({ verifiedAt: -1 });
};

export const getSourceById = async (id: string): Promise<ISource> => {
  const source = await Source.findById(id);
  if (!source) {
    const error: any = new Error(`Source not found with id: ${id}`);
    error.statusCode = 404;
    error.code = 'SOURCE_NOT_FOUND';
    throw error;
  }
  return source;
};

export const createSource = async (
  data: any,
  adminUser: { id: string; email: string; role: string },
  ipAddress?: string
): Promise<ISource> => {
  const source = await Source.create({
    ...data,
    verifiedBy: adminUser.email,
    verifiedAt: new Date(),
  });

  await logAuditAction({
    userId: adminUser.id,
    userEmail: adminUser.email,
    userRole: adminUser.role,
    action: 'CREATE',
    entityType: 'source',
    entityId: source._id.toString(),
    newValue: source.toObject(),
    reason: 'Admin registered official primary source citation',
    ipAddress,
  });

  return source;
};

export const updateSourceVerificationStatus = async (
  id: string,
  status: 'verified' | 'needs_verification' | 'expired',
  adminUser: { id: string; email: string; role: string },
  notes?: string,
  ipAddress?: string
): Promise<ISource> => {
  const source = await Source.findById(id);
  if (!source) {
    const error: any = new Error(`Source not found with id: ${id}`);
    error.statusCode = 404;
    error.code = 'SOURCE_NOT_FOUND';
    throw error;
  }

  const oldValue = source.toObject();
  source.status = status;
  source.verifiedAt = new Date();
  source.verifiedBy = adminUser.email;
  if (notes) source.notes = notes;
  await source.save();

  await logAuditAction({
    userId: adminUser.id,
    userEmail: adminUser.email,
    userRole: adminUser.role,
    action: 'VERIFY',
    entityType: 'source',
    entityId: source._id.toString(),
    fieldChanged: 'status',
    oldValue: oldValue.status,
    newValue: status,
    reason: `Admin updated source status to ${status}`,
    ipAddress,
  });

  return source;
};
