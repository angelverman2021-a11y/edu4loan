import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Building2,
  Calculator,
  FileCheck2,
  ShieldCheck,
  ArrowRight,
  Landmark,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

export const HomePage: React.FC = () => {
  // Quick Calculator Preview State
  const [loanAmount, setLoanAmount] = useState<number>(1200000); // 12 Lakhs
  const [interestRate, setInterestRate] = useState<number>(9.5); // 9.5%
  const [tenureYears, setTenureYears] = useState<number>(10); // 10 years

  // Simple EMI Calculation for preview
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi =
    monthlyRate === 0
      ? loanAmount / totalMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto snap-y snap-mandatory scroll-smooth">
      {/* 1. HERO SECTION: Royal Blue Background with restrained gradient */}
      <section className="relative min-h-[calc(100vh-4rem)] snap-start flex flex-col justify-center overflow-hidden bg-gradient-to-b from-vit-navy via-vit-royal to-vit-blue text-white py-16 sm:py-24">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-sm font-medium text-blue-100">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              <span>Impartial & Non-Brokerage Guidance • For VIT Bhopal Students</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Navigate Your Education Loan With Verified Financial Clarity.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
              Compare actual public and private bank schemes, verify RBI collateral limits, estimate moratorium interest, and review VIT Bhopal fee structures before walking into any branch.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link to="/finder">
                <Button
                  size="lg"
                  className="bg-white text-vit-navy hover:bg-slate-100 active:bg-slate-200 font-semibold shadow-md"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Launch Loan Finder
                </Button>
              </Link>
              <Link to="/banks">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 active:bg-white/20"
                >
                  Compare All Banks
                </Button>
              </Link>
              <Link to="/calculator">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-blue-200 hover:text-white hover:bg-white/10"
                >
                  EMI Simulator
                </Button>
              </Link>
            </div>

            {/* Trust Metrics Strip */}
            <div className="pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-blue-100">100% Neutral Comparison</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-300" />
                <span className="text-blue-100">Primary Source Citations</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <div className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="text-blue-100">Tailored to VIT Bhopal Tiers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK EMI PREVIEW & COMPARISON TOOL (Interactive Section) */}
      <section className="min-h-[calc(100vh-4rem)] snap-start flex flex-col justify-center fintech-section-subtle py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Sliders & Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <Badge variant="info" className="mb-2">Quick Decision Tool</Badge>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Instant Loan Repayment Snapshot
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Adjust the parameters below to see estimated monthly installments and interest commitments.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-fintech space-y-5">
                {/* Loan Amount Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Loan Amount Required
                    </label>
                    <span className="text-base font-bold text-brand-700">
                      {formatCurrency(loanAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={200000}
                    max={4000000}
                    step={50000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹2 Lakhs (Subsidized)</span>
                    <span>₹15L (VIT Cat 3-5)</span>
                    <span>₹40 Lakhs (Max)</span>
                  </div>
                </div>

                {/* Interest Rate Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Estimated Interest Rate (p.a.)
                    </label>
                    <span className="text-base font-bold text-brand-700">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={7.5}
                    max={14.0}
                    step={0.1}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>7.5% (Concessional/Repo)</span>
                    <span>9.5% (Typical Public Bank)</span>
                    <span>14.0% (NBFC/Unsecured)</span>
                  </div>
                </div>

                {/* Repayment Tenure */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Repayment Tenure (Post-Moratorium)
                    </label>
                    <span className="text-base font-bold text-brand-700">{tenureYears} Years ({totalMonths} Months)</span>
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
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>5 Years</span>
                    <span>10 Years</span>
                    <span>15 Years (RBI Cap)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Financial Results Summary Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border-2 border-brand-100 shadow-fintech-md p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Badge variant="outline" className="text-slate-400 border-slate-200">Estimated Data</Badge>
                </div>

                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Estimated Repayment
                </h3>
                <div className="text-3xl font-extrabold text-brand-800 tracking-tight">
                  {formatCurrency(emi)}
                  <span className="text-sm font-normal text-slate-500 ml-1">/ month</span>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 space-y-3 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Principal Borrowed:</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Total Interest Payable:</span>
                    <span className="font-semibold text-amber-700">{formatCurrency(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-slate-100 pt-2 font-medium">
                    <span className="text-slate-700">Total Outflow (Principal + Interest):</span>
                    <span className="font-bold text-slate-900">{formatCurrency(totalPayment)}</span>
                  </div>
                </div>

                {/* Advisory Tip */}
                <div className="mt-6 p-3.5 rounded-lg bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 flex items-start gap-2">
                  <Info className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Moratorium Note:</strong> During your 4-year B.Tech + 1-year grace period, simple interest accrues. Servicing interest monthly can save up to ₹1.5L–₹3L in capitalized interest.
                  </p>
                </div>

                <div className="mt-5">
                  <Link to="/calculator">
                    <Button variant="primary" className="w-full">
                      Open Full Moratorium Simulator
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VERIFIED BANK SCHEMES HIGHLIGHT */}
      <section className="min-h-[calc(100vh-4rem)] snap-start flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="verified" dot className="mb-2">Official Bank Schemes</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Prominent Education Loan Programs
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Factual, verified terms from public sector banks that actively serve VIT Bhopal students.
            </p>
          </div>
          <Link to="/banks">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              View All 12+ Schemes
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SBI Scholar Scheme */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="info">State Bank of India</Badge>
              </div>
              <CardTitle className="text-base mt-2">SBI Scholar Scheme</CardTitle>
              <p className="text-sm text-slate-500">For premier institutions & List B institutes</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Interest Rate:</span>
                <span className="font-semibold text-slate-900">8.15% – 8.85% p.a.</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Max Loan Amount:</span>
                <span className="font-semibold text-slate-900">Up to ₹20,00,000</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Collateral Requirement:</span>
                <span className="font-semibold text-emerald-700">Nil (100% unsecured)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Processing Fee:</span>
                <span className="font-semibold text-slate-900">Nil for domestic studies</span>
              </div>
            </CardContent>
            <div className="px-6 pb-5 pt-0">
              <Link to="/banks?scheme=sbi-scholar" className="w-full block">
                <Button variant="outline" size="sm" className="w-full">
                  Detailed Scheme Breakdown
                </Button>
              </Link>
            </div>
          </Card>

          {/* Canara Vidya Turan */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="info">Canara Bank</Badge>
              </div>
              <CardTitle className="text-base mt-2">Canara Vidya Turan</CardTitle>
              <p className="text-sm text-slate-500">Special scheme for accredited technical universities</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Interest Rate:</span>
                <span className="font-semibold text-slate-900">8.60% – 9.25% p.a.</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Max Loan Amount:</span>
                <span className="font-semibold text-slate-900">Up to ₹30,00,000</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Collateral Requirement:</span>
                <span className="font-semibold text-slate-900">Nil up to ₹7.5 Lakhs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nodal For:</span>
                <span className="font-semibold text-brand-700">CSIS Subsidy Portal</span>
              </div>
            </CardContent>
            <div className="px-6 pb-5 pt-0">
              <Link to="/banks?scheme=canara-vidya-turan" className="w-full block">
                <Button variant="outline" size="sm" className="w-full">
                  Detailed Scheme Breakdown
                </Button>
              </Link>
            </div>
          </Card>

          {/* PNB Saraswati */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="info">Punjab National Bank</Badge>
              </div>
              <CardTitle className="text-base mt-2">PNB Saraswati</CardTitle>
              <p className="text-sm text-slate-500">General higher education scheme for engineering</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Interest Rate:</span>
                <span className="font-semibold text-slate-900">8.80% – 9.80% p.a.</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Max Loan Amount:</span>
                <span className="font-semibold text-slate-900">Need-based</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Girls Concession:</span>
                <span className="font-semibold text-emerald-700">0.50% interest discount</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Margin:</span>
                <span className="font-semibold text-slate-900">5% above ₹4 Lakhs</span>
              </div>
            </CardContent>
            <div className="px-6 pb-5 pt-0">
              <Link to="/banks?scheme=pnb-saraswati" className="w-full block">
                <Button variant="outline" size="sm" className="w-full">
                  Detailed Scheme Breakdown
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. GOVERNMENT INITIATIVES & SUBSIDIES BANNER */}
      <section className="min-h-[calc(100vh-4rem)] snap-start flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-navy-900 to-vit-navy p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-semibold text-amber-300 border border-white/20">
              <Landmark className="h-3.5 w-3.5" />
              <span>Central Government Subsidies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Are You Eligible For Full Interest Subsidy Or PM-Vidyalaxmi?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Students from families with gross annual income up to ₹4.5 Lakhs qualify for 100% interest waiver during moratorium under <strong>CSIS</strong>. Additionally, the new <strong>PM-Vidyalaxmi Scheme</strong> covers loans up to ₹10 Lakhs with 3% subvention for income up to ₹8 Lakhs.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link to="/schemes">
                <Button
                  size="md"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-medium"
                >
                  Explore Subsidy Criteria
                </Button>
              </Link>
              <a
                href="https://pmvidyalaxmi.education.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-slate-200 hover:text-white inline-flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span>PM-Vidyalaxmi Portal</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
