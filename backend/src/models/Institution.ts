import { Schema, model, Document } from 'mongoose';

export interface IInstitution extends Document {
  name: string;
  establishedYear: number;
  location: {
    campusAddress: string;
    district: string;
    state: string;
    pincode: string;
    railwayStationNearest: string;
  };
  nirfAndAccreditationStatus: {
    universityGroup: string;
    approvals: string[];
    notes: string;
  };
  programs: {
    programName: string;
    specializations?: string[];
    durationYears: number;
    categoryTiers: {
      category: number;
      tuitionFeePerYear: number;
      cautionDepositOneTime: number;
    }[];
    hostelFeeEstimatePerYear: {
      roomType: string;
      feePerYear: number;
      messVegNonVegPerYear: number;
    }[];
    source: {
      value: string;
      source: string;
      sourceUrl: string;
      lastVerified: string;
      status: 'verified' | 'needs_verification' | 'expired';
    };
  }[];
  officialBankHelpdesk: {
    locationOnCampus: string;
    timing: string;
    contactEmail: string;
    contactPhone?: string;
    partnerBanksPresentDuringAdmissions: string[];
    source: {
      value: string;
      source: string;
      sourceUrl: string;
      lastVerified: string;
      status: 'verified' | 'needs_verification' | 'expired';
    };
  };
  loanLetterProcess: {
    steps: string[];
    issuedDocuments: string[];
    turnaroundDays: string;
    officeResponsible: string;
  };
  isDemo?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InstitutionSchema = new Schema<IInstitution>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: 'VIT Bhopal University',
    },
    establishedYear: { type: Number, default: 2017 },
    location: {
      campusAddress: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      railwayStationNearest: { type: String, required: true },
    },
    nirfAndAccreditationStatus: {
      universityGroup: { type: String, required: true },
      approvals: { type: [String], default: ['UGC', 'AICTE'] },
      notes: { type: String, required: true },
    },
    programs: [
      {
        programName: { type: String, required: true },
        specializations: { type: [String], default: [] },
        durationYears: { type: Number, required: true, default: 4 },
        categoryTiers: [
          {
            category: { type: Number, required: true },
            tuitionFeePerYear: { type: Number, required: true },
            cautionDepositOneTime: { type: Number, required: true },
          },
        ],
        hostelFeeEstimatePerYear: [
          {
            roomType: { type: String, required: true },
            feePerYear: { type: Number, required: true },
            messVegNonVegPerYear: { type: Number, required: true },
          },
        ],
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
    ],
    officialBankHelpdesk: {
      locationOnCampus: { type: String, required: true },
      timing: { type: String, required: true },
      contactEmail: { type: String, required: true },
      contactPhone: { type: String },
      partnerBanksPresentDuringAdmissions: { type: [String], default: [] },
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
    loanLetterProcess: {
      steps: { type: [String], default: [] },
      issuedDocuments: { type: [String], default: [] },
      turnaroundDays: { type: String, required: true },
      officeResponsible: { type: String, required: true },
    },
    isDemo: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

InstitutionSchema.index({ isDemo: 1 });

InstitutionSchema.pre('save', function (next) {
  if (this.isDemo) {
    if (this.officialBankHelpdesk?.source) {
      this.officialBankHelpdesk.source.status = 'needs_verification';
    }
  }
  next();
});

export const Institution = model<IInstitution>('Institution', InstitutionSchema);
