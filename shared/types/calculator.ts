export interface CalculatorInputs {
  loanAmount: number; // Principal (₹)
  annualInterestRatePercent: number; // e.g. 8.5%
  courseDurationYears: number; // e.g. 4 for B.Tech
  moratoriumPostCourseMonths: number; // e.g. 12 months buffer
  repaymentTenureYears: number; // e.g. 10 to 15 years
  serviceInterestDuringMoratorium: boolean; // if true, pay simple interest monthly during study
  moratoriumConcessionPercent?: number; // e.g. 1.00% if servicing interest
}

export interface AmortizationPeriod {
  periodIndex: number; // month index
  yearIndex: number;
  phase: 'moratorium' | 'repayment';
  openingBalance: number;
  monthlyPayment: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export interface CalculatorResult {
  inputs: CalculatorInputs;
  effectiveRateDuringMoratorium: number;
  effectiveRateDuringRepayment: number;
  totalMoratoriumMonths: number;
  totalRepaymentMonths: number;
  moratoriumInterestAccrued: number;
  principalAtRepaymentStart: number; // initial principal + capitalized interest (if not serviced)
  monthlyEMI: number;
  totalRepaymentInterest: number;
  totalAmountPaid: number;
  savingsByServicingInterestDuringStudy: number;
  yearlySchedule: {
    year: number;
    principalPaid: number;
    interestPaid: number;
    outstandingBalanceEnd: number;
  }[];
  monthlyScheduleSample: AmortizationPeriod[]; // first 36 months + sample
}
