/**
 * Edu4Loan - Verification & Regulatory Constants
 */

import { SourceTier } from '../types/common';

export const VERIFICATION_FALLBACK_TEXT = 'Information not currently verified.';
export const RATE_VERIFICATION_FALLBACK_TEXT = 'Rate not verified — check official bank source.';

export const CONDITIONAL_ELIGIBILITY_DISCLAIMER =
  'Based on the information entered, this scheme may be relevant. Final eligibility is determined by the bank.';

export const GENERAL_FINANCIAL_DISCLAIMER =
  'Edu4Loan is an independent educational and decision-support guidance portal for VIT Bhopal students. It does NOT provide loan approvals, financial advisory, loan sanctions, or loan brokerage services. The lending institution remains solely responsible for credit assessment, interest rates, documentation, and sanctioning decisions.';

export const SOURCE_TIER_PRIORITY: SourceTier[] = [
  SourceTier.GOVERNMENT_OF_INDIA,
  SourceTier.PM_VIDYALAXMI_PORTAL,
  SourceTier.VIDYA_LAKSHMI_PORTAL,
  SourceTier.OFFICIAL_BANK_CIRCULAR,
  SourceTier.OFFICIAL_BANK_WEBSITE,
  SourceTier.VIT_BHOPAL_OFFICIAL,
];

export const FORBIDDEN_RANKING_TERMS = [
  'best bank',
  'worst bank',
  '#1 bank',
  'top rated bank',
  'winner',
  'highest score',
  'recommendation rank',
];
