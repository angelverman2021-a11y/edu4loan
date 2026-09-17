import { VerifiedDataPoint } from './common';

export type BenchmarkType = 'EBLR' | 'RLLR' | 'MCLR' | 'Fixed' | 'REPO_LINKED';

export interface InterestRateStructure {
  benchmarkType: BenchmarkType;
  benchmarkRatePercent: number; // e.g., RBI Repo 6.50%
  spreadPercentMin: number;
  spreadPercentMax: number;
  minRate: VerifiedDataPoint<number>; // e.g. 8.50%
  maxRate: VerifiedDataPoint<number>; // e.g. 10.65%
  girlChildConcessionPercent: VerifiedDataPoint<number>; // e.g. 0.50%
  premierInstituteConcessionPercent?: VerifiedDataPoint<number>;
  promptServicingConcessionPercent?: VerifiedDataPoint<number>; // e.g. 1.00%
  notes?: string;
}

export interface CollateralStructure {
  upTo4Lakhs: string; // e.g. "No collateral, No third-party guarantee (Mandatory RBI guidelines)"
  from4To7point5Lakhs: string; // e.g. "No tangible collateral; Suitable third-party guarantee or CGFSEL credit guarantee cover"
  above7point5Lakhs: string; // e.g. "Tangible collateral security of suitable value along with assignment of future income"
  acceptableCollateralTypes: string[]; // e.g. ["Residential Property", "Fixed Deposit", "LIC Policy surrender value", "NSC/Government Bonds"]
  details: string;
}

export interface MarginMoneyStructure {
  upTo4LakhsPercent: number; // typically 0%
  above4LakhsIndiaPercent: number; // typically 5%
  scholarshipAdjustmentAllowed: boolean;
  notes?: string;
}

export interface MoratoriumStructure {
  courseDurationYears: number;
  moratoriumBufferMonths: number; // typically 12 months after course or 6 months after securing job
  repaymentTenureMaxYears: number; // typically up to 15 years
  interestServicingDuringMoratorium: 'optional_simple' | 'mandatory_simple' | 'compound';
  explanation: string;
}

export interface LoanScheme {
  id: string;
  bankId: string;
  bankName: string;
  schemeName: string;
  schemeCode: string;
  overview: string;
  targetDegreeLevel: ('Undergraduate' | 'Postgraduate' | 'Doctoral' | 'Diploma')[];
  eligibilityCriteria: string[];
  maxLoanAmountInland: VerifiedDataPoint<number>; // e.g. ₹20,00,000 to ₹1,50,00,000
  interestRate: InterestRateStructure;
  collateral: CollateralStructure;
  marginMoney: MarginMoneyStructure;
  moratorium: MoratoriumStructure;
  processingFee: VerifiedDataPoint<string>; // e.g. "Nil for studies in India"
  prepaymentPenalty: VerifiedDataPoint<string>; // e.g. "Nil for floating rate loans as per RBI norms"
  section80ETaxBenefitApplicable: boolean;
  vitBhopalEligible: boolean;
  vitBhopalCategoryNote?: string;
  officialCircularUrl: string;
  officialApplicationUrl: string;
  source: VerifiedDataPoint<string>;
  createdAt?: string;
  updatedAt?: string;
}
