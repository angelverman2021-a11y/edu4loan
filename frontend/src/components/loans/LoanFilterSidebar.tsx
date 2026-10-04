import React from 'react';
import { Filter, RotateCcw, X, Search, ShieldCheck } from 'lucide-react';
import { FilterState, BankSummary } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface LoanFilterSidebarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  banks: BankSummary[];
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  totalResults?: number;
}

export const LoanFilterSidebar: React.FC<LoanFilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  banks,
  isMobileOpen = false,
  onCloseMobile,
  totalResults,
}) => {
  // Count active non-default filters
  const activeCount = [
    Boolean(filters.bank && filters.bank !== 'all'),
    Boolean(filters.degreeLevel && filters.degreeLevel !== 'all'),
    Boolean(filters.loanAmount && filters.loanAmount > 0),
    Boolean(filters.collateral && filters.collateral !== 'all'),
    Boolean(filters.studentCategory && filters.studentCategory !== 'all'),
    Boolean(filters.pmVidyalaxmi),
    Boolean(filters.vidyaLakshmi),
    Boolean(filters.status && filters.status !== 'all'),
  ].filter(Boolean).length;

  const content = (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-brand-700" />
          <h3 className="font-bold text-slate-900 text-base">Factual Scheme Filters</h3>
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-brand-700 hover:text-brand-900 hover:underline flex items-center gap-1 font-medium"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Loan Amount Funding Requirement */}
      <div className="space-y-1.5">
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-700">
          How much funding do you need?
        </label>
        <div className="relative rounded-lg shadow-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-base">
            ₹
          </span>
          <input
            type="number"
            min={0}
            step={50000}
            value={filters.loanAmount || ''}
            onChange={(e) =>
              onChange({
                ...filters,
                loanAmount: e.target.value ? Number(e.target.value) : undefined,
                page: 1,
              })
            }
            placeholder="e.g. 1500000"
            className="w-full pl-8 pr-3 py-2 text-base rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
          />
        </div>
        <p className="text-xs text-slate-500 leading-snug">
          These schemes have documented loan structures that may cover the amount entered. (Does not guarantee approval).
        </p>
      </div>

      {/* 2. Bank Filter */}
      <div className="space-y-1.5">
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-700">
          Bank / Institution
        </label>
        <select
          value={filters.bank || 'all'}
          onChange={(e) => onChange({ ...filters, bank: e.target.value, page: 1 })}
          className="w-full p-2 text-base rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
        >
          <option value="all">All Participating Banks</option>
          {banks.map((b) => (
            <option key={b._id} value={b.slug || b.shortCode}>
              {b.name} ({b.category?.replace('_', ' ').toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* 3. Collateral Filter */}
      <div className="space-y-1.5">
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-700">
          Documented Collateral Terms
        </label>
        <div className="space-y-1 text-sm text-slate-700">
          {[
            { value: 'all', label: 'All Collateral Types' },
            { value: 'free', label: 'Collateral-free (Documented Nil / CGFSEL)' },
            { value: 'required', label: 'Collateral Required (> ₹7.5 Lakhs)' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="radio"
                name="collateral"
                value={opt.value}
                checked={(filters.collateral || 'all') === opt.value}
                onChange={(e) => onChange({ ...filters, collateral: e.target.value as any, page: 1 })}
                className="text-brand-700 focus:ring-brand-600"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Degree Level */}
      <div className="space-y-1.5">
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-700">
          Degree Program
        </label>
        <select
          value={filters.degreeLevel || 'all'}
          onChange={(e) => onChange({ ...filters, degreeLevel: e.target.value, page: 1 })}
          className="w-full p-2 text-base rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
        >
          <option value="all">All Degree Levels</option>
          <option value="Undergraduate">Undergraduate (B.Tech / BCA / BBA)</option>
          <option value="Postgraduate">Postgraduate (M.Tech / MCA / MBA)</option>
          <option value="Doctoral">Doctoral (Ph.D.)</option>
        </select>
      </div>

      {/* 5. Concessions & Category */}
      <div className="space-y-1.5">
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-700">
          Student Concession
        </label>
        <select
          value={filters.studentCategory || 'all'}
          onChange={(e) => onChange({ ...filters, studentCategory: e.target.value, page: 1 })}
          className="w-full p-2 text-base rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
        >
          <option value="all">Standard Terms</option>
          <option value="girl_child">Girl Student (0.50% Interest Discount)</option>
        </select>
      </div>

      {/* 6. Central Subsidies Linkage */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-700">
          Government Integration
        </label>
        <div className="space-y-2 text-sm text-slate-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(filters.pmVidyalaxmi)}
              onChange={(e) => onChange({ ...filters, pmVidyalaxmi: e.target.checked || undefined, page: 1 })}
              className="rounded text-brand-700 focus:ring-brand-600"
            />
            <span>PM-Vidyalaxmi Participating</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(filters.vidyaLakshmi)}
              onChange={(e) => onChange({ ...filters, vidyaLakshmi: e.target.checked || undefined, page: 1 })}
              className="rounded text-brand-700 focus:ring-brand-600"
            />
            <span>Vidya Lakshmi Portal Eligible</span>
          </label>
        </div>
      </div>

      {/* 7. Verification Status */}
      <div className="space-y-1.5 pt-1 border-t border-slate-100">
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-700">
          Verification Status
        </label>
        <select
          value={filters.status || 'all'}
          onChange={(e) => onChange({ ...filters, status: e.target.value === 'all' ? undefined : e.target.value, page: 1 })}
          className="w-full p-2 text-base rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
        >
          <option value="all">All Documented Schemes</option>
          <option value="verified">Verified Circulars Only</option>
          <option value="needs_verification">Under Verification / Advisory</option>
        </select>
      </div>
    </div>
  );

  // Desktop Left Rail
  return (
    <>
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-fintech">
          {content}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-y-auto">
          <div className="fixed inset-0 bg-navy-950/40 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative min-h-full flex flex-col justify-end p-0">
            <div className="relative w-full bg-white rounded-t-2xl p-6 shadow-2xl border-t border-slate-200 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-base">Filters</span>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {content}

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Button variant="primary" className="w-full" onClick={onCloseMobile}>
                  Show {totalResults !== undefined ? `${totalResults} Schemes` : 'Results'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
