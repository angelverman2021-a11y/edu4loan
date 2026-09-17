import { VerifiedDataPoint } from '@shared/types';

export interface FilterState {
  search?: string;
  bank?: string;
  degreeLevel?: string;
  loanAmount?: number;
  collateral?: 'all' | 'free' | 'required' | 'unknown';
  studentCategory?: string;
  pmVidyalaxmi?: boolean;
  vidyaLakshmi?: boolean;
  status?: string;
  page?: number;
  limit?: number;
}

export interface BankSummary {
  _id: string;
  name: string;
  slug: string;
  shortCode: string;
  category: 'public' | 'private' | 'regional_rural' | 'nbfc';
  logoUrl?: string;
  officialWebsite: string;
  tollFreeNumber?: string;
  vidyaLakshmiRegistered?: boolean;
  pmVidyalaxmiRegistered?: boolean;
  vitBhopalTieUp?: {
    hasDedicatedDesk: boolean;
    deskLocation?: string;
    branchName?: string;
    contactPerson?: string;
    contactPhone?: string;
  };
}

export interface LoanSchemeItem {
  _id: string;
  bankId: BankSummary | string;
  bankName: string;
  schemeName: string;
  schemeCode: string;
  overview: string;
  targetDegreeLevel: string[];
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
    source: string;
    sourceUrl: string;
    lastVerified: string;
    status: 'verified' | 'needs_verification' | 'expired';
  };
  status: 'verified' | 'needs_verification' | 'expired';
  lastVerified: string;
}

export interface ComparisonSchemeData {
  id: string;
  schemeName: string;
  schemeCode: string;
  overview: string;
  bank: {
    id: string;
    name: string;
    slug: string;
    category: string;
    logoUrl?: string;
    officialWebsite: string;
    tollFreeNumber?: string;
    vitBhopalTieUp?: any;
  };
  interestRate: {
    benchmarkType: string;
    benchmarkRatePercent: number;
    spreadPercentMin: number;
    spreadPercentMax: number;
    minRate: VerifiedDataPoint<number>;
    maxRate: VerifiedDataPoint<number>;
    girlChildConcessionPercent: VerifiedDataPoint<number>;
    promptServicingConcessionPercent?: VerifiedDataPoint<number> | null;
    notes?: string;
  };
  loanAmount: {
    inlandMax: VerifiedDataPoint<number>;
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
    interestServicingDuringMoratorium: string;
    explanation: string;
  };
  feesAndCharges: {
    processingFee: VerifiedDataPoint<string>;
    prepaymentPenalty: VerifiedDataPoint<string>;
  };
  eligibility: {
    degreeLevels: string[];
    criteria: string[];
    vitBhopalEligible: boolean;
    vitBhopalCategoryNote?: string;
  };
  taxBenefit: {
    section80EApplicable: boolean;
  };
  officialPortals: {
    applicationUrl: string;
    circularUrl: string;
  };
  verification: {
    source: any;
    status: 'verified' | 'needs_verification' | 'expired';
    lastVerified: string;
  };
}

export interface ComparisonResult {
  count: number;
  disclaimer: string;
  schemes: ComparisonSchemeData[];
  featureMatrix: {
    feature: string;
    values: any[];
  }[];
}
