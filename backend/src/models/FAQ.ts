import { Schema, model, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category:
    | 'moratorium_and_repayment'
    | 'collateral_and_guarantees'
    | 'cibil_and_credit_score'
    | 'vidya_lakshmi_portal'
    | 'pm_vidyalaxmi_scheme'
    | 'vit_bhopal_processes'
    | 'interest_rates_and_subsidies';
  tags: string[];
  officialReference?: string;
  officialReferenceUrl?: string;
  isHighPriority: boolean;
  status: 'verified' | 'needs_verification';
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'moratorium_and_repayment',
        'collateral_and_guarantees',
        'cibil_and_credit_score',
        'vidya_lakshmi_portal',
        'pm_vidyalaxmi_scheme',
        'vit_bhopal_processes',
        'interest_rates_and_subsidies',
      ],
      index: true,
    },
    tags: { type: [String], default: [] },
    officialReference: { type: String, trim: true },
    officialReferenceUrl: { type: String, trim: true },
    isHighPriority: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['verified', 'needs_verification'],
      default: 'verified',
    },
  },
  {
    timestamps: true,
  }
);

FAQSchema.index({ category: 1, isHighPriority: -1 });

export const FAQ = model<IFAQ>('FAQ', FAQSchema);
