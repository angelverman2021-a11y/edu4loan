import React from 'react';
import { Sparkles, CheckCircle2, ShieldAlert, Landmark, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';

export interface MoratoriumSavingsCardProps {
  savingsAmount: number;
  moratoriumInterest: number;
  isServicing: boolean;
  onToggleServicing: () => void;
}

export const MoratoriumSavingsCard: React.FC<MoratoriumSavingsCardProps> = ({
  savingsAmount,
  moratoriumInterest,
  isServicing,
  onToggleServicing,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* Moratorium Servicing Impact */}
      <div className="bg-gradient-to-br from-emerald-50/90 to-blue-50/60 rounded-2xl border border-emerald-200/90 p-5 shadow-fintech space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
              Moratorium Interest Intelligence
            </span>
          </div>
          <Badge variant="verified">Statutory RBI Provision</Badge>
        </div>

        <div>
          {isServicing ? (
            <div className="space-y-1">
              <p className="text-sm font-bold text-emerald-900">
                You are currently modeling monthly interest servicing during college.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                By paying the simple interest monthly during your 4-year B.Tech, your loan principal will not capitalize, saving you thousands in compound interest over the repayment tenure.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs text-slate-500 font-semibold uppercase">
                Potential Savings by Servicing Simple Interest
              </p>
              <p className="text-2xl font-black text-emerald-800 tracking-tight">
                {formatCurrency(savingsAmount)}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                If interest is not serviced monthly, {formatCurrency(moratoriumInterest)} will be capitalized into your principal at the start of repayment, causing your post-college EMI to be significantly higher.
              </p>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-emerald-200/70 flex items-center justify-between">
          <button
            type="button"
            onClick={onToggleServicing}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
          >
            {isServicing
              ? 'Switch to Capitalized Interest Simulation'
              : 'Simulate Servicing Interest Monthly'}
          </button>
        </div>
      </div>

      {/* CSIS Subsidy Reminder */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Landmark className="h-4 w-4 text-brand-700" />
          <span>Central Sector Interest Subsidy (CSIS) Eligibility</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Students from Economically Weaker Sections (EWS) with gross family annual income up to <strong>₹4.50 Lakhs</strong> are eligible for a <strong>100% full interest waiver</strong> during the entire course duration and 1-year moratorium period.
        </p>
        <div className="pt-1">
          <Link
            to="/schemes"
            className="text-brand-700 hover:text-brand-900 font-semibold inline-flex items-center gap-1 hover:underline"
          >
            <span>Learn More About CSIS & PM-Vidyalaxmi</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
