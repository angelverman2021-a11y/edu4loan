import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  UserCheck,
  Building2,
  Percent,
  Calculator,
  HelpCircle,
  FileCheck2,
  ArrowRight,
  Info,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const EligibilityPage: React.FC = () => {
  // Assessment inputs
  const [loanAmount, setLoanAmount] = useState<number>(1200000);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(85000);
  const [existingEmis, setExistingEmis] = useState<number>(15000);
  const [cibilScore, setCibilScore] = useState<string>('750_plus');
  const [degreeLevel, setDegreeLevel] = useState<string>('undergraduate');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  // Projected EMI (approx 9.15% for 10 yrs on requested loan)
  const monthlyRate = 9.15 / 12 / 100;
  const tenureMonths = 120;
  const projectedEmi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  // FOIR Calculation
  const totalObligations = existingEmis + projectedEmi;
  const foirPercent = Math.min(100, Math.round((totalObligations / Math.max(1, monthlyIncome)) * 100));

  // Statutory Margin Money
  let marginMoney = 0;
  if (loanAmount > 400000) {
    marginMoney = (loanAmount - 400000) * 0.05;
  }

  // Determine readiness assessment
  const isCibilStrong = cibilScore === '750_plus' || cibilScore === '700_749';
  const isFoirHealthy = foirPercent <= 50;

  let assessmentResult: {
    tier: string;
    variant: 'verified' | 'advisory' | 'error';
    summary: string;
    recommendations: string[];
  };

  if (isCibilStrong && isFoirHealthy) {
    assessmentResult = {
      tier: 'High Financial Readiness',
      variant: 'verified',
      summary:
        'Your co-borrower credit profile and debt-to-income metrics align favorably with standard Indian Banks Association (IBA) credit underwriting criteria.',
      recommendations: [
        'Maintain current debt levels; avoid taking new consumer loans or credit cards before sanction.',
        'Prepare 3 months salary slips and 2 years Form 16 / ITR to document income.',
        `Plan for ${formatCurrency(marginMoney)} in student/parent contribution (5% margin above ₹4L).`,
      ],
    };
  } else if (isCibilStrong && !isFoirHealthy) {
    assessmentResult = {
      tier: 'Moderate Readiness — High Obligation Ratio',
      variant: 'advisory',
      summary: `Fixed Obligation to Income Ratio (FOIR) is estimated at ${foirPercent}%, which exceeds the preferred 50% benchmark for nationalized banks.`,
      recommendations: [
        'Consider adding a joint co-borrower (e.g. both parents) to aggregate family income.',
        'Prepay or close smaller personal loans/credit card EMIs to reduce existing monthly obligations.',
        'Apply for longer tenure (e.g. 15 years) to reduce the projected monthly EMI commitment.',
      ],
    };
  } else {
    assessmentResult = {
      tier: 'Additional Credit Support Advised',
      variant: 'error',
      summary:
        'Co-borrower credit score is below 700, or debt obligations are elevated. Underwriters will scrutinize repayment capacity closely.',
      recommendations: [
        'Check CIBIL report for incorrect defaults or delayed payments and file dispute if erroneous.',
        'Add an earning co-applicant with CIBIL > 720 to strengthen the application profile.',
        'Under CGFSEL provisions, loans up to ₹7.5L cannot be rejected purely on lack of tangible security if academic merit is established.',
      ],
    };
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="info" size="sm">
            Phase 12 — Module 15
          </Badge>
          <span className="text-xs text-slate-500 font-medium">Educational Credit Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Education Loan Eligibility & Underwriting Explainer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
          Understand the exact criteria nationalized and private banks evaluate during credit
          appraisal — CIBIL thresholds, co-borrower FOIR benchmarks, course accreditation, and
          statutory margin money rules.
        </p>
      </div>

      {/* The 4 Pillars of Eligibility */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1 */}
        <Card className="border-slate-200 bg-white shadow-2xs">
          <CardContent className="p-4 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-brand-700 flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-xs">1. CIBIL & Credit History</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Banks require co-borrower CIBIL &ge; 700. Even with zero student credit history,
              parental repayment discipline directly impacts interest spreads and sanctions.
            </p>
          </CardContent>
        </Card>

        {/* Pillar 2 */}
        <Card className="border-slate-200 bg-white shadow-2xs">
          <CardContent className="p-4 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <UserCheck className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-xs">2. Co-Borrower FOIR</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Fixed Obligation to Income Ratio (FOIR) must typically stay below 50–60% of net monthly
              salary or business cashflow after factoring in the proposed new loan EMI.
            </p>
          </CardContent>
        </Card>

        {/* Pillar 3 */}
        <Card className="border-slate-200 bg-white shadow-2xs">
          <CardContent className="p-4 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-xs">3. Institutional Standing</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              VIT Bhopal qualifies under premier institution classifications (NIRF ranked),
              enabling preferential interest concessions and higher collateral-free thresholds.
            </p>
          </CardContent>
        </Card>

        {/* Pillar 4 */}
        <Card className="border-slate-200 bg-white shadow-2xs">
          <CardContent className="p-4 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Percent className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-xs">4. RBI Margin Money Norms</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Statutory 0% margin up to ₹4.0 Lakhs; strictly 5% for studies within India above ₹4.0
              Lakhs. Scholarships can be credited towards meeting margin obligations.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Self-Assessment Simulator */}
      <Card className="border-brand-200 bg-white shadow-xs overflow-hidden">
        <CardHeader className="py-4 border-b border-brand-100 bg-brand-50/20">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="h-4.5 w-4.5 text-brand-800" />
            Interactive Credit Underwriting & FOIR Self-Assessment Simulator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Expected Loan Amount (₹)
                  </label>
                  <input
                    type="number"
                    step={50000}
                    min={100000}
                    max={4000000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {formatCurrency(loanAmount)} (VIT Cat 1-5 Tuition + Hostel)
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Co-Borrower Monthly Net Income (₹)
                  </label>
                  <input
                    type="number"
                    step={5000}
                    min={20000}
                    max={500000}
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Net in-hand take-home salary or certified business drawings
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Existing Monthly Debt / EMIs (₹)
                  </label>
                  <input
                    type="number"
                    step={2000}
                    min={0}
                    max={200000}
                    value={existingEmis}
                    onChange={(e) => setExistingEmis(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Ongoing home, car, or personal loan EMIs
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Co-Borrower CIBIL Score Band
                  </label>
                  <select
                    value={cibilScore}
                    onChange={(e) => setCibilScore(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="750_plus">750+ (Excellent Credit)</option>
                    <option value="700_749">700 – 749 (Standard Preferred)</option>
                    <option value="650_699">650 – 699 (Scrutiny Expected)</option>
                    <option value="below_650">Below 650 (Adverse / High Risk)</option>
                  </select>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Minimum 700 required for premier tier schemes
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5 text-brand-700" />
                  What is FOIR?
                </span>
                <p>
                  Fixed Obligation to Income Ratio measures what percentage of monthly income is committed
                  to loan repayments. Nationalized banks insist that total monthly debt commitments
                  (existing loans + projected education loan EMI) should not exceed 50% to 60%.
                </p>
              </div>
            </div>

            {/* Results Output (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50/80 p-5 rounded-xl border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Readiness Category</span>
                  <Badge variant={assessmentResult.variant} size="sm">
                    {assessmentResult.tier}
                  </Badge>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Estimated Post-Study EMI:</span>
                    <strong className="text-slate-900">{formatCurrency(projectedEmi)} /mo</strong>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Estimated Total Monthly Debt:</span>
                    <strong className="text-slate-900">{formatCurrency(totalObligations)} /mo</strong>
                  </div>

                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100">
                    <span className="text-slate-700 font-bold">Estimated FOIR:</span>
                    <span
                      className={`font-black ${
                        foirPercent <= 50
                          ? 'text-emerald-700'
                          : foirPercent <= 65
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {foirPercent}% {foirPercent <= 50 ? '(Healthy)' : '(High)'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100">
                    <span className="text-slate-700 font-bold">Required Margin Money:</span>
                    <strong className="text-brand-800">{formatCurrency(marginMoney)}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {assessmentResult.summary}
                </p>

                <div className="space-y-1 text-[11px]">
                  <span className="font-bold text-slate-800 block">Guidance & Next Steps:</span>
                  <ul className="space-y-1">
                    {assessmentResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-slate-600">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <Link
                  to="/documents"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-brand-700 text-white font-bold text-xs hover:bg-brand-800 transition-colors shadow-2xs"
                >
                  <span>Build Co-Borrower Document Dossier</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimers & Statutory Compliance */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-700 block">Regulatory Compliance Notice</span>
          <p className="text-[11px] leading-relaxed">
            Edu4Loan provides objective analytical models based on Indian Banks Association (IBA)
            guidelines and Reserve Bank of India Master Directions. We do not provide credit scores,
            guarantee loan approvals, or act as an intermediary or direct selling agent (DSA). Actual
            credit limits, margin money concessions, and final sanction decisions remain under the
            exclusive authority of the lending financial institution.
          </p>
        </div>
      </div>
    </div>
  );
};
