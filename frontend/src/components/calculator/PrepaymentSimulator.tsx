import React, { useState } from 'react';
import { TrendingDown, Zap, Clock, Coins } from 'lucide-react';
import { CalculatorResult, PrepaymentOptions } from '@/types';
import { calculatorService } from '@/services/calculatorService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface PrepaymentSimulatorProps {
  baseResult: CalculatorResult;
}

export const PrepaymentSimulator: React.FC<PrepaymentSimulatorProps> = ({ baseResult }) => {
  const [prepayment, setPrepayment] = useState<PrepaymentOptions>({
    extraMonthlyPayment: 2000,
    lumpSumAmount: 50000,
    lumpSumMonth: 12,
  });

  const simulation = calculatorService.simulatePrepayment(baseResult, prepayment);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const yearsSaved = (simulation.monthsSaved / 12).toFixed(1);

  return (
    <Card className="border-slate-200">
      <CardHeader className="bg-slate-50/70 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-brand-700 text-white">
              <Zap className="h-4 w-4" />
            </span>
            <CardTitle className="text-base">Prepayment & Accelerated Repayment Simulator</CardTitle>
          </div>
          <Badge variant="verified">Smart Repayment</Badge>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Simulate how paying extra from internships, bonuses, or annual salary increments reduces your debt.
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6 text-sm">
        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Extra Monthly Payment Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-xs">
                Extra Monthly Payment
              </label>
              <span className="text-base font-bold text-brand-800">
                +{formatCurrency(prepayment.extraMonthlyPayment)}/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={25000}
              step={500}
              value={prepayment.extraMonthlyPayment}
              onChange={(e) =>
                setPrepayment({ ...prepayment, extraMonthlyPayment: Number(e.target.value) })
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹0</span>
              <span>₹10,000/mo</span>
              <span>₹25,000/mo</span>
            </div>
          </div>

          {/* Lump Sum Payment Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-xs">
                Lump Sum Prepayment (e.g. Stipend / Bonus)
              </label>
              <span className="text-base font-bold text-brand-800">
                {formatCurrency(prepayment.lumpSumAmount)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={500000}
              step={10000}
              value={prepayment.lumpSumAmount}
              onChange={(e) =>
                setPrepayment({ ...prepayment, lumpSumAmount: Number(e.target.value) })
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹0</span>
              <span>₹2.5 Lakhs</span>
              <span>₹5.0 Lakhs</span>
            </div>
          </div>
        </div>

        {/* Results Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/90 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-sm">
              <Coins className="h-4 w-4 text-emerald-600" />
              <span>Total Interest Saved</span>
            </div>
            <div className="text-2xl font-black text-emerald-900 tracking-tight">
              {formatCurrency(simulation.interestSaved)}
            </div>
            <span className="text-xs text-emerald-700 block">Money kept in your pocket</span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/90 space-y-1">
            <div className="flex items-center gap-1.5 text-brand-800 font-semibold text-sm">
              <Clock className="h-4 w-4 text-brand-600" />
              <span>Time Saved</span>
            </div>
            <div className="text-2xl font-black text-brand-900 tracking-tight">
              {simulation.monthsSaved} Months
            </div>
            <span className="text-xs text-brand-700 block">Debt-free {yearsSaved} years earlier</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
              <TrendingDown className="h-4 w-4 text-slate-500" />
              <span>Revised Total Interest</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(simulation.revisedTotalInterest)}
            </div>
            <span className="text-xs text-slate-500 block">
              down from {formatCurrency(baseResult.totalRepaymentInterest)}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 italic">
          RBI Mandate Note: Public and private banks in India are prohibited from levying any prepayment penalty on floating-rate education loans.
        </p>
      </CardContent>
    </Card>
  );
};
