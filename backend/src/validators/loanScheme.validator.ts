import { z } from 'zod';

const verifiedNumericSchema = z.object({
  value: z.number().nonnegative(),
  source: z.string().min(1, 'Source name is required'),
  sourceUrl: z.string().url('Source URL must be a valid URL'),
  lastVerified: z.string().min(1),
  status: z.enum(['verified', 'needs_verification', 'expired']),
});

const verifiedStringSchema = z.object({
  value: z.string().min(1),
  source: z.string().min(1, 'Source name is required'),
  sourceUrl: z.string().url('Source URL must be a valid URL'),
  lastVerified: z.string().min(1),
  status: z.enum(['verified', 'needs_verification', 'expired']),
});

export const createLoanSchemeSchema = z.object({
  bankId: z.string().min(1, 'Bank ID is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  schemeName: z.string().min(2, 'Scheme name is required'),
  schemeCode: z.string().min(2, 'Scheme code is required'),
  overview: z.string().min(10, 'Overview must be at least 10 characters'),
  targetDegreeLevel: z.array(z.enum(['Undergraduate', 'Postgraduate', 'Doctoral', 'Diploma'])).min(1),
  eligibilityCriteria: z.array(z.string()).default([]),
  maxLoanAmountInland: verifiedNumericSchema,
  interestRate: z.object({
    benchmarkType: z.enum(['EBLR', 'RLLR', 'MCLR', 'Fixed', 'REPO_LINKED']),
    benchmarkRatePercent: z.number().nonnegative(),
    spreadPercentMin: z.number(),
    spreadPercentMax: z.number(),
    minRate: verifiedNumericSchema,
    maxRate: verifiedNumericSchema,
    girlChildConcessionPercent: verifiedNumericSchema,
    premierInstituteConcessionPercent: verifiedNumericSchema.optional(),
    promptServicingConcessionPercent: verifiedNumericSchema.optional(),
    notes: z.string().optional(),
  }),
  collateral: z.object({
    upTo4Lakhs: z.string().min(1),
    from4To7point5Lakhs: z.string().min(1),
    above7point5Lakhs: z.string().min(1),
    acceptableCollateralTypes: z.array(z.string()).default([]),
    details: z.string().min(1),
  }),
  marginMoney: z.object({
    upTo4LakhsPercent: z.number().min(0).max(100),
    above4LakhsIndiaPercent: z.number().min(0).max(100),
    scholarshipAdjustmentAllowed: z.boolean().default(true),
    notes: z.string().optional(),
  }),
  moratorium: z.object({
    courseDurationYears: z.number().int().positive(),
    moratoriumBufferMonths: z.number().int().nonnegative(),
    repaymentTenureMaxYears: z.number().int().positive(),
    interestServicingDuringMoratorium: z.enum(['optional_simple', 'mandatory_simple', 'compound']),
    explanation: z.string().min(1),
  }),
  processingFee: verifiedStringSchema,
  prepaymentPenalty: verifiedStringSchema,
  section80ETaxBenefitApplicable: z.boolean().default(true),
  vitBhopalEligible: z.boolean().default(true),
  vitBhopalCategoryNote: z.string().optional(),
  officialCircularUrl: z.string().url('Official circular URL must be a valid URL'),
  officialApplicationUrl: z.string().url('Application URL must be a valid URL'),
  source: verifiedStringSchema,
  status: z.enum(['verified', 'needs_verification', 'expired']).default('needs_verification'),
  lastVerified: z.string().min(1),
});

export const updateLoanSchemeSchema = createLoanSchemeSchema.partial();
