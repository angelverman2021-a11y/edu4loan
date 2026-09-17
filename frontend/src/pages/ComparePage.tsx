import React, { useState, useEffect } from 'react';
import { Building2, Search, Filter, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { api } from '@/services/api';

export const ComparePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [banks, setBanks] = useState<any[]>([]);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [banksRes, schemesRes] = await Promise.all([
          api.get<any[]>('/banks'),
          api.get<any[]>('/loan-schemes'),
        ]);
        setBanks(banksRes.data || []);
        setSchemes(schemesRes.data || []);
      } catch (err) {
        console.error('Failed to load bank schemes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSchemes = schemes.filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.schemeName?.toLowerCase().includes(term) ||
      s.bankName?.toLowerCase().includes(term) ||
      s.code?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="verified">100% Impartial</Badge>
            <Badge variant="neutral">Verified Circulars</Badge>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Building2 className="h-8 w-8 text-brand-700 shrink-0" />
            <span>Bank & Education Loan Scheme Directory</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Side-by-side factual comparison of education loan programs available to VIT Bhopal students.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72 relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search scheme or bank..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 shadow-xs"
          />
        </div>
      </div>

      {/* Grid of Schemes */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Loading verified loan schemes...</p>
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-600">No schemes found matching &ldquo;{searchTerm}&rdquo;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme._id || scheme.code} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="info">{scheme.bankName || 'Public Sector Bank'}</Badge>
                  <VerifiedBadge
                    status={scheme.verificationStatus || 'verified'}
                    source={scheme.source?.primarySource}
                    sourceUrl={scheme.source?.sourceUrl}
                    lastVerified={scheme.source?.lastVerified}
                    size="sm"
                  />
                </div>
                <CardTitle className="text-base mt-2">{scheme.schemeName}</CardTitle>
                <p className="text-xs text-slate-500 line-clamp-1">{scheme.targetAudience || 'Undergraduate & Postgraduate'}</p>
              </CardHeader>

              <CardContent className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Interest Rate:</span>
                  <span className="font-semibold text-slate-900">
                    {scheme.interestRate?.minRate}% – {scheme.interestRate?.maxRate}% p.a.
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Maximum Limit:</span>
                  <span className="font-semibold text-slate-900">
                    {scheme.maxLoanAmount?.value
                      ? `₹${(scheme.maxLoanAmount.value / 100000).toFixed(1)} Lakhs`
                      : 'Need based'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Collateral Rule:</span>
                  <span className="font-semibold text-slate-900">
                    {scheme.collateralRequirement?.thirdPartyGuaranteeThreshold
                      ? `Nil up to ₹${(scheme.collateralRequirement.thirdPartyGuaranteeThreshold / 100000).toFixed(1)}L`
                      : 'Per RBI guidelines'}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Repayment Period:</span>
                  <span className="font-semibold text-slate-900">
                    Up to {scheme.repaymentTenure?.maxTenureMonths ? `${scheme.repaymentTenure.maxTenureMonths / 12} Years` : '15 Years'}
                  </span>
                </div>
              </CardContent>

              <div className="px-6 pb-5 pt-0">
                <Link to={`/calculator?amount=${scheme.maxLoanAmount?.value || 1000000}&rate=${scheme.interestRate?.minRate || 9.0}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Calculate EMI for this Scheme
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
