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
        'GOVERNMENT_PORTAL',
        'BANK_CIRCULAR_PDF',
        'BANK_OFFICIAL_WEBSITE',
        'VIT_BHOPAL_OFFICIAL',
        'RBI_NOTIFICATION',
      ],
      default: 'BANK_OFFICIAL_WEBSITE',
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
  },
  {
    timestamps: true,
  }
);

// Indexes
SourceSchema.index({ status: 1 });
SourceSchema.index({ sourceUrl: 1 });

// Safety validation hook: A source cannot be 'verified' if sourceUrl is empty or invalid
SourceSchema.pre('save', function (next) {
  if (this.status === 'verified' && (!this.sourceUrl || this.sourceUrl.trim() === '')) {
    return next(new Error('A source record cannot have "verified" status without a valid sourceUrl.'));
  }
  next();
});

export const Source = model<ISource>('Source', SourceSchema);
