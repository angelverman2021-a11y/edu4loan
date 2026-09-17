import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  Plus,
  Check,
  ShieldAlert,
  Info,
  ChevronRight,
  Landmark,
} from 'lucide-react';
import { LoanSchemeItem } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Button } from '@/components/ui/Button';
import { useComparison } from '@/context/ComparisonContext';

export interface LoanSchemeCardProps {
  scheme: LoanSchemeItem;
}

export const LoanSchemeCard: React.FC<LoanSchemeCardProps> = ({ scheme }) => {
  const { isComparing, addScheme, removeScheme } = useComparison();
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

  // Interest rate display logic
  const minRate = scheme.interestRate?.minRate?.value;
  const maxRate = scheme.interestRate?.maxRate?.value;
  const rateText =
    minRate !== undefined && maxRate !== undefined
      ? `${minRate.toFixed(2)}% – ${maxRate.toFixed(2)}%`
      : minRate !== undefined
      ? `${minRate.toFixed(2)}%`
      : 'Rate not verified';

  return (
    <Card className="flex flex-col justify-between border-slate-200/90 shadow-fintech hover:border-brand-200/90 transition-all">
      {/* Top Header: Bank Info & Verified Badge */}
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Building2 className="h-3.5 w-3.5 text-brand-600 shrink-0" />
              <span>{scheme.bankName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] font-semibold text-slate-400">{bankCategory}</span>
            </div>
            <CardTitle className="text-base font-bold text-slate-900 mt-1 leading-snug">
              {scheme.schemeName}
            </CardTitle>
          </div>

          <VerifiedBadge
            status={scheme.status || 'verified'}
            source={scheme.source?.source}
            sourceUrl={scheme.source?.sourceUrl || scheme.officialCircularUrl}
            lastVerified={scheme.lastVerified || scheme.source?.lastVerified}
            size="sm"
          />
        </div>

        {/* Overview snippet */}
        {scheme.overview && (
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {scheme.overview}
          </p>
        )}
      </CardHeader>

      {/* Main Financial Specs Grid */}
      <CardContent className="space-y-3.5 py-4 text-xs">
        {/* Interest Rate Presentation */}
        <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100/80 space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Documented Interest Rate
            </span>
            <span className="text-sm font-extrabold text-brand-800 tracking-tight">
              {rateText}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Type: <strong className="text-slate-700">{scheme.interestRate?.benchmarkType || 'Benchmark-Linked'}</strong>
              {scheme.interestRate?.spreadPercentMin !== undefined && (
                <span className="ml-1 text-slate-400">
                  (Spread: {scheme.interestRate.spreadPercentMin}%–{scheme.interestRate.spreadPercentMax}%)
                </span>
              )}
            </span>
            <span className="text-[10px] text-slate-400 italic">
              Verified: {scheme.interestRate?.minRate?.lastVerified ? new Date(scheme.interestRate.minRate.lastVerified).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Official Circular'}
            </span>
          </div>
          <div className="pt-1 flex items-center gap-1 text-[10px] text-slate-500">
            <Info className="h-3 w-3 text-slate-400 shrink-0" />
            <span>Interest rates may vary based on benchmark, spread, borrower profile and bank terms.</span>
          </div>
        </div>

        {/* Key Metrics: Loan Amount, Collateral, Margin */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Max Domestic Loan
            </span>
            <span className="text-xs font-bold text-slate-900 mt-0.5 block">
              {formatCurrency(scheme.maxLoanAmountInland?.value)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Documented maximum
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Margin Money
            </span>
            <span className="text-xs font-bold text-slate-900 mt-0.5 block">
              {scheme.marginMoney?.upTo4LakhsPercent || 0}% up to ₹4L
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {scheme.marginMoney?.above4LakhsIndiaPercent || 5}% for &gt; ₹4L
            </span>
          </div>
        </div>

        {/* Collateral Snapshot */}
        <div className="space-y-1 text-slate-600">
          <div className="flex items-start gap-1.5">
            <span className="font-semibold text-slate-700 shrink-0">Collateral Terms:</span>
            <span className="line-clamp-1 text-slate-600">
              {scheme.collateral?.upTo4Lakhs || 'Nil up to ₹4 Lakhs as per RBI'}
            </span>
          </div>
          <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
            <span className="shrink-0">Above ₹7.5L:</span>
            <span className="line-clamp-1">
              {scheme.collateral?.above7point5Lakhs || 'Tangible collateral required'}
            </span>
          </div>
        </div>

        {/* Repayment & Moratorium */}
        <div className="text-[11px] text-slate-500 flex justify-between items-center pt-1 border-t border-slate-100">
          <span>
            Moratorium: <strong className="text-slate-700">Course + {scheme.moratorium?.moratoriumBufferMonths || 12} Mo</strong>
          </span>
          <span>
            Tenure: <strong className="text-slate-700">Up to {scheme.moratorium?.repaymentTenureMaxYears || 15} Yrs</strong>
          </span>
        </div>

        {/* VIT Bhopal Eligibility Tag */}
        {scheme.vitBhopalEligible && (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200/80 w-full">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Documented eligibility for VIT Bhopal campus</span>
          </div>
        )}
      </CardContent>

      {/* Card Actions */}
      <CardFooter className="pt-3 pb-4 px-5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link to={`/loans/${scheme._id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <span>View Scheme Details</span>
            <ChevronRight className="h-3.5 w-3.5 ml-1 text-slate-400" />
          </Button>
        </Link>

        <Button
          variant={comparing ? 'secondary' : 'primary'}
          size="sm"
          onClick={handleToggleCompare}
          className={comparing ? 'border-brand-300 text-brand-800 bg-brand-50 hover:bg-brand-100' : ''}
          leftIcon={comparing ? <Check className="h-3.5 w-3.5 text-brand-700" /> : <Plus className="h-3.5 w-3.5" />}
        >
          {comparing ? 'In Comparison' : 'Compare'}
        </Button>
      </CardFooter>
    </Card>
  );
};
