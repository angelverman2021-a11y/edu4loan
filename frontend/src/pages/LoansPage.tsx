import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, AlertCircle, RefreshCw, Compass, BookOpen } from 'lucide-react';
import { loanSchemeService } from '@/services/loanSchemeService';
import { LoanSchemeItem, BankSummary, FilterState } from '@/types';
import { LoanSchemeCard } from '@/components/loans/LoanSchemeCard';
import { LoanFilterSidebar } from '@/components/loans/LoanFilterSidebar';
import { ComparisonTray } from '@/components/loans/ComparisonTray';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Skeleton';

export const LoansPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL query parameters
  const [filters, setFilters] = useState<FilterState>(() => {
    return {
      search: searchParams.get('search') || '',
      bank: searchParams.get('bank') || 'all',
      degreeLevel: searchParams.get('degreeLevel') || 'all',
      loanAmount: searchParams.get('loanAmount') ? Number(searchParams.get('loanAmount')) : undefined,
      collateral: (searchParams.get('collateral') as any) || 'all',
      studentCategory: searchParams.get('studentCategory') || 'all',
      pmVidyalaxmi: searchParams.get('pmVidyalaxmi') === 'true',
      vidyaLakshmi: searchParams.get('vidyaLakshmi') === 'true',
      status: searchParams.get('status') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: 12,
    };
  });

  const [schemes, setSchemes] = useState<LoanSchemeItem[]>([]);
  const [banks, setBanks] = useState<BankSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationMeta, setPaginationMeta] = useState<any>({ total: 0, totalPages: 1, page: 1 });
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>(filters.search || '');

  // Synchronize state changes with URL query parameters
  const updateUrlParams = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.bank && newFilters.bank !== 'all') params.set('bank', newFilters.bank);
    if (newFilters.degreeLevel && newFilters.degreeLevel !== 'all') params.set('degreeLevel', newFilters.degreeLevel);
    if (newFilters.loanAmount && newFilters.loanAmount > 0) params.set('loanAmount', newFilters.loanAmount.toString());
    if (newFilters.collateral && newFilters.collateral !== 'all') params.set('collateral', newFilters.collateral);
    if (newFilters.studentCategory && newFilters.studentCategory !== 'all') params.set('studentCategory', newFilters.studentCategory);
    if (newFilters.pmVidyalaxmi) params.set('pmVidyalaxmi', 'true');
    if (newFilters.vidyaLakshmi) params.set('vidyaLakshmi', 'true');
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.page && newFilters.page > 1) params.set('page', newFilters.page.toString());

    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Load Banks List for Filters
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const banksList = await loanSchemeService.getBanks();
        setBanks(banksList);
      } catch (err) {
        console.error('Failed to load banks catalog:', err);
      }
    };
    fetchBanks();
  }, []);

  // Debounced Search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        const updated = { ...filters, search: searchInput, page: 1 };
        setFilters(updated);
        updateUrlParams(updated);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, filters, updateUrlParams]);

  // Fetch loan schemes whenever filters change
  const fetchSchemes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await loanSchemeService.listLoanSchemes(filters);
      setSchemes(res.schemes);
      setPaginationMeta(res.meta);
    } catch (err: any) {
      setError(err.message || 'Unable to load loan schemes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSchemes();
  }, [fetchSchemes]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    updateUrlParams(newFilters);
  };

  const handleResetFilters = () => {
    const resetState: FilterState = {
      search: '',
      bank: 'all',
      degreeLevel: 'all',
      loanAmount: undefined,
      collateral: 'all',
      studentCategory: 'all',
      pmVidyalaxmi: false,
      vidyaLakshmi: false,
      status: undefined,
      page: 1,
      limit: 12,
    };
    setSearchInput('');
    setFilters(resetState);
    updateUrlParams(resetState);
  };

  const handlePageChange = (newPage: number) => {
    const updated = { ...filters, page: newPage };
    setFilters(updated);
    updateUrlParams(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="verified">100% Impartial Information</Badge>
          <Badge variant="neutral">Verified Circulars</Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Compass className="h-8 w-8 text-brand-700 shrink-0" />
          <span>Find Education Loan Options</span>
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          Explore education loan schemes using documented terms, eligibility information and official sources. Results are presented neutrally with zero sponsored rankings or approval guarantees.
        </p>
      </div>

      {/* 2. VIT Bhopal Context Banner */}
      <div className="bg-gradient-to-r from-blue-50/90 to-slate-50 p-4 rounded-xl border border-blue-200/70 text-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-brand-700 text-white flex items-center justify-center shrink-0 font-bold">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">VIT Bhopal Institutional Guidance</span>
            <span className="text-slate-600">
              Covers Category 1–5 tuition fees, hostel options, and on-campus Indian Bank / SBI helpdesk SOPs.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search & Mobile Filter Toggle Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search banks or loan schemes (e.g. SBI Scholar, Canara, PNB)..."
            className="w-full pl-10 pr-4 py-2 text-base rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 shadow-xs"
          />
        </div>

        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 text-base font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-xs shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4 text-brand-700" />
          <span>Filters</span>
        </button>
      </div>

      {/* 4. Main Two-Column Layout */}
      <div className="flex items-start gap-8">
        {/* Left Filter Sidebar */}
        <LoanFilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          banks={banks}
          isMobileOpen={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
          totalResults={paginationMeta?.total}
        />

        {/* Right Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Results Header Status */}
          <div className="flex items-center justify-between text-sm text-slate-500 pb-2 border-b border-slate-100">
            <span>
              Showing <strong className="text-slate-800">{schemes.length}</strong> of{' '}
              <strong className="text-slate-800">{paginationMeta?.total || schemes.length}</strong> documented schemes
            </span>
            {filters.bank && filters.bank !== 'all' && (
              <span className="font-medium text-brand-800">
                Filtered by Bank: {filters.bank}
              </span>
            )}
          </div>

          {/* Error State */}
          {error && (
            <Alert variant="error" className="my-4">
              <div className="flex items-center justify-between w-full">
                <span>{error}</span>
                <Button variant="outline" size="sm" onClick={fetchSchemes} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                  Retry
                </Button>
              </div>
            </Alert>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-fintech space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && schemes.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-4">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No loan schemes match these filters</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Try removing a filter, increasing the requested loan amount coverage, or broadening your search terms.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Scheme Cards Grid */}
          {!loading && !error && schemes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {schemes.map((scheme) => (
                <LoanSchemeCard key={scheme._id} scheme={scheme} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && paginationMeta && paginationMeta.totalPages > 1 && (
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-sm">
              <Button
                variant="secondary"
                size="sm"
                disabled={filters.page === 1}
                onClick={() => handlePageChange((filters.page || 1) - 1)}
              >
                Previous
              </Button>

              <span className="text-slate-600 font-medium">
                Page {filters.page} of {paginationMeta.totalPages}
              </span>

              <Button
                variant="secondary"
                size="sm"
                disabled={filters.page === paginationMeta.totalPages}
                onClick={() => handlePageChange((filters.page || 1) + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 5. Sticky Comparison Selection Tray */}
      <ComparisonTray />
    </div>
  );
};
