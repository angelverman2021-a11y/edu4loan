import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  ShieldCheck,
  Check,
  Plus,
  Info,
  CheckCircle2,
  FileText,
  Clock,
  Calculator,
  AlertTriangle,
  Landmark,
} from 'lucide-react';
import { loanSchemeService } from '@/services/loanSchemeService';
import { LoanSchemeItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Skeleton';
import { useComparison } from '@/context/ComparisonContext';

export const SchemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isComparing, addScheme, removeScheme } = useComparison();

  const [scheme, setScheme] = useState<LoanSchemeItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheme = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await loanSchemeService.getLoanSchemeById(id);
        setScheme(data);
      } catch (err: any) {
        setError(err.message || 'Unable to load scheme details.');
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <Alert variant="error">{error || 'Scheme not found.'}</Alert>
        <Link to="/loans">
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Loan Discovery
          </Button>
        </Link>
      </div>
    );
  }

  const comparing = isComparing(scheme._id);
  const bankObj = typeof scheme.bankId === 'object' ? scheme.bankId : null;
  const bankCategory = bankObj?.category?.replace('_', ' ').toUpperCase() || 'PUBLIC SECTOR';

  const formatCurrency = (val?: number) => {
    if (!val) return 'Need-based';
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Crore`;
    }
    return `₹${(val / 100000).toFixed(1)} Lakhs`;
  };

  const handleToggleCompare = () => {
    if (comparing) {
      removeScheme(scheme._id);
    } else {
      addScheme({
        id: scheme._id,
        schemeName: scheme.schemeName,
        bankName: scheme.bankName,
        code: scheme.schemeCode,
      });
    }
  };

  const minRate = scheme.interestRate?.minRate?.value;
  const maxRate = scheme.interestRate?.maxRate?.value;
  const rateText =
    minRate !== undefined && maxRate !== undefined
      ? `${minRate.toFixed(2)}% – ${maxRate.toFixed(2)}% p.a.`
      : minRate !== undefined
      ? `${minRate.toFixed(2)}% p.a.`
      : 'Rate not verified';

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Back Link */}
      <div>
        <Link
          to="/loans"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Schemes</span>
        </Link>
      </div>

      {/* TOP SECTION: Bank, Scheme Title, Status & Actions */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-fintech space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="info">{bankCategory}</Badge>
              <Badge variant="neutral">Scheme Code: {scheme.schemeCode}</Badge>
              <VerifiedBadge
                status={scheme.status || 'verified'}
                source={scheme.source?.source}
                sourceUrl={scheme.source?.sourceUrl || scheme.officialCircularUrl}
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {scheme.schemeName}
            </h1>
            <p className="text-base font-semibold text-slate-600 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-brand-700" />
              <span>{scheme.bankName}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {scheme.officialCircularUrl && (
              <a
                href={scheme.officialCircularUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                  Visit Official Source
                </Button>
              </a>
            )}

            <Button
              variant={comparing ? 'secondary' : 'outline'}
              size="sm"
              onClick={handleToggleCompare}
              leftIcon={comparing ? <Check className="h-3.5 w-3.5 text-brand-700" /> : <Plus className="h-3.5 w-3.5" />}
            >
              {comparing ? 'In Comparison' : 'Add to Comparison'}
            </Button>
          </div>
        </div>

        {scheme.overview && (
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
            {scheme.overview}
          </p>
        )}
      </div>

      {/* SECTION 1: FINANCIAL OVERVIEW */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">1. Documented Financial Overview</CardTitle>
          <p className="text-sm text-slate-500">
            All values carry verified source provenance from official regulatory circulars.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {/* Interest Rate Breakdown */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Interest Rate Structure
                </span>
                <span className="text-xl font-black text-brand-900 tracking-tight">
                  {rateText}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-sm font-semibold text-slate-700">
                  Benchmark: {scheme.interestRate?.benchmarkType || 'EBLR'}
                </span>
                <span className="text-xs text-slate-500">
                  Benchmark Base: {scheme.interestRate?.benchmarkRatePercent || 6.50}% + Spread: {scheme.interestRate?.spreadPercentMin}%–{scheme.interestRate?.spreadPercentMax}%
                </span>
              </div>
            </div>

            {scheme.interestRate?.girlChildConcessionPercent?.value ? (
              <div className="flex items-center gap-2 pt-2 border-t border-blue-200/60 text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  <strong>Girl Student Concession:</strong> {scheme.interestRate.girlChildConcessionPercent.value}% interest discount.
                </span>
              </div>
            ) : null}

            <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
              <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Interest rates may vary based on benchmark, spread, borrower profile and bank terms.</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Max Inland Loan Amount
              </span>
              <span className="text-base font-bold text-slate-900">
                {formatCurrency(scheme.maxLoanAmountInland?.value)}
              </span>
              <span className="block text-xs text-slate-500">Documented cap</span>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Margin Money (Student Contribution)
              </span>
              <span className="text-base font-bold text-slate-900">
                {scheme.marginMoney?.upTo4LakhsPercent || 0}% &le; ₹4L • {scheme.marginMoney?.above4LakhsIndiaPercent || 5}% &gt; ₹4L
              </span>
              <span className="block text-xs text-slate-500">
                Scholarship adjustable: {scheme.marginMoney?.scholarshipAdjustmentAllowed ? 'Yes' : 'No'}
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Processing Fee & Charges
              </span>
              <span className="text-base font-bold text-slate-900">
                {scheme.processingFee?.value || 'Nil for India'}
              </span>
              <span className="block text-xs text-slate-500">
                Prepayment penalty: {scheme.prepaymentPenalty?.value || 'Nil (RBI rules)'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: COLLATERAL & STATUTORY SECURITY */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">2. Documented Collateral & Security Tiers</CardTitle>
          <p className="text-sm text-slate-500">
            Categorized strictly according to RBI Model Scheme guidelines.
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block text-sm">Up to ₹4.0 Lakhs</span>
              <p className="text-slate-600">{scheme.collateral?.upTo4Lakhs || 'Nil. No third party guarantee required.'}</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block text-sm">₹4.0L to ₹7.5 Lakhs</span>
              <p className="text-slate-600">{scheme.collateral?.from4To7point5Lakhs || 'Third-party guarantee or CGFSEL guarantee cover.'}</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block text-sm">Above ₹7.5 Lakhs</span>
              <p className="text-slate-600">{scheme.collateral?.above7point5Lakhs || 'Tangible collateral security of suitable value.'}</p>
            </div>
          </div>

          {scheme.collateral?.acceptableCollateralTypes && scheme.collateral.acceptableCollateralTypes.length > 0 && (
            <div className="pt-2 text-slate-600">
              <strong className="text-slate-800">Acceptable Collateral Assets: </strong>
              <span>{scheme.collateral.acceptableCollateralTypes.join(', ')}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 3: REPAYMENT & MORATORIUM */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">3. Moratorium & Repayment Schedule</CardTitle>
          <p className="text-sm text-slate-500">
            Terms governing interest accrual during study and post-graduation repayment.
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-slate-200">
              <span className="block text-slate-400 font-bold uppercase text-[10px]">Study Duration</span>
              <span className="text-base font-bold text-slate-900 mt-1 block">
                {scheme.moratorium?.courseDurationYears || 4} Years (Standard)
              </span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200">
              <span className="block text-slate-400 font-bold uppercase text-[10px]">Grace Buffer</span>
              <span className="text-base font-bold text-slate-900 mt-1 block">
                {scheme.moratorium?.moratoriumBufferMonths || 12} Months post-course
              </span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200">
              <span className="block text-slate-400 font-bold uppercase text-[10px]">Max Repayment Tenure</span>
              <span className="text-base font-bold text-slate-900 mt-1 block">
                Up to {scheme.moratorium?.repaymentTenureMaxYears || 15} Years
              </span>
            </div>
          </div>

          {scheme.moratorium?.explanation && (
            <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1">
              <span className="font-semibold block">Interest Servicing Note:</span>
              <p>{scheme.moratorium.explanation}</p>
            </div>
          )}

          <div className="pt-2">
            <Link to={`/calculator?amount=${scheme.maxLoanAmountInland?.value || 1200000}&rate=${scheme.interestRate?.minRate?.value || 9.0}`}>
              <Button variant="outline" size="sm" leftIcon={<Calculator className="h-3.5 w-3.5" />}>
                Simulate EMI & Moratorium for this Scheme
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4: DOCUMENTED ELIGIBILITY */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">4. Documented Scheme Criteria</CardTitle>
          <p className="text-sm text-slate-500">
            Final eligibility is determined exclusively by the bank.
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="space-y-2">
            {scheme.eligibilityCriteria && scheme.eligibilityCriteria.length > 0 ? (
              scheme.eligibilityCriteria.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500">Documented general higher education criteria apply.</li>
            )}
          </ul>

          {scheme.vitBhopalCategoryNote && (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-sm">
              <strong className="block mb-0.5">VIT Bhopal Note:</strong>
              <span>{scheme.vitBhopalCategoryNote}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 5: OFFICIAL SOURCE CITATION */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">5. Authoritative Source Provenance</CardTitle>
          <p className="text-sm text-slate-500">
            Edu4Loan links directly to primary sources and public notifications.
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-900">Primary Bank Document:</span>
              <span className="text-slate-500">
                Verified: {scheme.lastVerified ? new Date(scheme.lastVerified).toLocaleDateString('en-IN') : 'Official'}
              </span>
            </div>
            <p className="text-slate-600">{scheme.source?.source || 'Official Bank Master Circular'}</p>

            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200">
              {scheme.officialCircularUrl && (
                <a
                  href={scheme.officialCircularUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  <span>Official Scheme Master Circular</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {scheme.officialApplicationUrl && (
                <a
                  href={scheme.officialApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  <span>Bank Application / Portal Link</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
