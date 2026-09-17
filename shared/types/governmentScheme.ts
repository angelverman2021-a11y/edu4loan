import { VerifiedDataPoint } from './common';

export interface GovernmentScheme {
  id: string;
  schemeName: string;
  schemeCode: 'PM_VIDYALAXMI' | 'VIDYA_LAKSHMI_PORTAL' | 'CSIS' | 'CGFSEL' | 'DR_AMBEDKAR_CSIS';
  managingAuthority: string; // e.g., 'Department of Higher Education, Ministry of Education, Govt of India'
  targetBeneficiaries: string;
  incomeCeilingPerAnnum: number | null; // e.g. 800000 for PM-Vidyalaxmi 3% subvention, 450000 for CSIS
  keyBenefits: string[];
  eligibilityConditions: string[];
  howToApplySteps: string[];
  portalUrl: string;
  vitBhopalRelevance: string;
  source: VerifiedDataPoint<string>;
  createdAt?: string;
  updatedAt?: string;
}
