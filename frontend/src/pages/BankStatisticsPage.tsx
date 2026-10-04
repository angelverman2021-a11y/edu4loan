import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Building2,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Info,
  Clock,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { bankStatisticsService, BankStatisticsData } from '@/services/bankStatisticsService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Skeleton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const BankStatisticsPage: React.FC = () => {
  const [data, setData] = useState<BankStatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await bankStatisticsService.getStatistics();
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Unable to retrieve bank statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `Rs ${(amount / 10000000).toFixed(2)} Cr`;
    }
    return `Rs ${(amount / 100000).toFixed(1)} Lakhs`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="verified">100% Verified Regulatory Data</Badge>
            <Badge variant="neutral">No Speculative Approval Odds</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-brand-700 shrink-0" />
            <span>Factual Bank Loan Statistics</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Objective, circular-verified financial metrics across public and private education lenders. No predictive approval algorithms or synthetic rankings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/loans">
            <Button variant="outline" size="sm">
              Explore Schemes
            </Button>
          </Link>
          <Link to="/compare">
            <Button variant="primary" size="sm">
              Compare Side-by-Side
            </Button>
          </Link>
        </div>
      </div>

      {/* Mandatory Regulatory Transparency Disclosure */}
      <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-brand-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-brand-900">
            Authoritative Disclosure on Speculative Approval Statistics:
          </p>
          <p className="text-slate-700 leading-relaxed">
            {data?.summary.notice ||
              'Approval-rate statistics for this category are not currently available from a verified source. Edu4Loan strictly rejects synthetic approval percentages, as commercial bank sanctions depend on individual underwriting, CIBIL scores, co-borrower debt-to-income ratios, and branch verification.'}
          </p>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      )}

      {/* Error Banner */}
      {error && <Alert variant="error">{error}</Alert>}

      {!loading && !error && data && (
        <div className="space-y-8">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-slate-200">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Published Banks
                  </p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {data.summary.totalPublishedBanks}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Public & Schedule Commercial</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-brand-700 flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Cataloged Schemes
                  </p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {data.summary.totalPublishedSchemes}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Circular-backed offerings</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-brand-700 flex items-center justify-center">
                  <Layers className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    VIT Bhopal Desks
                  </p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {data.summary.vitBhopalSupportedCount}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Dedicated campus assistance</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FileCheck2 className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Zero Collateral Cap
                  </p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    Rs 7.5L
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">IBA Model clean limit</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 1: Interest Rate Spread and Benchmark Distribution */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-brand-700" />
                  <span>Documented Interest Rate Spreads & Benchmarks</span>
                </CardTitle>
                <Badge variant="verified">RBI EBLR Linked</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="p-4">Bank Name</th>
                    <th className="p-4">Loan Scheme</th>
                    <th className="p-4">Benchmark</th>
                    <th className="p-4">Min Rate</th>
                    <th className="p-4">Max Rate</th>
                    <th className="p-4">Documented Spread</th>
                    <th className="p-4">Source Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.rateDistribution.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-brand-900">{item.bankName}</td>
                      <td className="p-4 font-medium text-slate-800">{item.schemeName}</td>
                      <td className="p-4 text-slate-600">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                          {item.benchmarkType}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">{item.minRate}%</td>
                      <td className="p-4 font-bold text-slate-900">{item.maxRate}%</td>
                      <td className="p-4 text-slate-700">
                        +{item.spreadMin}% to +{item.spreadMax}%
                      </td>
                      <td className="p-4">
                        <VerifiedBadge
                          status="verified"
                          lastVerified={item.lastVerified}
                          size="sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Section 2: Inland Quantum & Security Limits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-brand-700" />
                  <span>Documented Loan Quantum Thresholds</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-3">
                  {data.loanLimits.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-900">{item.bankName}</p>
                          <p className="text-xs text-slate-500">{item.schemeName}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-brand-800">
                          Max: {formatCurrency(item.maxInland)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2">
                        <span>Collateral-Free Tier:</span>
                        <span className="font-semibold text-emerald-700">
                          Up to {formatCurrency(item.collateralFreeThreshold)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-brand-700" />
                  <span>Turnaround Times & Published SLAs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-3">
                  {data.turnaroundStats.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{item.bankName}</span>
                        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          {item.publishedTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                        <span>Source: {item.source}</span>
                        {item.sourceUrl && (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-brand-700 hover:underline"
                          >
                            <span>Official SLA</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 3: Campus Facilitation & Partner Banks Overview */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-brand-700" />
                <span>Documented Banks & VIT Bhopal Facilitation Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="p-4">Bank Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Cataloged Schemes</th>
                    <th className="p-4">Campus Desk</th>
                    <th className="p-4">Turnaround Window</th>
                    <th className="p-4">Official Portal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.schemesPerBank.map((bank, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-900">{bank.bankName}</td>
                      <td className="p-4 text-slate-600 uppercase font-semibold text-[11px]">
                        {bank.category}
                      </td>
                      <td className="p-4 font-semibold text-brand-900">
                        {bank.schemeCount} active scheme{bank.schemeCount > 1 ? 's' : ''}
                      </td>
                      <td className="p-4">
                        {bank.hasCampusDesk ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Available On Campus
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Nearest Branch
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-700">{bank.turnaroundTime}</td>
                      <td className="p-4">
                        <a
                          href={bank.officialPortal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand-700 hover:underline font-medium"
                        >
                          <span>Bank Portal</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Statutory Disclosure Footer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1">
            <p className="font-semibold text-slate-900">Statutory Transparency Notice:</p>
            <p className="leading-relaxed">{data.statutoryDisclosure}</p>
          </div>
        </div>
      )}
    </div>
  );
};
