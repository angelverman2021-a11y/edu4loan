import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calculator,
  Percent,
  Shield,
  Sparkles,
  PieChart as PieIcon,
  LineChart as AreaIcon,
  BarChart3 as BarIcon,
  RotateCcw,
  Sliders,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import {
  RepaymentDonutChart,
  AmortizationAreaChart,
  YearlyBreakdownBarChart,
  MoratoriumSavingsCard,
  PrepaymentSimulator,
  AmortizationTable,
  InterestRateExplainer,
  CollateralExplainer,
} from '@/components/calculator';
import { calculatorService } from '@/services/calculatorService';
import { CalculatorInputs } from '@/types';

export const CalculatorPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab: 'simulator' | 'interest' | 'collateral'
  const activeTab = searchParams.get('tab') || 'simulator';

  // Calculator Inputs
  const [principal, setPrincipal] = useState<number>(() => {
    const val = Number(searchParams.get('amount'));
    return val && !isNaN(val) && val >= 50000 ? val : 1200000;
  });

  const [baseRate, setBaseRate] = useState<number>(() => {
    const val = Number(searchParams.get('rate'));
    return val && !isNaN(val) && val >= 5 ? val : 9.15;
  });

  const [tenureYears, setTenureYears] = useState<number>(() => {
    const val = Number(searchParams.get('tenure'));
    return val && !isNaN(val) && val >= 1 ? val : 10;
  });

  const [courseYears, setCourseYears] = useState<number>(4);
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(12);
  const [serviceInterestMonthly, setServiceInterestMonthly] = useState<boolean>(false);

  // Concession Toggles
  const [hasGirlStudentConcession, setHasGirlStudentConcession] = useState<boolean>(false);
  const [hasPromptServicingConcession, setHasPromptServicingConcession] = useState<boolean>(false);

  // Active Chart View
  const [activeChartView, setActiveChartView] = useState<'donut' | 'area' | 'bar'>('donut');

  // Compute effective interest rate
  const effectiveAnnualRate = useMemo(() => {
    let rate = baseRate;
    if (hasGirlStudentConcession) rate -= 0.5;
    if (hasPromptServicingConcession && serviceInterestMonthly) rate -= 1.0;
    return Math.max(1.0, Math.round(rate * 100) / 100);
  }, [baseRate, hasGirlStudentConcession, hasPromptServicingConcession, serviceInterestMonthly]);

  // Synchronize Tab & Principal with URL params without reload
  const setTab = (tab: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    setSearchParams(newParams, { replace: true });
  };

  // Perform Local 60fps EMI calculation
  const calcInputs: CalculatorInputs = useMemo(
    () => ({
      loanAmount: principal,
      annualInterestRatePercent: effectiveAnnualRate,
      courseDurationYears: courseYears,
      moratoriumPostCourseMonths: moratoriumMonths,
      repaymentTenureYears: tenureYears,
      serviceInterestDuringMoratorium: serviceInterestMonthly,
    }),
    [principal, effectiveAnnualRate, courseYears, moratoriumMonths, tenureYears, serviceInterestMonthly]
  );

  const calcResult = useMemo(() => {
    return calculatorService.calculateEmiLocal(calcInputs);
  }, [calcInputs]);

  // Chart data series
  const donutData = useMemo(() => calculatorService.getDonutChartData(calcResult), [calcResult]);
  const areaData = useMemo(() => calculatorService.getAreaChartData(calcResult), [calcResult]);
  const barData = useMemo(() => calculatorService.getBarChartData(calcResult), [calcResult]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const resetDefaults = () => {
    setPrincipal(1200000);
    setBaseRate(9.15);
    setTenureYears(10);
    setCourseYears(4);
    setMoratoriumMonths(12);
    setServiceInterestMonthly(false);
    setHasGirlStudentConcession(false);
    setHasPromptServicingConcession(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">Modules 5, 6 & 7 Financial Engine</Badge>
          <VerifiedBadge status="verified" lastVerified="2026-09-01" size="sm" />
          <span className="text-xs text-slate-500 font-medium">RBI Model Scheme Compliant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Calculator className="h-9 w-9 text-brand-700 shrink-0" />
          <span>Interactive Education Loan & Repayment Hub</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Accurately simulate your repayment schedule taking into account 4 years of study, 1-year moratorium, simple interest servicing versus capitalization, prepayment acceleration, benchmark interest rates, and statutory collateral rules.
        </p>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-sm font-semibold">
        <button
          onClick={() => setTab('simulator')}
          className={`px-5 py-3 rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'simulator'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>EMI & Moratorium Simulator</span>
        </button>

        <button
          onClick={() => setTab('interest')}
          className={`px-5 py-3 rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'interest'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Percent className="h-4 w-4" />
          <span>Interest Rate Mechanics & Tax Relief (Module 5)</span>
        </button>

        <button
          onClick={() => setTab('collateral')}
          className={`px-5 py-3 rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'collateral'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Collateral & Security Rules (Module 7)</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="space-y-8">
          {/* 2-Column Calculator Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Controls & Inputs */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Loan & Study Parameters
                    </CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Adjust sliders or select presets to model your repayment
                    </p>
                  </div>
                  <button
                    onClick={resetDefaults}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-brand-700 font-medium transition-colors"
                    title="Reset to default VIT B.Tech values"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                </CardHeader>
                <CardContent className="space-y-6 pt-5">
                  {/* Preset Amount Chips */}
                  <div>
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
                      Popular VIT Loan Scenarios
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: '₹4L (Zero Collateral)', val: 400000 },
                        { label: '₹7.5L (CGFSEL Limit)', val: 750000 },
                        { label: '₹12L (VIT 4-Yr B.Tech)', val: 1200000 },
                        { label: '₹18L (Tuition + Hostel)', val: 1800000 },
                        { label: '₹25L (Extended)', val: 2500000 },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => setPrincipal(preset.val)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                            principal === preset.val
                              ? 'bg-brand-700 text-white shadow-sm ring-2 ring-brand-700 ring-offset-1'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Principal Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Total Loan Amount (Principal)
                      </label>
                      <span className="text-base font-extrabold text-brand-700">
                        {formatCurrency(principal)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={100000}
                      max={4000000}
                      step={25000}
                      value={principal}
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>₹1 Lakh</span>
                      <span>₹12 Lakhs (Typical)</span>
                      <span>₹40 Lakhs</span>
                    </div>
                  </div>

                  {/* Interest Rate Slider & Concessions */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <div>
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                          Base Annual Interest Rate (% p.a.)
                        </label>
                        {effectiveAnnualRate !== baseRate && (
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            Effective Rate with concessions: {effectiveAnnualRate.toFixed(2)}%
                          </span>
                        )}
                      </div>
                      <span className="text-base font-extrabold text-brand-700">
                        {baseRate.toFixed(2)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={7.0}
                      max={15.0}
                      step={0.05}
                      value={baseRate}
                      onChange={(e) => setBaseRate(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>7.0% (Premier Tier)</span>
                      <span>9.15% (Public Sector Standard)</span>
                      <span>15.0%</span>
                    </div>

                    {/* Concessions Section */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                      <span className="font-bold text-slate-700 block">
                        Eligible Concession Discounts
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-brand-400 transition-colors">
                          <input
                            type="checkbox"
                            checked={hasGirlStudentConcession}
                            onChange={(e) => setHasGirlStudentConcession(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              Girl Student Concession
                            </span>
                            <span className="text-[11px] text-emerald-700 font-medium">
                              -0.50% interest discount
                            </span>
                          </div>
                        </label>

                        <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-brand-400 transition-colors">
                          <input
                            type="checkbox"
                            checked={hasPromptServicingConcession}
                            onChange={(e) => setHasPromptServicingConcession(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              Prompt Servicing Rebate
                            </span>
                            <span className="text-[11px] text-emerald-700 font-medium">
                              -1.00% during moratorium
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Course Duration & Moratorium Period */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                        Degree Duration
                      </label>
                      <select
                        value={courseYears}
                        onChange={(e) => setCourseYears(Number(e.target.value))}
                        className="w-full p-2.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      >
                        <option value={2}>2 Years (M.Tech / MBA)</option>
                        <option value={3}>3 Years (MCA / BCA)</option>
                        <option value={4}>4 Years (B.Tech Standard)</option>
                        <option value={5}>5 Years (Integrated M.Tech / Dual)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                        Moratorium Grace Period
                      </label>
                      <select
                        value={moratoriumMonths}
                        onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                        className="w-full p-2.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      >
                        <option value={6}>6 Months post graduation</option>
                        <option value={12}>12 Months post graduation (Standard)</option>
                        <option value={18}>18 Months (Maximum statutory buffer)</option>
                      </select>
                    </div>
                  </div>

                  {/* Repayment Tenure Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Repayment Tenure (Post Moratorium)
                      </label>
                      <span className="text-base font-extrabold text-brand-700">
                        {tenureYears} Years ({tenureYears * 12} Months)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={15}
                      step={1}
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>5 Years (Lower Total Interest)</span>
                      <span>10 Years (Balanced)</span>
                      <span>15 Years (Lowest Monthly EMI)</span>
                    </div>
                  </div>

                  {/* Simple Interest Servicing Option Switch */}
                  <div
                    onClick={() => setServiceInterestMonthly(!serviceInterestMonthly)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      serviceInterestMonthly
                        ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          Service Simple Interest Monthly During Study?
                        </span>
                        {serviceInterestMonthly && (
                          <Badge variant="verified" size="sm">
                            Active (Capitalization Prevented)
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        If checked, you pay only simple interest (~
                        {formatCurrency(
                          Math.round((principal * (effectiveAnnualRate / 100)) / 12)
                        )}
                        /mo) while studying. This prevents ₹
                        {formatCurrency(calcResult.moratoriumInterestAccrued).replace('₹', '')} from
                        compounding into your principal!
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={serviceInterestMonthly}
                      onChange={() => {}} // handled by wrapper div click
                      className="h-5 w-5 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 pointer-events-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Calculated Results & Primary KPI Cards */}
            <div className="lg:col-span-5 space-y-6">
              {/* Primary EMI Card */}
              <Card className="border-2 border-brand-200 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-brand-900 to-brand-800 text-white p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-200">
                      Calculated Monthly Outflow
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-700 text-brand-100 font-medium">
                      {calcResult.totalMoratoriumMonths} Mo Moratorium
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-brand-200 font-medium">Post-Moratorium EMI</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-extrabold text-white tracking-tight">
                        {formatCurrency(calcResult.monthlyEMI)}
                      </span>
                      <span className="text-sm font-medium text-brand-200">/ month</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-brand-700/60 flex items-center justify-between text-xs text-brand-100">
                    <span>Effective Rate: <strong>{effectiveAnnualRate.toFixed(2)}% p.a.</strong></span>
                    <span>Tenure: <strong>{tenureYears} Years ({tenureYears * 12} EMIs)</strong></span>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4 text-xs">
                  <div className="space-y-2.5">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-600">Principal Borrowed:</span>
                      <span className="font-bold text-slate-900">{formatCurrency(principal)}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <div>
                        <span className="text-slate-600 block">Accrued Moratorium Interest:</span>
                        <span className="text-[10px] text-slate-400">
                          {serviceInterestMonthly ? 'Serviced monthly' : 'Capitalized into loan'}
                        </span>
                      </div>
                      <span className="font-bold text-amber-600">
                        {formatCurrency(calcResult.moratoriumInterestAccrued)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-600">Principal at Repayment Start:</span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(calcResult.principalAtRepaymentStart)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-600">Total Repayment Interest:</span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(calcResult.totalRepaymentInterest)}
                      </span>
                    </div>

                    <div className="flex justify-between py-2 border-t-2 border-slate-200 text-sm">
                      <span className="font-bold text-slate-900">Total Lifetime Outflow:</span>
                      <span className="font-extrabold text-brand-800">
                        {formatCurrency(calcResult.totalAmountPaid)}
                      </span>
                    </div>
                  </div>

                  {/* Section 80E Tax Relief Quick Note */}
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-900 flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Section 80E Tax Relief:</strong> 100% of the interest paid (₹
                      {formatCurrency(calcResult.totalRepaymentInterest).replace('₹', '')}) is eligible for deduction from taxable income for 8 consecutive financial years with NO upper cap.
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Moratorium Savings Callout Card */}
              <MoratoriumSavingsCard
                savingsAmount={calcResult.savingsByServicingInterestDuringStudy}
                moratoriumInterest={calcResult.moratoriumInterestAccrued}
                isServicing={serviceInterestMonthly}
                onToggleServicing={() => setServiceInterestMonthly(!serviceInterestMonthly)}
              />
            </div>
          </div>

          {/* VISUAL ANALYTICS & CHARTS SECTION */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Visual Repayment Analytics
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Interactive Recharts visualizations of loan structure and amortization
                  </p>
                </div>

                {/* Chart Type Selector */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setActiveChartView('donut')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                      activeChartView === 'donut'
                        ? 'bg-white text-brand-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <PieIcon className="h-3.5 w-3.5" />
                    <span>Breakdown Donut</span>
                  </button>

                  <button
                    onClick={() => setActiveChartView('area')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                      activeChartView === 'area'
                        ? 'bg-white text-brand-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <AreaIcon className="h-3.5 w-3.5" />
                    <span>Balance Trajectory</span>
                  </button>

                  <button
                    onClick={() => setActiveChartView('bar')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                      activeChartView === 'bar'
                        ? 'bg-white text-brand-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BarIcon className="h-3.5 w-3.5" />
                    <span>Yearly Split</span>
                  </button>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {activeChartView === 'donut' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7">
                      <RepaymentDonutChart data={donutData} totalAmount={calcResult.totalAmountPaid} />
                    </div>
                    <div className="md:col-span-5 space-y-3 text-xs">
                      <h4 className="text-sm font-bold text-slate-900">Total Outflow Distribution</h4>
                      <p className="text-slate-600 leading-relaxed">
                        For a principal of <strong>{formatCurrency(principal)}</strong>, your total repayment over the {tenureYears}-year horizon amounts to{' '}
                        <strong>{formatCurrency(calcResult.totalAmountPaid)}</strong>.
                      </p>
                      <div className="space-y-2 pt-2">
                        {donutData.map((d, i) => (
                          <div key={i} className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100">
                            <span className="font-medium text-slate-700 flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                              {d.name}
                            </span>
                            <span className="font-bold text-slate-900">{formatCurrency(d.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeChartView === 'area' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <h4 className="text-sm font-bold text-slate-900">
                        Loan Balance Trajectory Over {courseYears + 1 + tenureYears} Total Years
                      </h4>
                      <span className="text-slate-500 font-medium">Study &rarr; Moratorium &rarr; ₹0 Debt</span>
                    </div>
                    <AmortizationAreaChart data={areaData} />
                  </div>
                )}

                {activeChartView === 'bar' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <h4 className="text-sm font-bold text-slate-900">
                        Yearly Principal vs Interest Split
                      </h4>
                      <span className="text-slate-500 font-medium">
                        Initial years are interest-heavy; later years amortize principal faster
                      </span>
                    </div>
                    <YearlyBreakdownBarChart data={barData} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Prepayment Simulator Card */}
            <PrepaymentSimulator baseResult={calcResult} />

            {/* Full Amortization Table */}
            <AmortizationTable result={calcResult} />
          </div>
        </div>
      )}

      {/* TAB 2: INTEREST RATE EXPLAINER (Module 5) */}
      {activeTab === 'interest' && (
        <InterestRateExplainer />
      )}

      {/* TAB 3: COLLATERAL EXPLAINER (Module 7) */}
      {activeTab === 'collateral' && (
        <CollateralExplainer
          currentLoanAmount={principal}
          onSelectAmount={(amt) => setPrincipal(amt)}
        />
      )}
    </div>
  );
};
