import { VerifiedDataPoint } from '@shared/types/common';

export interface GovernmentSchemeItem {
  _id?: string;
  code: 'PM_VIDYALAXMI' | 'VIDYA_LAKSHMI_PORTAL' | 'CSIS' | 'DR_AMBEDKAR' | 'CGFSEL';
  name: string;
  nodalMinistry: string;
  description: string;
  officialPortalUrl: string;
  launchYear: number;
  subsidyDetails: {
    interestSubventionPercent?: number;
    interestFreeMoratorium?: boolean;
    coveragePercent?: number;
    maxLoanLimit?: number;
  };
  eligibilityCriteria: {
    incomeCeilingAnnual?: number;
    courseType?: string[];
    institutionCriteria?: string;
  };
  applicableInstitutions?: string;
  targetBeneficiaries?: string;
  status: 'verified' | 'needs_verification' | 'expired';
  lastVerified: string;
  source?: VerifiedDataPoint<string>;
  keyFeatures?: string[];
}

export interface SubsidyCheckParams {
  annualIncome: number;
  loanAmount: number;
  institutionType: 'nirf_top_100_200' | 'other';
  degreeLevel: 'Undergraduate' | 'Postgraduate';
  minorityOrReserved?: boolean;
}

export interface SubsidyCheckResult {
  isCsisEligible: boolean;
  isPmVidyalaxmiEligible: boolean;
  isCgfselEligible: boolean;
  matchedSchemes: {
    code: string;
    name: string;
    benefit: string;
    subventionRate: string;
    incomeCeiling: string;
    badgeVariant: 'verified' | 'info' | 'advisory';
    notes: string;
  }[];
  explanation: string;
}

export interface VlpStep {
  stepNumber: number;
  title: string;
  description: string;
  tabName?: string;
  keyAction: string;
  warning?: string;
}
