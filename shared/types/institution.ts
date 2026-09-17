import { VerifiedDataPoint } from './common';

export interface DegreeProgramFee {
  programName: string; // e.g., 'B.Tech (Computer Science & Engineering)'
  specializations?: string[];
  durationYears: number;
  categoryTiers: {
    category: 1 | 2 | 3 | 4 | 5;
    tuitionFeePerYear: number;
    cautionDepositOneTime: number;
  }[];
  hostelFeeEstimatePerYear: {
    roomType: string; // e.g., '2-Bed AC', '3-Bed Non-AC'
    feePerYear: number;
    messVegNonVegPerYear: number;
  }[];
  source: VerifiedDataPoint<string>;
}

export interface Institution {
  id: string;
  name: string; // 'VIT Bhopal University'
  establishedYear: number;
  location: {
    campusAddress: string;
    district: string;
    state: string;
    pincode: string;
    railwayStationNearest: string;
  };
  nirfAndAccreditationStatus: {
    universityGroup: string; // 'VIT Group of Institutions'
    approvals: string[]; // ['UGC', 'AICTE']
    notes: string;
  };
  programs: DegreeProgramFee[];
  officialBankHelpdesk: {
    locationOnCampus: string;
    timing: string;
    contactEmail: string;
    contactPhone?: string;
    partnerBanksPresentDuringAdmissions: string[];
    source: VerifiedDataPoint<string>;
  };
  loanLetterProcess: {
    steps: string[];
    issuedDocuments: string[]; // ['Provisional Admission Letter', 'Bonafide Certificate', 'Standard Fee Estimation Structure on Official Letterhead']
    turnaroundDays: string;
    officeResponsible: string; // 'Office of Admissions & Finance Section, VIT Bhopal'
  };
}
