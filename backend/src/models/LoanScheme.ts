import { Schema, model, Document, Types } from 'mongoose';

export interface ILoanScheme extends Document {
  bankId: Types.ObjectId;
  bankName: string;
  schemeName: string;
  schemeCode: string;
  overview: string;
  targetDegreeLevel: ('Undergraduate' | 'Postgraduate' | 'Doctoral' | 'Diploma')[];
  eligibilityCriteria: string[];
  maxLoanAmountInland: {
    value: number;
    source: string;
    sourceUrl: string;
    lastVerified: string;
    status: 'verified' | 'needs_verification' | 'expired';
  };
  interestRate: {
    benchmarkType: 'EBLR' | 'RLLR' | 'MCLR' | 'Fixed' | 'REPO_LINKED';
    benchmarkRatePercent: number;
    spreadPercentMin: number;
    spreadPercentMax: number;
    minRate: {
      value: number;
      source: string;
      sourceUrl: string;
      lastVerified: string;
      status: 'verified' | 'needs_verification' | 'expired';
    };
    maxRate: {
      value: number;
      source: string;
      sourceUrl: string;
      lastVerified: string;
      status: 'verified' | 'needs_verification' | 'expired';
    };
    girlChildConcessionPercent: {
      value: number;
      source: string;
      sourceUrl: string;
      lastVerified: string;
      status: 'verified' | 'needs_verification' | 'expired';
    };
    premierInstituteConcessionPercent?: {
      value: number;
      source: string;
      sourceUrl: string;
      lastVerified: string;
      status: 'verified' | 'needs_verification' | 'expired';
    };
    promptServicingConcessionPercent?: {
      value: number;
      source: string;
      sourceUrl: string;
      lastVerified: string;
      status: 'verified' | 'needs_verification' | 'expired';
    };
    notes?: string;
  };
  collateral: {
    upTo4Lakhs: string;
    from4To7point5Lakhs: string;
    above7point5Lakhs: string;
    acceptableCollateralTypes: string[];
    details: string;
  };
  marginMoney: {
    upTo4LakhsPercent: number;
    above4LakhsIndiaPercent: number;
    scholarshipAdjustmentAllowed: boolean;
    notes?: string;
  };
  moratorium: {
    courseDurationYears: number;
    moratoriumBufferMonths: number;
    repaymentTenureMaxYears: number;
    interestServicingDuringMoratorium: 'optional_simple' | 'mandatory_simple' | 'compound';
    explanation: string;
  };
  processingFee: {
    value: string;
    source: string;
    sourceUrl: string;
    lastVerified: string;
    status: 'verified' | 'needs_verification' | 'expired';
  };
  prepaymentPenalty: {
    value: string;
    source: string;
    sourceUrl: string;
    lastVerified: string;
    status: 'verified' | 'needs_verification' | 'expired';
  };
  section80ETaxBenefitApplicable: boolean;
  vitBhopalEligible: boolean;
  vitBhopalCategoryNote?: string;
  officialCircularUrl: string;
  officialApplicationUrl: string;
  source: {
    value: string;
    source: string;
    sourceUrl: string;
    lastVerified: string;
    status: 'verified' | 'needs_verification' | 'expired';
  };
  status: 'verified' | 'needs_verification' | 'expired';
  lastVerified: string;
  createdAt: Date;
  updatedAt: Date;
}

const VerifiedNumericSchema = new Schema(
  {
    value: { type: Number, required: true },
    source: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    lastVerified: { type: String, required: true },
    status: {
      type: String,
      enum: ['verified', 'needs_verification', 'expired'],
      default: 'needs_verification',
    },
  },
  { _id: false }
);

const VerifiedStringSchema = new Schema(
  {
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
  { _id: false }
);

const LoanSchemeSchema = new Schema<ILoanScheme>(
  {
    bankId: {
      type: Schema.Types.ObjectId,
      ref: 'Bank',
      required: true,
      index: true,
    },
    bankName: { type: String, required: true, trim: true },
    schemeName: { type: String, required: true, trim: true },
    schemeCode: { type: String, required: true, trim: true },
    overview: { type: String, required: true },
    targetDegreeLevel: {
      type: [String],
      enum: ['Undergraduate', 'Postgraduate', 'Doctoral', 'Diploma'],
      default: ['Undergraduate'],
    },
    eligibilityCriteria: { type: [String], default: [] },
    maxLoanAmountInland: { type: VerifiedNumericSchema, required: true },
    interestRate: {
      benchmarkType: {
        type: String,
        enum: ['EBLR', 'RLLR', 'MCLR', 'Fixed', 'REPO_LINKED'],
        default: 'EBLR',
      },
      benchmarkRatePercent: { type: Number, default: 6.5 },
      spreadPercentMin: { type: Number, default: 1.5 },
      spreadPercentMax: { type: Number, default: 3.5 },
      minRate: { type: VerifiedNumericSchema, required: true },
      maxRate: { type: VerifiedNumericSchema, required: true },
      girlChildConcessionPercent: { type: VerifiedNumericSchema, required: true },
      premierInstituteConcessionPercent: { type: VerifiedNumericSchema },
      promptServicingConcessionPercent: { type: VerifiedNumericSchema },
      notes: { type: String },
    },
    collateral: {
      upTo4Lakhs: { type: String, required: true },
      from4To7point5Lakhs: { type: String, required: true },
      above7point5Lakhs: { type: String, required: true },
      acceptableCollateralTypes: { type: [String], default: [] },
      details: { type: String, required: true },
    },
    marginMoney: {
      upTo4LakhsPercent: { type: Number, default: 0 },
      above4LakhsIndiaPercent: { type: Number, default: 5 },
      scholarshipAdjustmentAllowed: { type: Boolean, default: true },
      notes: { type: String },
    },
    moratorium: {
      courseDurationYears: { type: Number, default: 4 },
      moratoriumBufferMonths: { type: Number, default: 12 },
      repaymentTenureMaxYears: { type: Number, default: 15 },
      interestServicingDuringMoratorium: {
        type: String,
        enum: ['optional_simple', 'mandatory_simple', 'compound'],
        default: 'optional_simple',
      },
      explanation: { type: String, required: true },
    },
    processingFee: { type: VerifiedStringSchema, required: true },
    prepaymentPenalty: { type: VerifiedStringSchema, required: true },
    section80ETaxBenefitApplicable: { type: Boolean, default: true },
    vitBhopalEligible: { type: Boolean, default: true },
    vitBhopalCategoryNote: { type: String },
    officialCircularUrl: { type: String, required: true },
    officialApplicationUrl: { type: String, required: true },
    source: { type: VerifiedStringSchema, required: true },
    status: {
      type: String,
      enum: ['verified', 'needs_verification', 'expired'],
      default: 'needs_verification',
    },
    lastVerified: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
LoanSchemeSchema.index({ schemeName: 1 });
LoanSchemeSchema.index({ bankId: 1, status: 1 });
LoanSchemeSchema.index({ 'interestRate.minRate.value': 1 });
LoanSchemeSchema.index({ lastVerified: 1 });

// CRITICAL FINANCIAL DATA SAFETY GUARD:
// Never allow loan scheme to be saved as 'verified' if source or official URLs are missing.
LoanSchemeSchema.pre('save', function (next) {
  if (this.status === 'verified') {
    if (!this.source || !this.source.sourceUrl || !this.source.sourceUrl.startsWith('http')) {
      this.status = 'needs_verification';
    }
    if (!this.interestRate.minRate.sourceUrl || !this.interestRate.maxRate.sourceUrl) {
      this.interestRate.minRate.status = 'needs_verification';
      this.interestRate.maxRate.status = 'needs_verification';
      this.status = 'needs_verification';
    }
  }
  next();
});

export const LoanScheme = model<ILoanScheme>('LoanScheme', LoanSchemeSchema);
