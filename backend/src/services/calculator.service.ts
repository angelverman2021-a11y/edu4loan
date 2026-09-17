import { AppError } from '../utils/apiResponse';

export interface EmiCalculationInput {
  loanAmount: number;
  interestRate: number; // Annual % e.g. 8.5
  loanTenure?: number; // In years (e.g. 10 to 15) or months
  repaymentTenureYears?: number; // In years
  repaymentTenureMonths?: number; // In months
  courseDuration?: number; // In years, e.g. 4
  courseDurationYears?: number;
  courseDurationMonths?: number;
  moratoriumPeriod?: number; // Post-course buffer in months, e.g. 12
  moratoriumPostCourseMonths?: number;
  gracePeriodMonths?: number;
  serviceInterestDuringMoratorium?: boolean;
  interestServicingDuringMoratorium?: boolean;
  repaymentStart?: string;
  disbursementSchedule?: {
    tranche: number;
    amount: number;
    monthOffset: number;
  }[];
}

export interface AmortizationPeriod {
  periodIndex: number;
  yearIndex: number;
  phase: 'moratorium' | 'repayment';
  openingBalance: number;
  monthlyPayment: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export interface EmiCalculationResult {
  isEstimate: boolean;
  disclaimer: string;
  principal: number;
  loanAmount: number;
  annualInterestRatePercent: number;
  courseDurationYears: number;
  moratoriumPostCourseMonths: number;
  moratoriumMonths: number;
  totalMoratoriumMonths: number;
  repaymentTenureYears: number;
  totalRepaymentMonths: number;
  serviceInterestDuringMoratorium: boolean;
  moratoriumInterest: number;
  moratoriumSimpleInterest: number;
  estimatedOutstandingAtRepaymentStart: number;
  repaymentPrincipal: number;
  estimatedEMI: number;
  monthlyEmi: number;
  totalRepaymentInterest: number;
  totalInterest: number;
  totalInterestPayable: number;
  totalRepayment: number;
  savingsByServicingInterestDuringMoratorium: number;
  amortizationSchedule: {
    yearly: {
      year: number;
      principalPaid: number;
      interestPaid: number;
      closingBalance: number;
    }[];
    monthlySample: AmortizationPeriod[];
  };
  amortizationSchedulePreview: AmortizationPeriod[];
}

export const calculateEmi = (input: EmiCalculationInput): EmiCalculationResult => {
  // 1. Validation
  if (typeof input.loanAmount !== 'number' || isNaN(input.loanAmount) || input.loanAmount <= 0) {
    throw new AppError('Loan amount must be a positive number greater than zero.', 400, 'VALIDATION_ERROR');
  }

  if (typeof input.interestRate !== 'number' || isNaN(input.interestRate) || input.interestRate < 0) {
    throw new AppError('Interest rate cannot be negative or invalid.', 400, 'VALIDATION_ERROR');
  }

  if (input.interestRate > 40) {
    throw new AppError('Interest rate exceeds reasonable education loan limits (max 40%).', 400, 'VALIDATION_ERROR');
  }

  // Tenure resolution
  if (input.repaymentTenureMonths !== undefined && input.repaymentTenureMonths <= 0) {
    throw new AppError('Repayment tenure months must be greater than zero.', 400, 'VALIDATION_ERROR');
  }

  let tenureYears =
    input.repaymentTenureYears ||
    (input.repaymentTenureMonths !== undefined ? input.repaymentTenureMonths / 12 : undefined) ||
    input.loanTenure ||
    15;

  // If user passed tenure > 40, assume it was passed in months
  if (tenureYears > 40) {
    tenureYears = tenureYears / 12;
  }

  if (isNaN(tenureYears) || tenureYears <= 0 || tenureYears > 30) {
    throw new AppError('Repayment tenure must be between 1 and 30 years.', 400, 'VALIDATION_ERROR');
  }

  let courseYears = input.courseDurationYears ?? input.courseDuration;
  if (courseYears === undefined && input.courseDurationMonths !== undefined) {
    courseYears = input.courseDurationMonths / 12;
  }
  if (courseYears === undefined) courseYears = 4;

  if (isNaN(courseYears) || courseYears < 0 || courseYears > 10) {
    throw new AppError('Course duration must be between 0 and 10 years.', 400, 'VALIDATION_ERROR');
  }

  const bufferMonths =
    input.moratoriumPostCourseMonths ?? input.moratoriumPeriod ?? input.gracePeriodMonths ?? 12;
  if (isNaN(bufferMonths) || bufferMonths < 0 || bufferMonths > 60) {
    throw new AppError('Moratorium buffer period must be between 0 and 60 months.', 400, 'VALIDATION_ERROR');
  }

  const serviceInterest = Boolean(
    input.serviceInterestDuringMoratorium ?? input.interestServicingDuringMoratorium
  );

  // Validate disbursement schedule if provided
  if (input.disbursementSchedule && Array.isArray(input.disbursementSchedule)) {
    for (const d of input.disbursementSchedule) {
      if (typeof d.amount !== 'number' || d.amount < 0) {
        throw new AppError('Disbursement tranche amounts cannot be negative.', 400, 'VALIDATION_ERROR');
      }
    }
  }

  // 2. Mathematical Computations
  const principal = input.loanAmount;
  const totalMoratoriumMonths = Math.round(courseYears * 12 + bufferMonths);
  const totalRepaymentMonths = Math.round(tenureYears * 12);
  const monthlyRate = input.interestRate / (12 * 100);

  let moratoriumInterest = 0;
  let principalAtRepaymentStart = principal;
  let monthlyEMI = 0;
  let totalRepaymentInterest = 0;
  let totalAmountPaid = 0;

  // Handle 0% Interest Case (e.g. specialized interest-free scholarships/loans)
  if (input.interestRate === 0) {
    moratoriumInterest = 0;
    principalAtRepaymentStart = principal;
    monthlyEMI = Math.round((principal / totalRepaymentMonths) * 100) / 100;
    totalRepaymentInterest = 0;
    totalAmountPaid = principal;
  } else {
    // Normal Interest calculation
    // Simple interest during moratorium: P * (r_annual / 100) * (months / 12)
    const annualRateFraction = input.interestRate / 100;
    moratoriumInterest = Math.round(principal * annualRateFraction * (totalMoratoriumMonths / 12));

    if (serviceInterest) {
      // Interest is serviced monthly, so principal does not capitalize
      principalAtRepaymentStart = principal;
      // EMI on base principal
      const factor = Math.pow(1 + monthlyRate, totalRepaymentMonths);
      monthlyEMI = Math.round((principal * monthlyRate * factor) / (factor - 1) * 100) / 100;
      totalRepaymentInterest = Math.round(monthlyEMI * totalRepaymentMonths - principal);
      totalAmountPaid = Math.round(monthlyEMI * totalRepaymentMonths + moratoriumInterest);
    } else {
      // Interest capitalizes into principal at start of repayment
      principalAtRepaymentStart = principal + moratoriumInterest;
      const factor = Math.pow(1 + monthlyRate, totalRepaymentMonths);
      monthlyEMI =
        Math.round((principalAtRepaymentStart * monthlyRate * factor) / (factor - 1) * 100) / 100;
      totalRepaymentInterest = Math.round(monthlyEMI * totalRepaymentMonths - principalAtRepaymentStart);
      totalAmountPaid = Math.round(monthlyEMI * totalRepaymentMonths);
    }
  }

  // Compute what non-servicing costs vs servicing
  let savings = 0;
  if (!serviceInterest && input.interestRate > 0) {
    const factor = Math.pow(1 + monthlyRate, totalRepaymentMonths);
    const unservicedTotal = monthlyEMI * totalRepaymentMonths;
    const servicedEMI = (principal * monthlyRate * factor) / (factor - 1);
    const servicedTotal = servicedEMI * totalRepaymentMonths + moratoriumInterest;
    savings = Math.max(0, Math.round(unservicedTotal - servicedTotal));
  }

  // 3. Build Amortization Schedules
  const yearlySchedule: {
    year: number;
    principalPaid: number;
    interestPaid: number;
    closingBalance: number;
  }[] = [];

  const monthlySample: AmortizationPeriod[] = [];

  let balance = principalAtRepaymentStart;
  let yearIndex = 1;
  let yearlyPrincipal = 0;
  let yearlyInterest = 0;

  for (let m = 1; m <= totalRepaymentMonths; m++) {
    const interestForMonth = input.interestRate === 0 ? 0 : balance * monthlyRate;
    let principalForMonth = monthlyEMI - interestForMonth;

    if (m === totalRepaymentMonths || balance < principalForMonth) {
      principalForMonth = balance;
    }

    const opening = balance;
    balance = Math.max(0, balance - principalForMonth);

    yearlyPrincipal += principalForMonth;
    yearlyInterest += interestForMonth;

    // Record sample (first 24 months + last 12 months)
    if (m <= 24 || m > totalRepaymentMonths - 12) {
      monthlySample.push({
        periodIndex: m,
        yearIndex: Math.ceil(m / 12),
        phase: 'repayment',
        openingBalance: Math.round(opening * 100) / 100,
        monthlyPayment: Math.round((principalForMonth + interestForMonth) * 100) / 100,
        principalPaid: Math.round(principalForMonth * 100) / 100,
        interestPaid: Math.round(interestForMonth * 100) / 100,
        closingBalance: Math.round(balance * 100) / 100,
      });
    }

    if (m % 12 === 0 || m === totalRepaymentMonths) {
      yearlySchedule.push({
        year: yearIndex,
        principalPaid: Math.round(yearlyPrincipal),
        interestPaid: Math.round(yearlyInterest),
        closingBalance: Math.round(balance),
      });
      yearIndex++;
      yearlyPrincipal = 0;
      yearlyInterest = 0;
    }
  }

  return {
    isEstimate: true,
    disclaimer:
      'Actual EMI may differ depending on bank terms, disbursement schedule, interest capitalization, moratorium and repayment conditions.',
    principal,
    loanAmount: principal,
    annualInterestRatePercent: input.interestRate,
    courseDurationYears: courseYears,
    moratoriumPostCourseMonths: bufferMonths,
    moratoriumMonths: totalMoratoriumMonths,
    totalMoratoriumMonths,
    repaymentTenureYears: tenureYears,
    totalRepaymentMonths,
    serviceInterestDuringMoratorium: serviceInterest,
    moratoriumInterest,
    moratoriumSimpleInterest: moratoriumInterest,
    estimatedOutstandingAtRepaymentStart: principalAtRepaymentStart,
    repaymentPrincipal: principalAtRepaymentStart,
    estimatedEMI: monthlyEMI,
    monthlyEmi: monthlyEMI,
    totalRepaymentInterest,
    totalInterest: moratoriumInterest + totalRepaymentInterest,
    totalInterestPayable: moratoriumInterest + totalRepaymentInterest,
    totalRepayment: totalAmountPaid,
    savingsByServicingInterestDuringMoratorium: savings,
    amortizationSchedule: {
      yearly: yearlySchedule,
      monthlySample,
    },
    amortizationSchedulePreview: monthlySample,
  };
};
