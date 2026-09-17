import { Schema, model, Document, Types } from 'mongoose';

export interface IApplication extends Document {
  userId: Types.ObjectId;
  targetBankId?: Types.ObjectId;
  targetBankName?: string;
  targetSchemeId?: Types.ObjectId;
  targetSchemeName?: string;
  requestedAmount: number;
  status:
    | 'draft'
    | 'submitted'
    | 'under_review'
    | 'documents_required'
    | 'bank_verification'
    | 'sanctioned'
    | 'rejected'
    | 'disbursed';
  degreeProgram: string;
  admissionYear: number;
  documentReadiness: {
    totalRequired: number;
    completedCount: number;
    documentStatusMap: Map<string, string>;
  };
  notes: string;
  nextAction?: string;
  bankVisitLogs: {
    date: string;
    branchName: string;
    officerContactName?: string;
    officerDesignation?: string;
    discussionSummary: string;
    pendingRequirementsGiven: string[];
    followUpDate?: string;
  }[];
  vidyaLakshmiApplicationId?: string;
  isStudentEnteredSelfReported: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BankVisitLogSchema = new Schema(
  {
    date: { type: String, required: true },
    branchName: { type: String, required: true },
    officerContactName: { type: String },
    officerDesignation: { type: String },
    discussionSummary: { type: String, required: true },
    pendingRequirementsGiven: { type: [String], default: [] },
    followUpDate: { type: String },
  },
  { _id: true }
);

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetBankId: { type: Schema.Types.ObjectId, ref: 'Bank' },
    targetBankName: { type: String },
    targetSchemeId: { type: Schema.Types.ObjectId, ref: 'LoanScheme' },
    targetSchemeName: { type: String },
    requestedAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        'draft',
        'submitted',
        'under_review',
        'documents_required',
        'bank_verification',
        'sanctioned',
        'rejected',
        'disbursed',
      ],
      default: 'draft',
      index: true,
    },
    degreeProgram: { type: String, required: true },
    admissionYear: { type: Number, required: true },
    documentReadiness: {
      totalRequired: { type: Number, default: 0 },
      completedCount: { type: Number, default: 0 },
      documentStatusMap: {
        type: Map,
        of: String,
        default: {},
      },
    },
    notes: { type: String, default: '' },
    nextAction: { type: String, default: 'Prepare standard admission and KYC documents' },
    bankVisitLogs: { type: [BankVisitLogSchema], default: [] },
    vidyaLakshmiApplicationId: { type: String },
    // Explicit guard against claiming live bank status
    isStudentEnteredSelfReported: {
      type: Boolean,
      default: true,
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

ApplicationSchema.index({ userId: 1, status: 1 });

export const Application = model<IApplication>('Application', ApplicationSchema);
