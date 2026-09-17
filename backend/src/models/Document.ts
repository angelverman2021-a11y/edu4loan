import { Schema, model, Document } from 'mongoose';

export interface IDocumentItem extends Document {
  name: string;
  category:
    | 'student_kyc'
    | 'academic_records'
    | 'vit_bhopal_admission'
    | 'coapplicant_kyc'
    | 'coapplicant_income_salaried'
    | 'coapplicant_income_selfemployed'
    | 'collateral_property'
    | 'collateral_liquid'
    | 'bank_specific_forms';
  description: string;
  isRequired: boolean;
  applicableCondition: string;
  sampleUrl?: string;
  issuingAuthority: string;
  verificationTip: string;
  source: {
    value: string;
    source: string;
    sourceUrl: string;
    lastVerified: string;
    status: 'verified' | 'needs_verification' | 'expired';
  };
  isDemo?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentItemSchema = new Schema<IDocumentItem>(
  {
    name: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'student_kyc',
        'academic_records',
        'vit_bhopal_admission',
        'coapplicant_kyc',
        'coapplicant_income_salaried',
        'coapplicant_income_selfemployed',
        'collateral_property',
        'collateral_liquid',
        'bank_specific_forms',
      ],
    },
    description: { type: String, required: true },
    isRequired: { type: Boolean, default: true },
    applicableCondition: { type: String, required: true },
    sampleUrl: { type: String, trim: true },
    issuingAuthority: { type: String, required: true },
    verificationTip: { type: String, required: true },
    source: {
      value: { type: String, required: true },
      source: { type: String, required: true },
      sourceUrl: { type: String, required: true },
      lastVerified: { type: String, required: true },
      status: {
        type: String,
        enum: ['verified', 'needs_verification', 'expired'],
        default: 'needs_verification',
      },
    },
    isDemo: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

DocumentItemSchema.index({ category: 1 });
DocumentItemSchema.index({ isRequired: 1 });
DocumentItemSchema.index({ isDemo: 1 });

DocumentItemSchema.pre('save', function (next) {
  if (this.isDemo) {
    this.source.status = 'needs_verification';
  } else if (this.source.status === 'verified') {
    if (!this.source.sourceUrl || !this.source.sourceUrl.startsWith('http')) {
      this.source.status = 'needs_verification';
    }
  }
  next();
});

export const DocumentModel = model<IDocumentItem>('DocumentItem', DocumentItemSchema);
