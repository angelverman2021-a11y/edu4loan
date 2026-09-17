import { CalculatorInputs, CalculatorResult, AmortizationPeriod } from '@shared/types';

export * from '@shared/types/calculator';

export interface PrepaymentOptions {
  extraMonthlyPayment: number;
  lumpSumAmount: number;
  lumpSumMonth: number;
}

export interface ChartDonutData {
  name: string;
  value: number;
  color: string;
}

export interface ChartAreaPoint {
  period: string;
  year: number;
  phase: 'moratorium' | 'repayment';
  balance: number;
}

export interface ChartBarPoint {
  year: string;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export interface AmortizationYearRow {
  year: number;
  openingBalance: number;
  totalPaid: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}
