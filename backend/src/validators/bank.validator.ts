import { z } from 'zod';

const verifiedDataPointStringSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  source: z.string().min(1, 'Source name is required'),
  sourceUrl: z.string().url('Source URL must be a valid URL'),
  lastVerified: z.string().min(1, 'Last verified date is required'),
  status: z.enum(['verified', 'needs_verification', 'expired']),
});

export const createBankSchema = z.object({
  name: z.string().min(2, 'Bank name must be at least 2 characters'),
  shortCode: z.string().min(2, 'Short code required (e.g. SBI, BOB)'),
  category: z.enum(['public', 'private', 'regional_rural', 'nbfc']),
  logoUrl: z.string().url().optional(),
  officialWebsite: z.string().url('Official website must be a valid URL'),
  educationLoanPortalUrl: z.string().url('Portal URL must be a valid URL'),
  vidyaLakshmiRegistered: z.boolean().default(false),
  pmVidyalaxmiRegistered: z.boolean().default(false),
  tollFreeNumber: z.string().optional(),
  headquarters: z.string().min(2, 'Headquarters location is required'),
  vitBhopalTieUp: z
    .object({
      hasFormalMOU: z.boolean().default(false),
      onCampusDeskAvailable: z.boolean().default(false),
      designatedBranchName: z.string().default('None verified'),
      contactPerson: z.string().optional(),
      contactNumber: z.string().optional(),
      details: z.string().default('Information not currently verified.'),
      source: z.string().default('Pending verification'),
      sourceUrl: z.string().default(''),
      lastVerified: z.string().default(new Date().toISOString().split('T')[0]),
      status: z.enum(['verified', 'needs_verification', 'expired']).default('needs_verification'),
    })
    .optional(),
  branches: z
    .array(
      z.object({
        branchName: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        address: z.string().min(1),
        pincode: z.string().min(6),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
        isNodalForVitBhopal: z.boolean().default(false),
      })
    )
    .default([]),
  generalTurnaroundTimeDays: z.string().default('15-25 business days'),
  overallSource: verifiedDataPointStringSchema,
});

export const updateBankSchema = createBankSchema.partial();
