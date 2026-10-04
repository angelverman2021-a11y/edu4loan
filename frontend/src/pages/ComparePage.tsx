import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Columns3,
  X,
  Plus,
  ExternalLink,
  ShieldCheck,
  Building2,
  FileText,
  Clock,
  LayoutGrid,
  Table,
} from 'lucide-react';
import { loanSchemeService } from '@/services/loanSchemeService';
import { ComparisonResult, ComparisonSchemeData } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { DifferenceBadge } from '@/components/loans/DifferenceBadge';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Skeleton';
import { useComparison } from '@/context/ComparisonContext';

export const ComparePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedSchemes, removeScheme } = useComparison();

  const [comparisonData, setComparisonData] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightDiffs, setHighlightDiffs] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Extract scheme IDs from URL parameter or fallback to Context
  const idsParam = searchParams.get('ids');
  const schemeIds = idsParam
    ? idsParam.split(',').map((id) => id.trim()).filter(Boolean)
    : selectedSchemes.map((s) => s.id);

  useEffect(() => {
    if (idsParam !== schemeIds.join(',') && schemeIds.length > 0) {
      setSearchParams({ ids: schemeIds.join(',') }, { replace: true });
    }
  }, [schemeIds, idsParam, setSearchParams]);

  useEffect(() => {
    const fetchComparison = async () => {
      if (schemeIds.length < 2) {
        setComparisonData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await loanSchemeService.compareLoanSchemes(schemeIds.slice(0, 4));
        setComparisonData(data);
      } catch (err: any) {
        setError(err.message || 'Unable to load comparison data.');
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [idsParam]);

  const handleRemoveScheme = (id: string) => {
    removeScheme(id);
    const remaining = schemeIds.filter((item) => item !== id);
    if (remaining.length > 0) {
      setSearchParams({ ids: remaining.join(',') });
    } else {
      setSearchParams({});
    }
  };

  const formatCurrency = (val?: number) => {
    if (!val) return 'Need-based';
    if (val >= 10000000) {
      return `Rs ${(val / 10000000).toFixed(2)} Cr`;
    }
    return `Rs ${(val / 100000).toFixed(1)} Lakhs`;
  };

  const isDifferent = (values: any[]) => {
    if (!values || values.length <= 1) return false;
    const first = JSON.stringify(values[0]);
    return values.some((v) => JSON.stringify(v) !== first);
  };

  // Empty state if <2 schemes are selected
  if (schemeIds.length < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="h-16 w-16 rounded-2xl bg-blue-50 text-brand-700 flex items-center justify-center mx-auto">
          <Columns3 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Side-by-Side Scheme Comparison</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Please select at least 2 schemes (up to a maximum of 4) to view an objective side-by-side comparison of interest structures, collateral tiers, and documented conditions.
          </p>
        </div>

        {selectedSchemes.length === 1 && (
          <div className="inline-flex items-center gap-2 p-3 rounded-lg bg-blue-50/80 border border-blue-200 text-xs text-brand-900">
            <span>Currently selected: <strong>{selectedSchemes[0].schemeName}</strong>. Select 1 more scheme to compare.</span>
          </div>
        )}

        <div>
          <Link to="/loans">
            <Button variant="primary" size="md">
              Browse & Select Schemes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const schemesList = comparisonData?.schemes || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="verified">100% Neutral Matrix</Badge>
            <Badge variant="neutral">Strictly Non-Ranked</Badge>
            <Badge variant="neutral">20+ Parameters</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Columns3 className="h-8 w-8 text-brand-700 shrink-0" />
            <span>Comprehensive Scheme Comparison</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Strictly factual parameter comparison between {schemesList.length} documented bank schemes. Sanction, processing fee waivers, and rate margins are subject to formal bank evaluation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile/Desktop View Mode Switch */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-brand-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-brand-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards</span>
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={highlightDiffs}
              onChange={(e) => setHighlightDiffs(e.target.checked)}
              className="rounded text-brand-700 focus:ring-brand-600"
            />
            <span>Highlight Differences</span>
          </label>

          <Link to="/loans">
            <Button variant="outline" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
              Add More
            </Button>
          </Link>
        </div>
      </div>

      {/* Persistent Impartiality Disclosure */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start sm:items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-brand-700 shrink-0 mt-0.5 sm:mt-0" />
        <span className="leading-relaxed">
          <strong>Strict Impartiality Rule:</strong> Edu4Loan presents values as documented in official regulatory circulars. We do not score, rank, declare any scheme as &ldquo;best&rdquo;, or accept sponsorship for placement.
        </span>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {/* Error state */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* TABLE VIEW (Optimal for Desktop) */}
      {!loading && !error && comparisonData && viewMode === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-fintech">
          <table className="w-full text-left border-collapse text-xs">
            {/* Header: Bank & Scheme Names */}
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 divide-x divide-slate-100">
                <th className="p-4 w-64 font-bold text-slate-500 uppercase text-[11px] align-top bg-slate-50">
                  Parameter (20+ Verified Metrics)
                </th>
                {schemesList.map((scheme) => (
                  <th key={scheme.id} className="p-4 min-w-[260px] max-w-[300px] align-top space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        {scheme.bank.category} Bank
                      </span>
                      <button
                        onClick={() => handleRemoveScheme(scheme.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Remove scheme from comparison"
                        aria-label={`Remove ${scheme.schemeName}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-brand-800 block">
                        {scheme.bank.name}
                      </span>
                      <span className="text-sm font-bold text-slate-900 block leading-tight mt-0.5">
                        {scheme.schemeName}
                      </span>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <VerifiedBadge
                        status={scheme.verification.status}
                        lastVerified={scheme.verification.lastVerified}
                        size="sm"
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* SECTION A: INTEREST RATE & PRICING STRUCTURE */}
              <tr className="bg-blue-50/40">
                <td
                  colSpan={schemesList.length + 1}
                  className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-brand-900 border-t border-slate-200"
                >
                  Section 1: Interest Rate & Pricing Structure
                </td>
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Documented Interest Rate</span>
                    {highlightDiffs && (
                      <DifferenceBadge
                        status={isDifferent(schemesList.map((s) => s.interestRate.minRate.value)) ? 'different' : 'same'}
                      />
                    )}
                  </div>
                </td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5">
                    <span className="font-extrabold text-sm text-brand-900 block">
                      {s.interestRate.minRate.value}% – {s.interestRate.maxRate.value}%
                    </span>
                    <span className="text-[10px] text-slate-400">Annual percentage</span>
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Rate Structure Type</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-800 font-medium">
                    {(s as any).rateType || 'Floating (Benchmark Linked)'}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">External Benchmark Reference</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-800 font-medium">
                    {s.interestRate.benchmarkType} (Repo Base: {s.interestRate.benchmarkRatePercent}%)
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Documented Spread Range</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700">
                    +{s.interestRate.spreadPercentMin}% to +{s.interestRate.spreadPercentMax}% over benchmark
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Girl Student Concession</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-emerald-800 font-medium">
                    {s.interestRate.girlChildConcessionPercent?.value
                      ? `${s.interestRate.girlChildConcessionPercent.value}% interest rebate`
                      : 'Not documented'}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Prompt Servicing Concession</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700">
                    {s.interestRate.promptServicingConcessionPercent?.value
                      ? `${s.interestRate.promptServicingConcessionPercent.value}% during moratorium`
                      : 'Not documented in circular'}
                  </td>
                ))}
              </tr>

              {/* SECTION B: QUANTUM & MARGIN MONEY */}
              <tr className="bg-blue-50/40">
                <td
                  colSpan={schemesList.length + 1}
                  className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-brand-900 border-t border-slate-200"
                >
                  Section 2: Quantum, Limits & Margin Money
                </td>
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Max Inland Limit</span>
                    {highlightDiffs && (
                      <DifferenceBadge
                        status={isDifferent(schemesList.map((s) => s.loanAmount.inlandMax.value)) ? 'different' : 'same'}
                      />
                    )}
                  </div>
                </td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 font-bold text-slate-900">
                    {formatCurrency(s.loanAmount.inlandMax.value)}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Margin Money (Up to Rs 4 Lakhs)</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700 font-medium">
                    {s.marginMoney.upTo4LakhsPercent === 0 ? 'Nil (0%)' : `${s.marginMoney.upTo4LakhsPercent}%`}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Margin Money (Above Rs 4 Lakhs)</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700 font-medium">
                    {s.marginMoney.above4LakhsIndiaPercent}% of eligible course cost
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Scholarship Margin Adjustment</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700">
                    {s.marginMoney.scholarshipAdjustmentAllowed
                      ? 'Allowed (Scholarship can count towards margin money)'
                      : 'Subject to branch discretion'}
                  </td>
                ))}
              </tr>

              {/* SECTION C: COLLATERAL, SECURITY & GUARANTEES */}
              <tr className="bg-blue-50/40">
                <td
                  colSpan={schemesList.length + 1}
                  className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-brand-900 border-t border-slate-200"
                >
                  Section 3: Collateral, Security & Guarantees
                </td>
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Up to Rs 4.0 Lakhs</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-600">
                    {s.collateral.upTo4Lakhs}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Rs 4.0L to Rs 7.5 Lakhs</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-600">
                    {s.collateral.from4To7point5Lakhs}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Above Rs 7.5 Lakhs</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-600">
                    {s.collateral.above7point5Lakhs}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Third-Party Guarantee Requirement</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700">
                    {s.requirements?.guarantee || 'Not mandated for loans covered under credit guarantee / clean limits'}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Co-Applicant Mandate</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700 font-medium">
                    {s.requirements?.coApplicant || 'Parent / Legal Guardian mandatory co-borrower'}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Insurance Requirement</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700">
                    {s.requirements?.insurance || 'Optional life coverage recommended by circular'}
                  </td>
                ))}
              </tr>

              {/* SECTION D: REPAYMENT & MORATORIUM */}
              <tr className="bg-blue-50/40">
                <td
                  colSpan={schemesList.length + 1}
                  className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-brand-900 border-t border-slate-200"
                >
                  Section 4: Moratorium & Repayment Tenures
                </td>
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Moratorium Grace Window</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700 font-medium">
                    Course Duration + {s.moratorium.moratoriumBufferMonths} Months
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Max Repayment Tenure</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700 font-medium">
                    Up to {s.moratorium.repaymentTenureMaxYears} Years post-moratorium
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Interest Accrual During Study</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-600">
                    {s.moratorium.explanation}
                  </td>
                ))}
              </tr>

              {/* SECTION E: FEES, CHARGES & TAX */}
              <tr className="bg-blue-50/40">
                <td
                  colSpan={schemesList.length + 1}
                  className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-brand-900 border-t border-slate-200"
                >
                  Section 5: Fees, Penalties & Tax Relief
                </td>
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Processing Fee</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-800 font-medium">
                    {s.feesAndCharges.processingFee.value}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Prepayment / Foreclosure Penalty</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-800 font-medium">
                    {s.feesAndCharges.prepaymentPenalty.value}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Section 80E Tax Deduction</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-emerald-800 font-medium">
                    {s.taxBenefit.section80EApplicable
                      ? 'Applicable (Full interest deduction for up to 8 years)'
                      : 'Subject to eligibility'}
                  </td>
                ))}
              </tr>

              {/* SECTION F: PROCESS, TIMELINES & DOCUMENTATION */}
              <tr className="bg-blue-50/40">
                <td
                  colSpan={schemesList.length + 1}
                  className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-brand-900 border-t border-slate-200"
                >
                  Section 6: Process, Timelines & Documentation
                </td>
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Published Processing Window</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{s.requirements?.publishedProcessingTime || 'No statutory SLA announced in circular'}</span>
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Eligible Expense Coverage</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-600">
                    {s.requirements?.eligibleExpenses && s.requirements.eligibleExpenses.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {s.requirements.eligibleExpenses.slice(0, 3).map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                        {s.requirements.eligibleExpenses.length > 3 && (
                          <li className="text-[10px] text-slate-400">+{s.requirements.eligibleExpenses.length - 3} additional expense items</li>
                        )}
                      </ul>
                    ) : (
                      'College tuition, hostel fees, books, exam fees'
                    )}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Application Channels</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700">
                    {s.requirements?.applicationProcess && s.requirements.applicationProcess.length > 0 ? (
                      <ol className="list-decimal pl-4 space-y-1">
                        {s.requirements.applicationProcess.slice(0, 3).map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    ) : (
                      'Vidya Lakshmi Portal, Bank Net Banking, or Nearest Branch'
                    )}
                  </td>
                ))}
              </tr>

              {/* SECTION G: OFFICIAL PRIMARY SOURCES & ACTIONS */}
              <tr className="bg-blue-50/40">
                <td
                  colSpan={schemesList.length + 1}
                  className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-brand-900 border-t border-slate-200"
                >
                  Section 7: Primary Sources & Official Actions
                </td>
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Official Circular & Portal</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 space-y-2">
                    {s.officialPortals?.circularUrl ? (
                      <a
                        href={s.officialPortals.circularUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-brand-800 text-xs font-semibold hover:bg-blue-100 border border-blue-200 transition-colors w-full justify-center"
                      >
                        <span>View Official Source</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-slate-400 block text-center">Available on bank portal</span>
                    )}

                    <div>
                      <Link to={`/loans/${s.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Full Scheme Breakdown
                        </Button>
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* CARDS VIEW (Responsive & Mobile-Friendly) */}
      {!loading && !error && comparisonData && viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemesList.map((scheme) => (
            <Card key={scheme.id} className="border-slate-200 shadow-sm flex flex-col justify-between">
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {scheme.bank.category} Bank
                  </span>
                  <button
                    onClick={() => handleRemoveScheme(scheme.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                    title="Remove scheme from comparison"
                    aria-label={`Remove ${scheme.schemeName}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <CardTitle className="text-base font-bold text-slate-900 mt-1">
                  {scheme.bank.name}
                </CardTitle>
                <p className="text-sm font-semibold text-brand-800">{scheme.schemeName}</p>
                <div className="pt-2">
                  <VerifiedBadge
                    status={scheme.verification.status}
                    lastVerified={scheme.verification.lastVerified}
                    size="sm"
                  />
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4 text-xs divide-y divide-slate-100">
                {/* Interest Rate */}
                <div className="pt-2 space-y-1">
                  <span className="text-slate-500 font-medium block">Interest Rate Range:</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-extrabold text-brand-900">
                      {scheme.interestRate.minRate.value}% – {scheme.interestRate.maxRate.value}%
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {scheme.interestRate.benchmarkType} linked
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Spread: +{scheme.interestRate.spreadPercentMin}% to +{scheme.interestRate.spreadPercentMax}% over repo ({scheme.interestRate.benchmarkRatePercent}%)
                  </p>
                </div>

                {/* Quantum & Margin */}
                <div className="pt-3 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Max Inland Limit:</span>
                    <span className="font-bold text-slate-900">{formatCurrency(scheme.loanAmount.inlandMax.value)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Margin (&le; Rs 4L):</span>
                    <span className="font-semibold text-slate-800">
                      {scheme.marginMoney.upTo4LakhsPercent === 0 ? 'Nil' : `${scheme.marginMoney.upTo4LakhsPercent}%`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Margin (&gt; Rs 4L):</span>
                    <span className="font-semibold text-slate-800">{scheme.marginMoney.above4LakhsIndiaPercent}%</span>
                  </div>
                </div>

                {/* Collateral Tiers */}
                <div className="pt-3 space-y-1">
                  <span className="text-slate-500 font-medium block">Collateral Framework:</span>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">&le; Rs 4L:</span>
                      <span className="text-slate-800 font-medium">{scheme.collateral.upTo4Lakhs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Rs 4L - 7.5L:</span>
                      <span className="text-slate-800 font-medium">{scheme.collateral.from4To7point5Lakhs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">&gt; Rs 7.5L:</span>
                      <span className="text-slate-800 font-medium">{scheme.collateral.above7point5Lakhs}</span>
                    </div>
                  </div>
                </div>

                {/* Moratorium & Tenure */}
                <div className="pt-3 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Moratorium:</span>
                    <span className="font-medium text-slate-800">Course + {scheme.moratorium.moratoriumBufferMonths} Mos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Max Tenure:</span>
                    <span className="font-medium text-slate-800">Up to {scheme.moratorium.repaymentTenureMaxYears} Years</span>
                  </div>
                </div>

                {/* Requirements & Fees */}
                <div className="pt-3 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Processing Fee:</span>
                    <span className="font-medium text-slate-800">{scheme.feesAndCharges.processingFee.value}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Prepayment Penalty:</span>
                    <span className="font-medium text-slate-800">{scheme.feesAndCharges.prepaymentPenalty.value}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Co-Applicant:</span>
                    <span className="font-medium text-slate-800">{scheme.requirements?.coApplicant || 'Parent / Legal Guardian'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Turnaround / SLA:</span>
                    <span className="font-medium text-slate-800">{scheme.requirements?.publishedProcessingTime || 'Not announced'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 space-y-2">
                  {scheme.officialPortals?.circularUrl && (
                    <a
                      href={scheme.officialPortals.circularUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-blue-50 text-brand-800 font-semibold border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <span>View Official Source</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <Link to={`/loans/${scheme.id}`} className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      Full Scheme Breakdown
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
