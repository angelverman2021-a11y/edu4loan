import { Schema, model, Document } from 'mongoose';

export interface IGovernmentScheme extends Document {
  schemeName: string;
  schemeCode: 'PM_VIDYALAXMI' | 'VIDYA_LAKSHMI_PORTAL' | 'CSIS' | 'CGFSEL' | 'DR_AMBEDKAR_CSIS';
  managingAuthority: string;
  targetBeneficiaries: string;
  incomeCeilingPerAnnum: number | null;
  keyBenefits: string[];
  eligibilityConditions: string[];
  howToApplySteps: string[];
  portalUrl: string;
  vitBhopalRelevance: string;
  source: {
    value: string;
    source: string;
    sourceUrl: string;
    lastVerified: string;
    status: 'verified' | 'needs_verification' | 'expired';
  };
  createdAt: Date;
  updatedAt: Date;
}

const GovernmentSchemeSchema = new Schema<IGovernmentScheme>(
  {
    schemeName: {
      type: String,
      required: [true, 'Scheme name is required'],
      trim: true,
    },
    schemeCode: {
      type: String,
      required: true,
      unique: true,
      enum: ['PM_VIDYALAXMI', 'VIDYA_LAKSHMI_PORTAL', 'CSIS', 'CGFSEL', 'DR_AMBEDKAR_CSIS'],
    },
    managingAuthority: { type: String, required: true },
    targetBeneficiaries: { type: String, required: true },
    incomeCeilingPerAnnum: { type: Number, default: null },
    keyBenefits: { type: [String], default: [] },
    eligibilityConditions: { type: [String], default: [] },
    howToApplySteps: { type: [String], default: [] },
    portalUrl: { type: String, required: true },
    vitBhopalRelevance: { type: String, required: true },
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
  },
  {
    timestamps: true,
  }
);

export const GovernmentScheme = model<IGovernmentScheme>('GovernmentScheme', GovernmentSchemeSchema);
