/**
 * Edu4Loan - Common Verification & Financial Types
 * STRICT FINANCIAL DATA RULE: Every important financial data point must contain:
 * - value
 * - source
 * - source URL
 * - lastVerified
 * - status ('verified' | 'needs_verification' | 'expired')
 */

export type VerificationStatus = 'verified' | 'needs_verification' | 'expired';

export enum SourceTier {
  GOVERNMENT_OF_INDIA = 'Government of India / Ministry of Education',
  PM_VIDYALAXMI_PORTAL = 'PM-Vidyalaxmi Official Portal',
  VIDYA_LAKSHMI_PORTAL = 'Vidya Lakshmi Official Portal (NSDL/Protean)',
  OFFICIAL_BANK_CIRCULAR = 'Official Bank Scheme PDF / Circular',
  OFFICIAL_BANK_WEBSITE = 'Official Bank Website',
  VIT_BHOPAL_OFFICIAL = 'Official VIT Bhopal University Guidance',
}

export interface VerifiedDataPoint<T> {
  value: T;
  source: string;
  sourceUrl: string;
  lastVerified: string; // ISO 8601 date string e.g. "2026-08-15"
  status: VerificationStatus;
  tier?: SourceTier;
  notes?: string;
}

export interface DateRange {
  startDate: string;
  endDate?: string;
}
