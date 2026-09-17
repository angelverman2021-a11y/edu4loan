import { api } from './api';
import {
  CalculatorInputs,
  CalculatorResult,
  AmortizationPeriod,
  ChartDonutData,
  ChartAreaPoint,
  ChartBarPoint,
  AmortizationYearRow,
  PrepaymentOptions,
} from '@/types';

export const calculatorService = {
  /**
   * Remote calculation via backend REST endpoint
   */
  calculateEmiOnline: async (inputs: CalculatorInputs): Promise<CalculatorResult> => {
    const res = await api.post<any>('/calculator/emi', {
      loanAmount: inputs.loanAmount,
      interestRate: inputs.annualInterestRatePercent,
      repaymentTenureYears: inputs.repaymentTenureYears,
      courseDurationYears: inputs.courseDurationYears,
      moratoriumPostCourseMonths: inputs.moratoriumPostCourseMonths,
      serviceInterestDuringMoratorium: inputs.serviceInterestDuringMoratorium,
    });

    const data = res.data;
    return {
      inputs,
      effectiveRateDuringMoratorium: inputs.annualInterestRatePercent,
      effectiveRateDuringRepayment: inputs.annualInterestRatePercent,
      totalMoratoriumMonths: data.totalMoratoriumMonths,
      totalRepaymentMonths: data.totalRepaymentMonths,
      moratoriumInterestAccrued: data.moratoriumSimpleInterest || data.moratoriumInterest,
      principalAtRepaymentStart: data.estimatedOutstandingAtRepaymentStart || data.repaymentPrincipal,
      monthlyEMI: data.estimatedEMI || data.monthlyEmi,
      totalRepaymentInterest: data.totalRepaymentInterest,
      totalAmountPaid: data.totalRepayment,
      savingsByServicingInterestDuringStudy: data.savingsByServicingInterestDuringMoratorium,
      yearlySchedule: data.amortizationSchedule?.yearly || [],
      monthlyScheduleSample: data.amortizationSchedulePreview || [],
    };
  },

  /**
   * High-speed local calculation for smooth 60fps slider interactions
   */
  calculateEmiLocal: (inputs: CalculatorInputs): CalculatorResult => {
    const P = inputs.loanAmount;
    const rAnnual = inputs.annualInterestRatePercent;
    const courseYears = inputs.courseDurationYears;
    const bufferMonths = inputs.moratoriumPostCourseMonths;
    const tenureYears = inputs.repaymentTenureYears;
    const serviceInterest = inputs.serviceInterestDuringMoratorium;

    const totalMoratoriumMonths = Math.round(courseYears * 12 + bufferMonths);
    const totalRepaymentMonths = Math.round(tenureYears * 12);
    const rMonthly = rAnnual / (12 * 100);

    // Moratorium Simple Interest: P * (r_annual / 100) * (months / 12)
    const moratoriumInterest =
      rAnnual === 0 ? 0 : Math.round(P * (rAnnual / 100) * (totalMoratoriumMonths / 12));

    const principalAtRepayment = serviceInterest ? P : P + moratoriumInterest;

    let monthlyEMI = 0;
    let totalRepaymentInterest = 0;
    let totalAmountPaid = 0;

    if (rAnnual === 0) {
      monthlyEMI = Math.round((P / totalRepaymentMonths) * 100) / 100;
      totalRepaymentInterest = 0;
      totalAmountPaid = P;
    } else {
      const factor = Math.pow(1 + rMonthly, totalRepaymentMonths);
      monthlyEMI = Math.round(((principalAtRepayment * rMonthly * factor) / (factor - 1)) * 100) / 100;
      totalRepaymentInterest = Math.round(monthlyEMI * totalRepaymentMonths - principalAtRepayment);
      totalAmountPaid = serviceInterest
        ? Math.round(monthlyEMI * totalRepaymentMonths + moratoriumInterest)
        : Math.round(monthlyEMI * totalRepaymentMonths);
    }

    // Savings by servicing interest during study
    let savings = 0;
    if (!serviceInterest && rAnnual > 0) {
      const factor = Math.pow(1 + rMonthly, totalRepaymentMonths);
      const unservicedTotal = monthlyEMI * totalRepaymentMonths;
      const servicedEMI = (P * rMonthly * factor) / (factor - 1);
      const servicedTotal = servicedEMI * totalRepaymentMonths + moratoriumInterest;
      savings = Math.max(0, Math.round(unservicedTotal - servicedTotal));
    }

    // Generate yearly and monthly schedule
    const yearlySchedule: {
      year: number;
      principalPaid: number;
      interestPaid: number;
      outstandingBalanceEnd: number;
    }[] = [];

    const monthlyScheduleSample: AmortizationPeriod[] = [];

    let balance = principalAtRepayment;
    let currentYearPrincipal = 0;
    let currentYearInterest = 0;
    let currentYear = 1;

    for (let m = 1; m <= totalRepaymentMonths; m++) {
      const interestForMonth = rAnnual === 0 ? 0 : Math.round(balance * rMonthly * 100) / 100;
      const principalForMonth = Math.min(balance, Math.round((monthlyEMI - interestForMonth) * 100) / 100);
      const closing = Math.max(0, Math.round((balance - principalForMonth) * 100) / 100);

      currentYearPrincipal += principalForMonth;
      currentYearInterest += interestForMonth;

      if (m <= 36 || m % 12 === 0 || m === totalRepaymentMonths) {
        monthlyScheduleSample.push({
          periodIndex: m,
          yearIndex: Math.ceil(m / 12),
          phase: 'repayment',
          openingBalance: balance,
          monthlyPayment: monthlyEMI,
          principalPaid: principalForMonth,
          interestPaid: interestForMonth,
          closingBalance: closing,
        });
      }

      balance = closing;

      if (m % 12 === 0 || m === totalRepaymentMonths) {
        yearlySchedule.push({
          year: currentYear,
          principalPaid: Math.round(currentYearPrincipal),
          interestPaid: Math.round(currentYearInterest),
          outstandingBalanceEnd: Math.round(balance),
        });
        currentYear++;
        currentYearPrincipal = 0;
        currentYearInterest = 0;
      }
    }

    return {
      inputs,
      effectiveRateDuringMoratorium: rAnnual,
      effectiveRateDuringRepayment: rAnnual,
      totalMoratoriumMonths,
      totalRepaymentMonths,
      moratoriumInterestAccrued: moratoriumInterest,
      principalAtRepaymentStart: principalAtRepayment,
      monthlyEMI,
      totalRepaymentInterest,
      totalAmountPaid,
      savingsByServicingInterestDuringStudy: savings,
      yearlySchedule,
      monthlyScheduleSample,
    };
  },

  /**
   * Prepares Donut Chart data
   */
  getDonutChartData: (result: CalculatorResult): ChartDonutData[] => {
    return [
      {
        name: 'Principal Borrowed',
        value: result.inputs.loanAmount,
        color: '#1D4ED8', // VIT Royal Blue
      },
      {
        name: 'Moratorium Interest',
        value: result.moratoriumInterestAccrued,
        color: '#D97706', // Amber
      },
      {
        name: 'Repayment Interest',
        value: result.totalRepaymentInterest,
        color: '#64748B', // Slate
      },
    ];
  },

  /**
   * Prepares Area Chart data (balance trajectory over course + moratorium + repayment)
   */
  getAreaChartData: (result: CalculatorResult): ChartAreaPoint[] => {
    const points: ChartAreaPoint[] = [];
    const courseYears = result.inputs.courseDurationYears;
    const initialPrincipal = result.inputs.loanAmount;
    const repaymentStartPrincipal = result.principalAtRepaymentStart;

    // Moratorium years
    for (let y = 0; y <= courseYears + 1; y++) {
      const balance = result.inputs.serviceInterestDuringMoratorium
        ? initialPrincipal
        : Math.round(initialPrincipal + (result.moratoriumInterestAccrued * y) / (courseYears + 1));

      points.push({
        period: `Y${y} (Study)`,
        year: y,
        phase: 'moratorium',
        balance,
      });
    }

    // Repayment years
    result.yearlySchedule.forEach((item) => {
      points.push({
        period: `Yr ${courseYears + 1 + item.year}`,
        year: courseYears + 1 + item.year,
        phase: 'repayment',
        balance: item.outstandingBalanceEnd,
      });
    });

    return points;
  },

  /**
   * Prepares Bar Chart data (yearly principal vs interest)
   */
  getBarChartData: (result: CalculatorResult): ChartBarPoint[] => {
    return result.yearlySchedule.map((item) => ({
      year: `Yr ${item.year}`,
      principalPaid: item.principalPaid,
      interestPaid: item.interestPaid,
      closingBalance: item.outstandingBalanceEnd,
    }));
  },

  /**
   * Prepayment and accelerated repayment modeling
   */
  simulatePrepayment: (
    result: CalculatorResult,
    prepayment: PrepaymentOptions
  ): {
    revisedTenureMonths: number;
    monthsSaved: number;
    interestSaved: number;
    revisedTotalInterest: number;
  } => {
    const P = result.principalAtRepaymentStart;
    const rAnnual = result.effectiveRateDuringRepayment;
    const rMonthly = rAnnual / (12 * 100);
    const standardEmi = result.monthlyEMI;
    const extraPerMonth = prepayment.extraMonthlyPayment || 0;
    const lumpSum = prepayment.lumpSumAmount || 0;
    const lumpMonth = prepayment.lumpSumMonth || 12;

    if (extraPerMonth === 0 && lumpSum === 0) {
      return {
        revisedTenureMonths: result.totalRepaymentMonths,
        monthsSaved: 0,
        interestSaved: 0,
        revisedTotalInterest: result.totalRepaymentInterest,
      };
    }

    let balance = P;
    let months = 0;
    let totalInterestPaid = 0;
    const maxMonths = result.totalRepaymentMonths;

    while (balance > 0 && months < maxMonths) {
      months++;
      const interest = rAnnual === 0 ? 0 : balance * rMonthly;
      totalInterestPaid += interest;

      let payment = standardEmi + extraPerMonth;
      if (months === lumpMonth) {
        payment += lumpSum;
      }

      const principalPaid = payment - interest;
      balance = Math.max(0, balance - principalPaid);
    }

    const monthsSaved = Math.max(0, result.totalRepaymentMonths - months);
    const interestSaved = Math.max(0, Math.round(result.totalRepaymentInterest - totalInterestPaid));

    return {
      revisedTenureMonths: months,
      monthsSaved,
      interestSaved,
      revisedTotalInterest: Math.round(totalInterestPaid),
    };
  },

  /**
   * Generates CSV for download
   */
  exportAmortizationToCsv: (result: CalculatorResult): string => {
    const headers = [
      'Year',
      'Phase',
      'Principal Paid (INR)',
      'Interest Paid (INR)',
      'Outstanding Balance (INR)',
    ];

    const rows: string[] = [];
    rows.push(headers.join(','));

    // Moratorium note
    rows.push(
      `"Moratorium (Years 1 to ${result.inputs.courseDurationYears + 1})","Moratorium",0,${result.moratoriumInterestAccrued},${result.principalAtRepaymentStart}`
    );

    result.yearlySchedule.forEach((item) => {
      rows.push(
        `"Year ${item.year}","Repayment",${item.principalPaid},${item.interestPaid},${item.outstandingBalanceEnd}`
      );
    });

    return rows.join('\n');
  },
};
