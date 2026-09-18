import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Columns3,
  ArrowLeft,
  X,
  Plus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  Filter,
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
  const navigate = useNavigate();
  const { selectedSchemes, removeScheme, clearComparison } = useComparison();

  const [comparisonData, setComparisonData] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightDiffs, setHighlightDiffs] = useState<boolean>(false);

  // Extract scheme IDs from URL parameter or fallback to Context
  const idsParam = searchParams.get('ids');
  const schemeIds = idsParam
    ? idsParam.split(',').map((id) => id.trim()).filter(Boolean)
    : selectedSchemes.map((s) => s.id);

  useEffect(() => {
    // Keep URL in sync with IDs
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
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)} L`;
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
            Please select at least 2 schemes (up to a maximum of 4) to view a factual side-by-side comparison of interest structures, collateral tiers, and moratorium terms.
          </p>
        </div>

        {selectedSchemes.length === 1 && (
          <div className="inline-flex items-center gap-2 p-3 rounded-lg bg-blue-50/80 border border-blue-200 text-sm text-brand-900">
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
    <div className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="verified">100% Neutral Matrix</Badge>
            <Badge variant="neutral">Strictly Non-Ranked</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Columns3 className="h-8 w-8 text-brand-700 shrink-0" />
            <span>Side-by-Side Loan Scheme Comparison</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Strictly factual comparison between {schemesList.length} documented schemes. Terms and sanctions are solely at bank discretion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
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
              Add More Schemes
            </Button>
          </Link>
        </div>
      </div>

      {/* Persistent Impartiality Disclosure */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-sm text-blue-950 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-brand-700 shrink-0" />
        <span>
          <strong>Strict Impartiality Rule:</strong> Edu4Loan presents values as documented in regulatory circulars. We do not score, rank, or declare any scheme as &ldquo;best&rdquo;.
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

      {/* Main Comparison Table */}
      {!loading && !error && comparisonData && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-fintech">
          <table className="w-full text-left border-collapse text-sm">
            {/* Header: Bank & Scheme Names */}
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 divide-x divide-slate-100">
                <th className="p-4 w-60 font-bold text-slate-400 uppercase text-xs align-top">
                  Comparison Parameter
                </th>
                {schemesList.map((scheme) => (
                  <th key={scheme.id} className="p-4 min-w-[240px] max-w-[280px] align-top space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        {scheme.bank.category}
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
                      <span className="text-sm font-semibold text-brand-800 block">
                        {scheme.bank.name}
                      </span>
                      <span className="text-base font-bold text-slate-900 block leading-tight mt-0.5">
                        {scheme.schemeName}
                      </span>
                    </div>

                    <div className="pt-1">
                      <VerifiedBadge
                        status={scheme.verification.status}
                        size="sm"
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* SECTION A: INTEREST RATE STRUCTURE */}
              <tr className="bg-slate-50/50">
                <td
                  colSpan={schemesList.length + 1}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 border-t border-slate-200"
                >
                  A. Interest Rate Structure
                </td>
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Documented Rate</span>
                    {highlightDiffs && (
                      <DifferenceBadge
                        status={isDifferent(schemesList.map((s) => s.interestRate.minRate.value)) ? 'different' : 'same'}
                      />
                    )}
                  </div>
                </td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5">
                    <span className="font-extrabold text-base text-brand-900 block">
                      {s.interestRate.minRate.value}% – {s.interestRate.maxRate.value}%
                    </span>
                    <span className="text-[10px] text-slate-400">Annual percentage</span>
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Benchmark Type</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-800 font-medium">
                    {s.interestRate.benchmarkType} (Repo Base: {s.interestRate.benchmarkRatePercent}%)
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Documented Spread</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700">
                    {s.interestRate.spreadPercentMin}% – {s.interestRate.spreadPercentMax}%
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Girl Student Concession</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-emerald-800 font-medium">
                    {s.interestRate.girlChildConcessionPercent?.value
                      ? `${s.interestRate.girlChildConcessionPercent.value}% interest waiver`
                      : 'Not documented'}
                  </td>
                ))}
              </tr>

              {/* SECTION B: LOAN STRUCTURE & COLLATERAL */}
              <tr className="bg-slate-50/50">
                <td
                  colSpan={schemesList.length + 1}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 border-t border-slate-200"
                >
                  B. Loan Structure & Collateral Requirements
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
                <td className="p-3.5 font-semibold text-slate-700">Up to ₹4.0 Lakhs</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-600">
                    {s.collateral.upTo4Lakhs}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">₹4.0L to ₹7.5 Lakhs</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-600">
                    {s.collateral.from4To7point5Lakhs}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Above ₹7.5 Lakhs</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-600">
                    {s.collateral.above7point5Lakhs}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Margin Money</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700">
                    {s.marginMoney.upTo4LakhsPercent}% &le; ₹4L • {s.marginMoney.above4LakhsIndiaPercent}% &gt; ₹4L
                  </td>
                ))}
              </tr>

              {/* SECTION C: REPAYMENT & MORATORIUM */}
              <tr className="bg-slate-50/50">
                <td
                  colSpan={schemesList.length + 1}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 border-t border-slate-200"
                >
                  C. Moratorium & Repayment
                </td>
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Moratorium Grace</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700 font-medium">
                    Course + {s.moratorium.moratoriumBufferMonths} Months
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Max Repayment Tenure</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-700 font-medium">
                    Up to {s.moratorium.repaymentTenureMaxYears} Years
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Interest Accrual</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-600">
                    {s.moratorium.explanation}
                  </td>
                ))}
              </tr>

              {/* SECTION D: FEES & CHARGES */}
              <tr className="bg-slate-50/50">
                <td
                  colSpan={schemesList.length + 1}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 border-t border-slate-200"
                >
                  D. Fees & Costs
                </td>
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Processing Fee</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-800">
                    {s.feesAndCharges.processingFee.value}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Prepayment Penalty</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 text-slate-800">
                    {s.feesAndCharges.prepaymentPenalty.value}
                  </td>
                ))}
              </tr>

              {/* SECTION E: OFFICIAL SOURCES & ACTIONS */}
              <tr className="bg-slate-50/50">
                <td
                  colSpan={schemesList.length + 1}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 border-t border-slate-200"
                >
                  E. Primary Sources & Detail Views
                </td>
              </tr>

              <tr className="divide-x divide-slate-100 hover:bg-slate-50/40">
                <td className="p-3.5 font-semibold text-slate-700">Official Circulars</td>
                {schemesList.map((s) => (
                  <td key={s.id} className="p-3.5 space-y-2">
                    {s.officialPortals?.circularUrl ? (
                      <a
                        href={s.officialPortals.circularUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-brand-700 font-semibold hover:underline"
                      >
                        <span>View Bank Circular</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">Available on bank portal</span>
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
    </div>
  );
};
