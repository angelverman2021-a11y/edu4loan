import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { clsx } from 'clsx';

// Status Types
type VitStatus = '🟢 Verified — VIT Bhopal Listed' | '🟡 Eligibility Depends on Bank/Branch' | '🔴 Not Verified';

interface BankListStatus {
  id: string;
  bankName: string;
  category: string;
  status: VitStatus;
  scheme: string;
  maxLoanLakh: number | 'Need-based';
  collateral: string;
  source: string;
  lastVerified: string;
}

const ELIGIBLE_BANKS: BankListStatus[] = [
  {
    id: 'sbi',
    bankName: 'State Bank of India',
    category: 'Scholar / Premier Institution',
    status: '🟡 Eligibility Depends on Bank/Branch',
    scheme: 'SBI Student Loan Scheme',
    maxLoanLakh: 20,
    collateral: 'No Collateral up to ₹20 Lakhs',
    source: 'Public Web Data (Branch verification needed)',
    lastVerified: '2026-09-01',
  },
  {
    id: 'bob',
    bankName: 'Bank of Baroda',
    category: 'Premier Institution',
    status: '🟡 Eligibility Depends on Bank/Branch',
    scheme: 'Baroda Scholar',
    maxLoanLakh: 40,
    collateral: 'No Collateral up to ₹40 Lakhs for Premier List',
    source: 'Public Web Data (Branch verification needed)',
    lastVerified: '2026-08-15',
  },
  {
    id: 'canara',
    bankName: 'Canara Bank',
    category: 'Eligible Institution',
    status: '🟡 Eligibility Depends on Bank/Branch',
    scheme: 'Vidya Turant',
    maxLoanLakh: 'Need-based',
    collateral: 'Standard IBA rules apply',
    source: 'Canara Bank General Guidelines',
    lastVerified: '2026-07-20',
  },
  {
    id: 'hdfc',
    bankName: 'HDFC Bank',
    category: 'Preferred Institution',
    status: '🟡 Eligibility Depends on Bank/Branch',
    scheme: 'HDFC Education Loan',
    maxLoanLakh: 30,
    collateral: 'No Collateral up to ₹15 Lakhs',
    source: 'Public Web Data (Branch verification needed)',
    lastVerified: '2026-09-10',
  },
  {
    id: 'icici',
    bankName: 'ICICI Bank',
    category: 'General Institution',
    status: '🔴 Not Verified',
    scheme: 'ICICI Education Loan',
    maxLoanLakh: 50,
    collateral: 'Not Verified — Contact Bank',
    source: 'Not Verified — Contact Bank',
    lastVerified: 'N/A',
  },
  {
    id: 'axis',
    bankName: 'Axis Bank',
    category: 'Premier / Preferred Institution',
    status: '🟡 Eligibility Depends on Bank/Branch',
    scheme: 'Axis Education Loan',
    maxLoanLakh: 40,
    collateral: 'Varies by Branch Manager discretion',
    source: 'Axis Bank Internal Circular',
    lastVerified: '2026-06-05',
  },
  {
    id: 'pnb',
    bankName: 'Punjab National Bank',
    category: 'Eligible Institution',
    status: '🟡 Eligibility Depends on Bank/Branch',
    scheme: 'PNB Saraswati',
    maxLoanLakh: 100,
    collateral: 'No Collateral up to ₹7.5 Lakhs',
    source: 'PNB Education Loan Guidelines',
    lastVerified: '2026-05-12',
  },
  {
    id: 'union',
    bankName: 'Union Bank of India',
    category: 'Eligible Institution',
    status: '🟡 Eligibility Depends on Bank/Branch',
    scheme: 'Union Education Loan',
    maxLoanLakh: 'Need-based',
    collateral: 'Standard IBA rules apply',
    source: 'Union Bank Portal',
    lastVerified: '2026-04-10',
  },
  {
    id: 'indian',
    bankName: 'Indian Bank',
    category: 'Eligible Institution',
    status: '🟡 Eligibility Depends on Bank/Branch',
    scheme: 'IB Education Loan',
    maxLoanLakh: 50,
    collateral: 'Standard IBA rules apply',
    source: 'Indian Bank Portal',
    lastVerified: '2026-03-22',
  },
  {
    id: 'cbi',
    bankName: 'Central Bank of India',
    category: 'Eligible Institution',
    status: '🔴 Not Verified',
    scheme: 'Cent Vidyarthi',
    maxLoanLakh: 20,
    collateral: 'Not Verified — Contact Bank',
    source: 'Not Verified — Contact Bank',
    lastVerified: 'N/A',
  },
  {
    id: 'idbi',
    bankName: 'IDBI Bank',
    category: 'General Institution',
    status: '🔴 Not Verified',
    scheme: 'Education Loan',
    maxLoanLakh: 'Need-based',
    collateral: 'Not Verified — Contact Bank',
    source: 'Not Verified — Contact Bank',
    lastVerified: 'N/A',
  },
  {
    id: 'kotak',
    bankName: 'Kotak Mahindra Bank',
    category: 'General Institution',
    status: '🔴 Not Verified',
    scheme: 'Kotak Education Loan',
    maxLoanLakh: 50,
    collateral: 'Not Verified — Contact Bank',
    source: 'Not Verified — Contact Bank',
    lastVerified: 'N/A',
  },
  {
    id: 'indusind',
    bankName: 'IndusInd Bank',
    category: 'General Institution',
    status: '🔴 Not Verified',
    scheme: 'IndusInd Education Loan',
    maxLoanLakh: 40,
    collateral: 'Not Verified — Contact Bank',
    source: 'Not Verified — Contact Bank',
    lastVerified: 'N/A',
  },
  {
    id: 'yes',
    bankName: 'Yes Bank',
    category: 'General Institution',
    status: '🔴 Not Verified',
    scheme: 'Yes Education Loan',
    maxLoanLakh: 30,
    collateral: 'Not Verified — Contact Bank',
    source: 'Not Verified — Contact Bank',
    lastVerified: 'N/A',
  },
  {
    id: 'idfc',
    bankName: 'IDFC First Bank',
    category: 'Preferred Institution',
    status: '🟡 Eligibility Depends on Bank/Branch',
    scheme: 'IDFC First Education Loan',
    maxLoanLakh: 40,
    collateral: 'Unsecured upto 20 Lakhs based on profile',
    source: 'Internal Circular',
    lastVerified: '2026-08-01',
  },
  {
    id: 'federal',
    bankName: 'Federal Bank',
    category: 'Eligible Institution',
    status: '🟡 Eligibility Depends on Bank/Branch',
    scheme: 'Federal Special Vidya Loan',
    maxLoanLakh: 'Need-based',
    collateral: 'Standard IBA rules apply',
    source: 'Federal Bank Guidelines',
    lastVerified: '2026-07-15',
  },
  {
    id: 'southindian',
    bankName: 'South Indian Bank',
    category: 'General Institution',
    status: '🔴 Not Verified',
    scheme: 'SIB Excellence',
    maxLoanLakh: 20,
    collateral: 'Not Verified — Contact Bank',
    source: 'Not Verified — Contact Bank',
    lastVerified: 'N/A',
  },
  {
    id: 'boi',
    bankName: 'Bank of India',
    category: 'Eligible Institution',
    status: '🟡 Eligibility Depends on Bank/Branch',
    scheme: 'Star Educational Loan',
    maxLoanLakh: 20,
    collateral: 'Standard IBA rules apply',
    source: 'BoI Portal',
    lastVerified: '2026-02-18',
  },
  {
    id: 'bom',
    bankName: 'Bank of Maharashtra',
    category: 'General Institution',
    status: '🔴 Not Verified',
    scheme: 'Maha Scholar',
    maxLoanLakh: 20,
    collateral: 'Not Verified — Contact Bank',
    source: 'Not Verified — Contact Bank',
    lastVerified: 'N/A',
  },
  {
    id: 'uco',
    bankName: 'UCO Bank',
    category: 'General Institution',
    status: '🔴 Not Verified',
    scheme: 'UCO Education Loan',
    maxLoanLakh: 20,
    collateral: 'Not Verified — Contact Bank',
    source: 'Not Verified — Contact Bank',
    lastVerified: 'N/A',
  },
  {
    id: 'iob',
    bankName: 'Indian Overseas Bank',
    category: 'General Institution',
    status: '🔴 Not Verified',
    scheme: 'Vidya Jyoti',
    maxLoanLakh: 20,
    collateral: 'Not Verified — Contact Bank',
    source: 'Not Verified — Contact Bank',
    lastVerified: 'N/A',
  },
  {
    id: 'psb',
    bankName: 'Punjab & Sind Bank',
    category: 'General Institution',
    status: '🔴 Not Verified',
    scheme: 'PSB Education Loan',
    maxLoanLakh: 20,
    collateral: 'Not Verified — Contact Bank',
    source: 'Not Verified — Contact Bank',
    lastVerified: 'N/A',
  },
  {
    id: 'karur',
    bankName: 'Karur Vysya Bank',
    category: 'General Institution',
    status: '🔴 Not Verified',
    scheme: 'KVB Education Loan',
    maxLoanLakh: 20,
    collateral: 'Not Verified — Contact Bank',
    source: 'Not Verified — Contact Bank',
    lastVerified: 'N/A',
  },
  {
    id: 'karnataka',
    bankName: 'Karnataka Bank',
    category: 'General Institution',
    status: '🔴 Not Verified',
    scheme: 'KBL VidyAnidhi',
    maxLoanLakh: 20,
    collateral: 'Not Verified — Contact Bank',
    source: 'Not Verified — Contact Bank',
    lastVerified: 'N/A',
  },
  {
    id: 'jkb',
    bankName: 'J&K Bank',
    category: 'General Institution',
    status: '🔴 Not Verified',
    scheme: 'J&K Bank Education Loan',
    maxLoanLakh: 20,
    collateral: 'Not Verified — Contact Bank',
    source: 'Not Verified — Contact Bank',
    lastVerified: 'N/A',
  },
  {
    id: 'hdfccredila',
    bankName: 'HDFC Credila',
    category: 'Preferred NBFC',
    status: '🟢 Verified — VIT Bhopal Listed',
    scheme: 'Credila Education Loan',
    maxLoanLakh: 'Need-based',
    collateral: 'No Collateral upto ₹40 Lakhs',
    source: 'Credila Official List',
    lastVerified: '2026-09-05',
  },
  {
    id: 'avanse',
    bankName: 'Avanse Financial',
    category: 'Preferred NBFC',
    status: '🟢 Verified — VIT Bhopal Listed',
    scheme: 'Avanse Education Loan',
    maxLoanLakh: 'Need-based',
    collateral: 'No Collateral upto ₹30 Lakhs',
    source: 'Avanse Verified Colleges',
    lastVerified: '2026-09-15',
  },
  {
    id: 'incred',
    bankName: 'InCred',
    category: 'General NBFC',
    status: '🟡 Eligibility Depends on Bank/Branch',
    scheme: 'InCred Education Loan',
    maxLoanLakh: 40,
    collateral: 'Case by case',
    source: 'InCred portal',
    lastVerified: '2026-08-20',
  },
  {
    id: 'auxilo',
    bankName: 'Auxilo',
    category: 'Preferred NBFC',
    status: '🟡 Eligibility Depends on Bank/Branch',
    scheme: 'Auxilo Education Loan',
    maxLoanLakh: 'Need-based',
    collateral: 'Unsecured upto 30 Lakhs',
    source: 'Auxilo Institutions List',
    lastVerified: '2026-08-22',
  },
];


export const EligibleBanksView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filters = [
    'All',
    'Verified',
    'Preferred Institution',
    'Eligible Institution',
    'Requires Bank Confirmation',
  ];

  const filteredBanks = useMemo(() => {
    const results = ELIGIBLE_BANKS.filter((bank) => {
      const matchesSearch = bank.bankName.toLowerCase().includes(searchQuery.toLowerCase()) || bank.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (activeFilter === 'Verified') {
        matchesFilter = bank.status.includes('🟢 Verified');
      } else if (activeFilter === 'Preferred Institution') {
        matchesFilter = bank.category.toLowerCase().includes('preferred') || bank.category.toLowerCase().includes('scholar') || bank.category.toLowerCase().includes('premier');
      } else if (activeFilter === 'Eligible Institution') {
        matchesFilter = bank.category.toLowerCase().includes('eligible') || bank.category.toLowerCase().includes('general');
      } else if (activeFilter === 'Requires Bank Confirmation') {
        matchesFilter = bank.status.includes('🟡 Eligibility') || bank.status.includes('🔴 Not Verified');
      }

      return matchesSearch && matchesFilter;
    });

    const getScore = (b: BankListStatus) => b.status.includes('🟢 Verified') ? 0 : (b.status.includes('🟡 Eligibility') ? 1 : 2);
    
    return results.sort((a, b) => getScore(a) - getScore(b));
  }, [searchQuery, activeFilter]);

  return (
    <div className="space-y-8">
        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search institution/bank..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={clsx(
                    'whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                    activeFilter === filter
                      ? 'bg-brand-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bank Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBanks.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              No banks found matching your search and filter criteria.
            </div>
          ) : (
            filteredBanks.map((bank) => (
              <Card key={bank.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">{bank.bankName}</CardTitle>
                      <p className="text-sm font-semibold text-brand-700 mt-1">{bank.category}</p>
                    </div>
                    {bank.status.includes('🟢 Verified') && <VerifiedBadge status="verified" size="sm" lastVerified={bank.lastVerified} />}
                  </div>
                </CardHeader>
                <CardContent className="pt-5 space-y-5">
                  <div className="p-3.5 rounded-xl border flex items-center gap-3 bg-white">
                    {bank.status.includes('🟢') && <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />}
                    {bank.status.includes('🟡') && <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />}
                    {bank.status.includes('🔴') && <XCircle className="h-6 w-6 text-rose-500 shrink-0" />}
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">VIT Bhopal Status</p>
                      <p className={clsx(
                        'text-sm font-bold',
                        bank.status.includes('🟢') ? 'text-emerald-700' : bank.status.includes('🟡') ? 'text-amber-700' : 'text-rose-700'
                      )}>
                        {bank.status}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Applicable Loan Scheme</p>
                      <p className="font-semibold text-slate-900">{bank.scheme}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Maximum Loan Amount</p>
                      <p className="font-semibold text-slate-900">
                        {typeof bank.maxLoanLakh === 'number' ? `₹${bank.maxLoanLakh} Lakhs` : bank.maxLoanLakh}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-slate-500 text-xs mb-1">Collateral Requirement</p>
                      <p className="font-semibold text-slate-900">{bank.collateral}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-slate-500 text-xs mb-1">Source</p>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-slate-700">{bank.source}</span>
                        {bank.source !== 'Not Verified — Contact Bank' && (
                          <ExternalLink className="h-3 w-3 text-brand-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      Last Verified: <span className="font-medium text-slate-600">{bank.lastVerified}</span>
                    </p>
                    <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Disclaimer:</strong> Being listed as an eligible or preferred institution does not guarantee loan approval. Final sanction, interest rate, collateral requirement and loan amount are subject to the bank's current policies and the student's eligibility.
          </p>
        </div>
    </div>
  );
};
