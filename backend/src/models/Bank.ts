import { Schema, model, Document } from 'mongoose';

export interface IBank extends Document {
  slug: string;
  name: string;
  shortCode: string;
  category: 'public' | 'private' | 'regional_rural' | 'nbfc';
  logoUrl?: string;
  officialWebsite: string;
  educationLoanPortalUrl: string;
  vidyaLakshmiRegistered: boolean;
  pmVidyalaxmiRegistered: boolean;
  tollFreeNumber?: string;
  headquarters: string;
  vitBhopalTieUp: {
    hasFormalMOU: boolean;
    onCampusDeskAvailable: boolean;
    designatedBranchName: string;
    contactPerson?: string;
    contactNumber?: string;
    details: string;
    source: string;
    sourceUrl: string;
    lastVerified: string;
    status: 'verified' | 'needs_verification' | 'expired';
  };
  branches: {
    branchName: string;
    city: string;
    state: string;
    address: string;
    pincode: string;
    contactEmail?: string;
    contactPhone?: string;
    isNodalForVitBhopal?: boolean;
  }[];
  generalTurnaroundTimeDays: string;
  overallSource: {
    value: string;
    source: string;
    sourceUrl: string;
    lastVerified: string;
    status: 'verified' | 'needs_verification' | 'expired';
  };
  source?: string;
  sourceUrl?: string;
  lastVerifiedAt?: string;
  verificationStatus?: 'VERIFIED' | 'NEEDS_REVIEW' | 'OUTDATED' | 'UNAVAILABLE' | 'verified' | 'needs_verification' | 'expired';
  isDemo?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BankBranchSchema = new Schema(
  {
    branchName: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    isNodalForVitBhopal: { type: Boolean, default: false },
  },
  { _id: false }
);

const BankSchema = new Schema<IBank>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Bank name is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['public', 'private', 'regional_rural', 'nbfc'],
      required: true,
    },
    logoUrl: { type: String, trim: true },
    officialWebsite: {
      type: String,
      required: true,
      trim: true,
    },
    educationLoanPortalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    vidyaLakshmiRegistered: { type: Boolean, default: false },
    pmVidyalaxmiRegistered: { type: Boolean, default: false },
    tollFreeNumber: { type: String, trim: true },
    headquarters: { type: String, required: true, trim: true },
    vitBhopalTieUp: {
      hasFormalMOU: { type: Boolean, default: false },
      onCampusDeskAvailable: { type: Boolean, default: false },
      designatedBranchName: { type: String, default: 'None verified' },
      contactPerson: { type: String },
      contactNumber: { type: String },
      details: { type: String, default: 'Information not currently verified by university or bank circular.' },
      source: { type: String, default: 'Pending institutional verification' },
      sourceUrl: { type: String, default: '' },
      lastVerified: { type: String, default: new Date().toISOString().split('T')[0] },
      status: {
        type: String,
        enum: ['verified', 'needs_verification', 'expired'],
        default: 'needs_verification',
      },
    },
    branches: { type: [BankBranchSchema], default: [] },
    generalTurnaroundTimeDays: { type: String, default: '15-25 business days' },
    overallSource: {
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
    source: { type: String, trim: true },
    sourceUrl: { type: String, trim: true },
    lastVerifiedAt: { type: String, trim: true },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED', 'NEEDS_REVIEW', 'OUTDATED', 'UNAVAILABLE', 'verified', 'needs_verification', 'expired'],
      default: 'VERIFIED',
    },
    isDemo: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Indexes
BankSchema.index({ name: 1 });
BankSchema.index({ category: 1 });
BankSchema.index({ 'overallSource.status': 1 });
BankSchema.index({ verificationStatus: 1 });
BankSchema.index({ isDemo: 1 });

// Financial Data Safeguard Hook:
BankSchema.pre('save', function (next) {
  if (this.overallSource) {
    if (!this.source) this.source = this.overallSource.source;
    if (!this.sourceUrl) this.sourceUrl = this.overallSource.sourceUrl;
    if (!this.lastVerifiedAt) this.lastVerifiedAt = this.overallSource.lastVerified;
    if (!this.verificationStatus) {
      this.verificationStatus = this.overallSource.status === 'verified' ? 'VERIFIED' : 'NEEDS_REVIEW';
    }
  }

  if (this.isDemo) {
    this.overallSource.status = 'needs_verification';
    this.verificationStatus = 'NEEDS_REVIEW';
    if (this.vitBhopalTieUp) {
      this.vitBhopalTieUp.status = 'needs_verification';
    }
  } else if (this.overallSource.status === 'verified' || this.verificationStatus === 'VERIFIED') {
    if (!this.overallSource.sourceUrl || !this.overallSource.sourceUrl.startsWith('http')) {
      this.overallSource.status = 'needs_verification';
      this.verificationStatus = 'NEEDS_REVIEW';
    }
  }
  next();
});

export const Bank = model<IBank>('Bank', BankSchema);
