import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calculator, ShieldAlert, Sparkles, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

export const CalculatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [principal, setPrincipal] = useState<number>(() => {
    const val = Number(searchParams.get('amount'));
    return val && !isNaN(val) ? val : 1200000;
  });

  const [annualRate, setAnnualRate] = useState<number>(() => {
    const val = Number(searchParams.get('rate'));
    return val && !isNaN(val) ? val : 9.15;
  });

  const [tenureYears, setTenureYears] = useState<number>(10);
  const [courseYears, setCourseYears] = useState<number>(4);
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(12);
  const [serviceInterestMonthly, setServiceInterestMonthly] = useState<boolean>(false);

  // Calculations
  const calculation = useMemo(() => {
    const totalMoratoriumMonths = courseYears * 12 + moratoriumMonths;
    const rMonthly = annualRate / 12 / 100;

    // Simple interest during moratorium: P * r * t (years)
    const moratoriumDurationYears = totalMoratoriumMonths / 12;
    const moratoriumInterest = principal * (annualRate / 100) * moratoriumDurationYears;

    // Capitalized principal if interest not serviced monthly
    const effectivePrincipal = serviceInterestMonthly
      ? principal
      : principal + moratoriumInterest;

    // Repayment months
    const repaymentMonths = tenureYears * 12;

    // Standard EMI formula
    const emi =
      rMonthly === 0
        ? effectivePrincipal / repaymentMonths
        : (effectivePrincipal * rMonthly * Math.pow(1 + rMonthly, repaymentMonths)) /
          (Math.pow(1 + rMonthly, repaymentMonths) - 1);

    const totalRepaymentPaid = emi * repaymentMonths;
    const repaymentInterest = totalRepaymentPaid - effectivePrincipal;
    const totalOutflow = serviceInterestMonthly
      ? principal + moratoriumInterest + repaymentInterest
      : totalRepaymentPaid;

    const interestSaved = serviceInterestMonthly
      ? 0
      : (moratoriumInterest * rMonthly * Math.pow(1 + rMonthly, repaymentMonths)) /
        (Math.pow(1 + rMonthly, repaymentMonths) - 1) * repaymentMonths;

    return {
      totalMoratoriumMonths,
      moratoriumInterest,
      effectivePrincipal,
      emi,
      totalRepaymentPaid,
      totalOutflow,
      interestSaved,
    };
  }, [principal, annualRate, tenureYears, courseYears, moratoriumMonths, serviceInterestMonthly]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="info">Phase 7 Simulator Engine</Badge>
          <VerifiedBadge status="verified" lastVerified="2026-09-01" size="sm" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Calculator className="h-8 w-8 text-brand-700 shrink-0" />
          <span>Education Loan EMI & Moratorium Calculator</span>
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Accurately simulate your repayment schedule taking into account 4 years of study, 1-year moratorium, and the massive financial difference of servicing simple interest versus allowing it to capitalize into principal.
        </p>
      </div>

      {/* Simulator Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Loan & Study Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Principal Amount */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Total Loan Required (Principal)
                  </label>
                  <span className="text-sm font-bold text-brand-700">
                    {formatCurrency(principal)}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={4000000}
                  step={50000}
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹1 Lakh</span>
                  <span>₹20 Lakhs</span>
                  <span>₹40 Lakhs</span>
                </div>
              </div>

              {/* Annual Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Annual Interest Rate (% p.a.)
                  </label>
                  <span className="text-sm font-bold text-brand-700">{annualRate}%</span>
                </div>
                <input
                  type="range"
                  min={7.0}
                  max={15.0}
                  step={0.05}
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>7.0%</span>
                  <span>9.0% (Public Sector)</span>
                  <span>15.0%</span>
                </div>
              </div>

              {/* Course Duration & Moratorium Period */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                    Course Duration
                  </label>
                  <select
                    value={courseYears}
                    onChange={(e) => setCourseYears(Number(e.target.value))}
                    className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value={2}>2 Years (M.Tech / MBA)</option>
                    <option value={3}>3 Years (MCA / BCA)</option>
                    <option value={4}>4 Years (B.Tech Standard)</option>
                    <option value={5}>5 Years (Integrated M.Tech)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                    Moratorium Grace Period
                  </label>
                  <select
                    value={moratoriumMonths}
                    onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                    className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value={6}>6 Months post graduation</option>
                    <option value={12}>12 Months post graduation (Standard)</option>
                  </select>
                </div>
              </div>

              {/* Repayment Tenure */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Post-Moratorium Repayment Tenure
                  </label>
                  <span className="text-sm font-bold text-brand-700">{tenureYears} Years ({tenureYears * 12} Months)</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={15}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
                />
              </div>

              {/* Interest Servicing Option */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Service Interest During Moratorium?</h4>
                    <p className="text-[11px] text-slate-500">
                      Paying simple interest monthly prevents interest from capitalizing into your principal.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={serviceInterestMonthly}
                    onChange={(e) => setServiceInterestMonthly(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-2 border-brand-200 shadow-fintech-md">
            <CardHeader className="bg-brand-50/50 border-b border-brand-100">
              <div className="flex justify-between items-center">
                <Badge variant="verified">Calculated Results</Badge>
                <span className="text-xs text-slate-500">{calculation.totalMoratoriumMonths} Mo Moratorium</span>
              </div>
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Monthly Installment (EMI)
                </p>
                <p className="text-3xl font-extrabold text-brand-800 tracking-tight mt-1">
                  {formatCurrency(calculation.emi)}
                  <span className="text-xs font-normal text-slate-500 ml-1">/ month</span>
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-6 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Sanctioned Principal:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(principal)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Simple Interest in Moratorium:</span>
                <span className="font-semibold text-amber-700">
                  {formatCurrency(calculation.moratoriumInterest)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Principal at Repayment Start:</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(calculation.effectivePrincipal)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Total Amount Repaid:</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(calculation.totalOutflow)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Pro Tip for VIT Students</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Under the Central Sector Interest Subsidy (CSIS), students with family income $\le ₹4.5$L have their entire {formatCurrency(calculation.moratoriumInterest)} moratorium interest waived by the government.
                </p>
              </div>

              <div className="pt-2">
                <Link to="/documents">
                  <Button variant="outline" size="sm" className="w-full">
                    View Documents Required for this Loan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
