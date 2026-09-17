import { Schema, model, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  userId: Types.ObjectId | string;
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
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.Mixed, required: true },
    userEmail: { type: String, required: true },
    userRole: { type: String, required: true },
    action: {
      type: String,
      required: true,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'VERIFY', 'STATUS_CHANGE'],
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      enum: ['bank', 'loanScheme', 'governmentScheme', 'document', 'source', 'faq', 'user'],
      index: true,
    },
    entityId: { type: String, required: true, index: true },
    fieldChanged: { type: String },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    reason: { type: String, required: true },
    ipAddress: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable: no updatedAt
  }
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });

export const AuditLog = model<IAuditLog>('AuditLog', AuditLogSchema);
