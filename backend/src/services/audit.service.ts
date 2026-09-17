import { AuditLog, IAuditLog } from '../models/AuditLog';

export interface LogActionParams {
  userId: string;
  userEmail: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VERIFY' | 'STATUS_CHANGE';
  entityType: 'bank' | 'loanScheme' | 'governmentScheme' | 'document' | 'source' | 'faq' | 'user';
  entityId: string;
  fieldChanged?: string;
  oldValue?: unknown;
  newValue?: unknown;
  reason: string;
  ipAddress?: string;
}

export const logAuditAction = async (params: LogActionParams): Promise<IAuditLog> => {
  try {
    const entry = await AuditLog.create(params);
    return entry;
  } catch (err) {
    console.error('[AUDIT LOG ERROR] Failed to record audit log:', err);
    throw err;
  }
};
