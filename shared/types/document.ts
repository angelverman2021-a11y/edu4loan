import { VerifiedDataPoint } from './common';

export type DocumentCategory =
  | 'student_kyc'
  | 'academic_records'
  | 'vit_bhopal_admission'
  | 'coapplicant_kyc'
  | 'coapplicant_income_salaried'
  | 'coapplicant_income_selfemployed'
  | 'collateral_property'
  | 'collateral_liquid'
  | 'bank_specific_forms';

export interface DocumentItem {
  id: string;
  name: string;
  category: DocumentCategory;
  description: string;
  isRequired: boolean;
  applicableCondition: string; // e.g. "Required for all loans", "Required only if loan > ₹7.5 Lakhs", "For salaried co-applicants"
  sampleUrl?: string;
  issuingAuthority: string; // e.g. "VIT Bhopal Admissions/Accounts Office", "UIDAI", "Income Tax Department"
  verificationTip: string;
  source: VerifiedDataPoint<string>;
}

export interface PersonalizedChecklistRequest {
  degreeProgram: string; // e.g., 'B.Tech'
  estimatedLoanAmount: number; // in INR ₹
  coApplicantType: 'salaried' | 'self_employed' | 'pensioner' | 'agriculturist';
  hasCollateral: boolean;
  collateralType?: 'residential_property' | 'fixed_deposit' | 'none';
  applyingThroughVidyaLakshmi: boolean;
}
