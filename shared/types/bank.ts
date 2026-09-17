import { VerifiedDataPoint } from './common';

export type BankCategory = 'public' | 'private' | 'regional_rural' | 'nbfc';

export interface BankBranchContact {
  branchName: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  contactEmail?: string;
  contactPhone?: string;
  isNodalForVitBhopal?: boolean;
}

export interface Bank {
  id: string;
  slug: string;
  name: string;
  shortCode: string;
  category: BankCategory;
  logoUrl?: string;
  officialWebsite: string;
  educationLoanPortalUrl: string;
  vidyaLakshmiRegistered: boolean;
  pmVidyalaxmiRegistered: boolean;
  tollFreeNumber?: string;
  headquarters: string;
  vitBhopalTieUp: VerifiedDataPoint<{
    hasFormalMOU: boolean;
    onCampusDeskAvailable: boolean;
    designatedBranchName: string;
    contactPerson?: string;
    contactNumber?: string;
    details: string;
  }>;
  branches: BankBranchContact[];
  generalTurnaroundTimeDays: string;
  overallSource: VerifiedDataPoint<string>;
  createdAt?: string;
  updatedAt?: string;
}
