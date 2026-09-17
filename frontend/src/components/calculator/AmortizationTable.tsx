import React, { useState } from 'react';
import { Download, Table, FileSpreadsheet, ChevronDown, ChevronUp } from 'lucide-react';
import { CalculatorResult } from '@/types';
import { calculatorService } from '@/services/calculatorService';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export interface AmortizationTableProps {
  result: CalculatorResult;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({ result }) => {
  const [showMonthly, setShowMonthly] = useState<boolean>(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleDownloadCsv = () => {
    const csvContent = calculatorService.exportAmortizationToCsv(result);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Edu4Loan_Repayment_Schedule_₹${result.inputs.loanAmount}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const courseYears = result.inputs.courseDurationYears;

  return (
    <Card className="border-slate-200">
      <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <Table className="h-4 w-4 text-brand-700" />
            <span>Detailed Repayment Amortization Schedule</span>
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Year-by-year breakdown of principal recovery and interest servicing commitments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowMonthly(!showMonthly)}
          >
            {showMonthly ? 'Show Yearly Summary' : 'Show Monthly Preview'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadCsv}
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        {!showMonthly ? (
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="p-3">Period</th>
                <th className="p-3">Phase</th>
                <th className="p-3">Principal Repaid</th>
                <th className="p-3">Interest Paid</th>
                <th className="p-3">Year-End Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {/* Moratorium Row */}
              <tr className="bg-amber-50/40 font-medium">
                <td className="p-3 font-semibold text-amber-900">
                  Years 1 to {courseYears + 1}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    Moratorium
                  </span>
                </td>
                <td className="p-3 text-slate-500">₹0 (Grace Period)</td>
                <td className="p-3 font-semibold text-amber-800">
                  {formatCurrency(result.moratoriumInterestAccrued)}
                  <span className="text-[10px] font-normal text-slate-500 block">
                    {result.inputs.serviceInterestDuringMoratorium
                      ? 'Serviced monthly'
                      : 'Capitalized into principal'}
                  </span>
                </td>
                <td className="p-3 font-bold text-slate-900">
                  {formatCurrency(result.principalAtRepaymentStart)}
                </td>
              </tr>

              {/* Repayment Years */}
              {result.yearlySchedule.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 font-semibold text-brand-800">
                    Year {row.year}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-brand-800 text-[10px] font-bold">
                      Repayment
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-900">
                    {formatCurrency(row.principalPaid)}
                  </td>
                  <td className="p-3 text-amber-700">
                    {formatCurrency(row.interestPaid)}
                  </td>
                  <td className="p-3 font-bold text-slate-900">
                    {formatCurrency(row.outstandingBalanceEnd)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="p-3">Month</th>
                <th className="p-3">Opening Balance</th>
                <th className="p-3">EMI Payment</th>
                <th className="p-3">Principal Paid</th>
                <th className="p-3">Interest Paid</th>
                <th className="p-3">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {result.monthlyScheduleSample.map((period) => (
                <tr key={period.periodIndex} className="hover:bg-slate-50/60">
                  <td className="p-3 font-semibold text-brand-800">
                    Month {period.periodIndex} (Yr {period.yearIndex})
                  </td>
                  <td className="p-3">{formatCurrency(period.openingBalance)}</td>
                  <td className="p-3 font-semibold text-slate-900">
                    {formatCurrency(period.monthlyPayment)}
                  </td>
                  <td className="p-3 text-emerald-700">
                    {formatCurrency(period.principalPaid)}
                  </td>
                  <td className="p-3 text-amber-700">
                    {formatCurrency(period.interestPaid)}
                  </td>
                  <td className="p-3 font-bold text-slate-900">
                    {formatCurrency(period.closingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};
