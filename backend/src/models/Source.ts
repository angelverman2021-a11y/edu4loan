import { Schema, model, Document } from 'mongoose';

export interface ISource extends Document {
  sourceName: string;
  sourceUrl: string;
  sourceType: string;
  issuingAuthority: string;
  documentUrl?: string;
  circularReference?: string;
  verifiedAt: Date;
  verifiedBy?: string; // Admin user ID or 'SYSTEM_SEED'
  status: 'verified' | 'needs_verification' | 'expired';
  expiryDate?: Date;
  notes?: string;
  isDemo?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SourceSchema = new Schema<ISource>(
  {
    sourceName: {
      type: String,
      required: [true, 'Source name is required'],
      trim: true,
    },
    sourceUrl: {
      type: String,
      required: [true, 'Source URL is required'],
      trim: true,
      match: [/^https?:\/\/.+/, 'Source URL must be a valid HTTP/HTTPS link'],
    },
    sourceType: {
      type: String,
      required: [true, 'Source type is required'],
      enum: [
        'government',
        'ministry',
        'official_portal',
        'official_bank',
        'official_bank_pdf',
        'official_institution',
        'other',
        'GOVERNMENT_PORTAL',
        'BANK_CIRCULAR_PDF',
        'BANK_OFFICIAL_WEBSITE',
        'VIT_BHOPAL_OFFICIAL',
        'RBI_NOTIFICATION',
      ],
      default: 'official_bank',
    },
    issuingAuthority: {
      type: String,
      required: [true, 'Issuing authority is required'],
      trim: true,
    },
    documentUrl: {
      type: String,
      trim: true,
    },
    circularReference: {
      type: String,
      trim: true,
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedBy: {
      type: String,
      default: 'SYSTEM_SEED',
    },
    status: {
      type: String,
      enum: ['verified', 'needs_verification', 'expired'],
      default: 'needs_verification',
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SourceSchema.index({ status: 1 });
SourceSchema.index({ sourceUrl: 1 });
SourceSchema.index({ isDemo: 1 });

// Safety validation hook:
// 1. A demo source can NEVER be marked verified.
// 2. A production source cannot be 'verified' if sourceUrl is empty or invalid.
SourceSchema.pre('save', function (next) {
  if (this.isDemo) {
    this.status = 'needs_verification';
  } else if (this.status === 'verified' && (!this.sourceUrl || !this.sourceUrl.startsWith('http'))) {
    return next(new Error('A source record cannot have "verified" status without a valid sourceUrl.'));
  }
  next();
});

export const Source = model<ISource>('Source', SourceSchema);
