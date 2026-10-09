import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EligibleBanksView } from '@/components/loans/EligibleBanksView';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from 'recharts';
import {
  Building2,
  CheckCircle2,
  X,
  TrendingDown,
  ShieldCheck,
  Clock,
  Banknote,
  ChevronDown,
  Star,
  AlertCircle,
  ExternalLink,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { clsx } from 'clsx';

<<<<<<< Updated upstream
export const ComparePage = () => {
  const [loanTypes, setLoanTypes] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [loanProducts, setLoanProducts] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('EDUCATION');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const [loanAmount, setLoanAmount] = useState(100000);
  const [tenureMonths, setTenureMonths] = useState(60);

  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
=======
/* ─── Static bank dataset ─────────────────────────────────────────────────── */
interface BankData {
  id: string;
  bank: string;
  scheme: string;
  shortName: string;
  color: string;
  hexColor: string;
  minRate: number;
  maxRate: number;
  maxLoanLakh: number;
  collateralFreeUptoLakh: number;
  marginPercent: number;
  moratoriumMonths: number;
  maxTenureYears: number;
  processingFeePct: number;
  girlConcessionBps: number;
  cgfselCover: boolean;
  pmVidyalaxmi: boolean;
  sectionEighty: boolean;
  prepaymentPenalty: boolean;
  processingDayMin: number;
  processingDayMax: number;
  officialUrl: string;
  note: string;
  totalLoansGiven?: number;
  outstandingAmountCrores?: number;
  yearWiseApplications?: { year: string; count: number }[];
  stateWiseApplications?: { state: string; count: number }[];
}


const BANKS: BankData[] = [
  {
    id: 'sbi',
    bank: 'State Bank of India',
    scheme: 'SBI Student Loan Scheme',
    shortName: 'SBI',
    color: 'blue',
    hexColor: '#1D4ED8',
    minRate: 8.50, maxRate: 10.15,
    maxLoanLakh: 50,
    collateralFreeUptoLakh: 7.5,
    marginPercent: 5,
    moratoriumMonths: 60,
    maxTenureYears: 15,
    processingFeePct: 0,
    girlConcessionBps: 50,
    cgfselCover: true,
    pmVidyalaxmi: true,
    sectionEighty: true,
    prepaymentPenalty: false,
    processingDayMin: 14, processingDayMax: 21,
    officialUrl: 'https://sbi.co.in/web/student-platform/student-loan-scheme',
    note: 'Standard education loan for recognized universities',
    totalLoansGiven: 850000,
    outstandingAmountCrores: 12500,
    yearWiseApplications: [{"year":"2021","count":180000},{"year":"2022","count":210000},{"year":"2023","count":240000}],
    stateWiseApplications: [{"state":"MP","count":45000},{"state":"MH","count":60000},{"state":"DL","count":30000}],
  },
  {
    id: 'canara',
    bank: 'Canara Bank',
    scheme: 'Canara Education Loan',
    shortName: 'Canara',
    color: 'emerald',
    hexColor: '#059669',
    minRate: 9.35, maxRate: 11.25,
    maxLoanLakh: 0,
    collateralFreeUptoLakh: 7.5,
    marginPercent: 5,
    moratoriumMonths: 60,
    maxTenureYears: 15,
    processingFeePct: 0,
    girlConcessionBps: 50,
    cgfselCover: true,
    pmVidyalaxmi: true,
    sectionEighty: true,
    prepaymentPenalty: false,
    processingDayMin: 7, processingDayMax: 15,
    officialUrl: 'https://canarabank.com/User_page.aspx?othlink=375',
    note: 'Need-based maximum, CSIS nodal bank',
    totalLoansGiven: 420000,
    outstandingAmountCrores: 6200,
    yearWiseApplications: [{"year":"2021","count":90000},{"year":"2022","count":110000},{"year":"2023","count":130000}],
    stateWiseApplications: [{"state":"MP","count":20000},{"state":"KA","count":40000},{"state":"MH","count":25000}],
  },
  {
    id: 'pnb',
    bank: 'Punjab National Bank',
    scheme: 'PNB Saraswati',
    shortName: 'PNB',
    color: 'amber',
    hexColor: '#D97706',
    minRate: 8.90, maxRate: 10.30,
    maxLoanLakh: 100,
    collateralFreeUptoLakh: 7.5,
    marginPercent: 5,
    moratoriumMonths: 60,
    maxTenureYears: 15,
    processingFeePct: 0,
    girlConcessionBps: 50,
    cgfselCover: true,
    pmVidyalaxmi: true,
    sectionEighty: true,
    prepaymentPenalty: false,
    processingDayMin: 10, processingDayMax: 25,
    officialUrl: 'https://www.pnbindia.in/education-loan.html',
    note: 'Robust coverage for recognized domestic courses',
    totalLoansGiven: 510000,
    outstandingAmountCrores: 7800,
    yearWiseApplications: [{"year":"2021","count":110000},{"year":"2022","count":130000},{"year":"2023","count":145000}],
    stateWiseApplications: [{"state":"PB","count":35000},{"state":"MP","count":18000},{"state":"UP","count":40000}],
  },
  {
    id: 'union',
    bank: 'Union Bank of India',
    scheme: 'Union Education Loan',
    shortName: 'Union',
    color: 'purple',
    hexColor: '#7C3AED',
    minRate: 9.30, maxRate: 10.50,
    maxLoanLakh: 0,
    collateralFreeUptoLakh: 7.5,
    marginPercent: 5,
    moratoriumMonths: 60,
    maxTenureYears: 15,
    processingFeePct: 0,
    girlConcessionBps: 50,
    cgfselCover: true,
    pmVidyalaxmi: true,
    sectionEighty: true,
    prepaymentPenalty: false,
    processingDayMin: 10, processingDayMax: 20,
    officialUrl: 'https://www.unionbankofindia.co.in/english/Education-Loan.aspx',
    note: 'Strong presence in Madhya Pradesh region',
    totalLoansGiven: 380000,
    outstandingAmountCrores: 5400,
    yearWiseApplications: [{"year":"2021","count":85000},{"year":"2022","count":95000},{"year":"2023","count":110000}],
    stateWiseApplications: [{"state":"MH","count":30000},{"state":"MP","count":25000},{"state":"UP","count":22000}],
  },
  {
    id: 'bob',
    bank: 'Bank of Baroda',
    scheme: 'Baroda Gyan',
    shortName: 'BoB',
    color: 'orange',
    hexColor: '#EA580C',
    minRate: 8.85, maxRate: 10.45,
    maxLoanLakh: 125,
    collateralFreeUptoLakh: 7.5,
    marginPercent: 5,
    moratoriumMonths: 60,
    maxTenureYears: 15,
    processingFeePct: 0,
    girlConcessionBps: 50,
    cgfselCover: true,
    pmVidyalaxmi: true,
    sectionEighty: true,
    prepaymentPenalty: false,
    processingDayMin: 12, processingDayMax: 18,
    officialUrl: 'https://www.bankofbaroda.in/personal-banking/loans/education-loan/baroda-gyan',
    note: 'High limit for domestic studies, 0.5% prompt serving concession',
    totalLoansGiven: 490000,
    outstandingAmountCrores: 7100,
    yearWiseApplications: [{"year":"2021","count":105000},{"year":"2022","count":125000},{"year":"2023","count":140000}],
    stateWiseApplications: [{"state":"GJ","count":45000},{"state":"MP","count":15000},{"state":"MH","count":35000}],
  },
  {
    id: 'axis',
    bank: 'Axis Bank',
    scheme: 'Axis Bank Education Loan',
    shortName: 'Axis',
    color: 'rose',
    hexColor: '#E11D48',
    minRate: 11.00, maxRate: 14.00,
    maxLoanLakh: 75,
    collateralFreeUptoLakh: 7.5,
    marginPercent: 15,
    moratoriumMonths: 60,
    maxTenureYears: 15,
    processingFeePct: 1,
    girlConcessionBps: 0,
    cgfselCover: false,
    pmVidyalaxmi: false,
    sectionEighty: true,
    prepaymentPenalty: true,
    processingDayMin: 7, processingDayMax: 10,
    officialUrl: 'https://www.axisbank.com/retail/loans/education-loan',
    note: 'Private bank, higher rates but faster approval',
    totalLoansGiven: 210000,
    outstandingAmountCrores: 3500,
    yearWiseApplications: [{"year":"2021","count":45000},{"year":"2022","count":60000},{"year":"2023","count":75000}],
    stateWiseApplications: [{"state":"MH","count":25000},{"state":"DL","count":15000},{"state":"KA","count":18000}],
  },
  {
    id: 'hdfc',
    bank: 'HDFC Bank',
    scheme: 'HDFC Education Loan',
    shortName: 'HDFC',
    color: 'blue',
    hexColor: '#1d4ed8',
    minRate: 10.50, maxRate: 12.50,
    maxLoanLakh: 50,
    collateralFreeUptoLakh: 7.5,
    marginPercent: 5,
    moratoriumMonths: 60,
    maxTenureYears: 15,
    processingFeePct: 1,
    girlConcessionBps: 0,
    cgfselCover: false,
    pmVidyalaxmi: false,
    sectionEighty: true,
    prepaymentPenalty: false,
    processingDayMin: 5, processingDayMax: 10,
    officialUrl: 'https://www.hdfcbank.com/personal/borrow/popular-loans/educational-loan',
    note: 'Fast processing, door-step service',
    totalLoansGiven: 310000,
    outstandingAmountCrores: 5200,
    yearWiseApplications: [{"year":"2021","count":70000},{"year":"2022","count":85000},{"year":"2023","count":105000}],
    stateWiseApplications: [{"state":"MH","count":35000},{"state":"DL","count":20000},{"state":"KA","count":25000}],
  },
  {
    id: 'icici',
    bank: 'ICICI Bank',
    scheme: 'ICICI Education Loan',
    shortName: 'ICICI',
    color: 'orange',
    hexColor: '#f97316',
    minRate: 9.50, maxRate: 13.00,
    maxLoanLakh: 100,
    collateralFreeUptoLakh: 7.5,
    marginPercent: 15,
    moratoriumMonths: 60,
    maxTenureYears: 12,
    processingFeePct: 1,
    girlConcessionBps: 0,
    cgfselCover: false,
    pmVidyalaxmi: false,
    sectionEighty: true,
    prepaymentPenalty: false,
    processingDayMin: 7, processingDayMax: 12,
    officialUrl: 'https://www.icicibank.com/personal-banking/loans/education-loan',
    note: 'Comprehensive coverage for tuition and living expenses',
    totalLoansGiven: 280000,
    outstandingAmountCrores: 4800,
    yearWiseApplications: [{"year":"2021","count":65000},{"year":"2022","count":80000},{"year":"2023","count":95000}],
    stateWiseApplications: [{"state":"MH","count":32000},{"state":"KA","count":22000},{"state":"DL","count":18000}],
  },
  {
    id: 'idfc',
    bank: 'IDFC FIRST Bank',
    scheme: 'IDFC FIRST Education Loan',
    shortName: 'IDFC',
    color: 'rose',
    hexColor: '#be123c',
    minRate: 9.50, maxRate: 11.50,
    maxLoanLakh: 50,
    collateralFreeUptoLakh: 7.5,
    marginPercent: 0,
    moratoriumMonths: 60,
    maxTenureYears: 15,
    processingFeePct: 1,
    girlConcessionBps: 0,
    cgfselCover: false,
    pmVidyalaxmi: false,
    sectionEighty: true,
    prepaymentPenalty: false,
    processingDayMin: 3, processingDayMax: 7,
    officialUrl: 'https://www.idfcfirstbank.com/personal-banking/loans/education-loan',
    note: 'Zero margin money, fully digital application process',
    totalLoansGiven: 120000,
    outstandingAmountCrores: 1900,
    yearWiseApplications: [{"year":"2021","count":20000},{"year":"2022","count":35000},{"year":"2023","count":50000}],
    stateWiseApplications: [{"state":"MH","count":15000},{"state":"KA","count":10000},{"state":"TN","count":8000}],
  }
];
>>>>>>> Stashed changes

  const colors = ['#2563eb', '#16a34a', '#dc2626', '#eab308', '#9333ea', '#0891b2', '#ea580c'];

<<<<<<< Updated upstream
  useEffect(() => {
    // Fetch loan types and initial products
    const init = async () => {
      try {
        const typesRes = await fetch('http://localhost:5000/api/dataset/loan-types').then(res => res.json());
        const productsRes = await fetch('http://localhost:5000/api/dataset/products/education').then(res => res.json());
        
        setLoanTypes(typesRes?.data || []);
        setLoanProducts(productsRes?.data || []);
        
        // Select first 3 by default
        if (productsRes?.data?.length > 0) {
           setSelectedProducts(productsRes.data.slice(0, 3).map((p: any) => p.loan_product_id));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
=======
const EMI_LOAN = 1200000; // ₹12L for EMI comparison
const EMI_TENURE = 120;   // 10 years post moratorium

const calcEMI = (p: number, ratePercent: number, n: number) => {
  const r = ratePercent / 12 / 100;
  return r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

/* ─── Custom tooltip ──────────────────────────────────────────────────────── */
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs space-y-1 min-w-[160px]">
      <p className="font-bold text-slate-800 mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.color }} className="font-medium">{p.name}</span>
          <span className="font-bold text-slate-900">{typeof p.value === 'number' ? `${p.value}%` : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const CustomEMITooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs space-y-1.5 min-w-[180px]">
      <p className="font-bold text-slate-800 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.color }} className="font-medium">{p.name}</span>
          <span className="font-bold text-slate-900">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
export const ComparePage: React.FC = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const [selected, setSelected] = useState<Set<string>>(new Set(['sbi', 'canara', 'pnb']));
  const [dropdownValue, setDropdownValue] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'compare' | 'eligible'>('compare');

  const toggleBank = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size <= 2) return prev; // keep minimum 2
        next.delete(id);
      } else {
        if (next.size >= 5) return prev; // max 5
        next.add(id);
>>>>>>> Stashed changes
      }
    };
    init();
  }, []);

  const fetchProducts = async (type: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/dataset/products/${type.toLowerCase()}`).then(res => res.json());
      setLoanProducts(res?.data || []);
      if (res?.data?.length > 0) {
         setSelectedProducts(res.data.slice(0, 3).map((p: any) => p.loan_product_id));
      } else {
         setSelectedProducts([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    fetchProducts(type);
  };

<<<<<<< Updated upstream
  const toggleProduct = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };
=======
  const globalRateChartData = useMemo(() => {
    return [...BANKS]
      .sort((a, b) => a.minRate - b.minRate)
      .map((b) => ({
        name: b.shortName,
        'Min Rate': b.minRate,
        'Max Rate': b.maxRate,
        color: b.hexColor
      }));
  }, []);
  
  /* ── Chart data ── */
  const rateChartData = useMemo(() =>
    activeBanks.map((b) => ({
      name: b.shortName,
      'Min Rate': b.minRate,
      'Max Rate': b.maxRate,
      'Avg Rate': avg(b.minRate, b.maxRate),
    })),
    [activeBanks]
  );
>>>>>>> Stashed changes

  useEffect(() => {
    if (selectedProducts.length === 0) {
      setComparisonData([]);
      return;
    }
    
    const fetchComparison = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dataset/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            loanProductIds: selectedProducts,
            loanAmount,
            tenureMonths
          })
        }).then(res => res.json());
        setComparisonData(res?.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchComparison();
  }, [selectedProducts, loanAmount, tenureMonths]);

  if (isLoading && loanTypes.length === 0) {
    return <div className="p-10 text-center">Loading comparison data...</div>;
  }

<<<<<<< Updated upstream
  // Formatting for Radar
  const radarData = [
    { metric: 'Eligibility Score' },
    { metric: 'Customer XP' },
    { metric: 'Low Interest' },
    { metric: 'Low Fees' }
=======
  /* ── Table rows ── */
  const tableRows = [
    { label: 'Bank', icon: Building2, render: (b: BankData) => <span className="font-semibold text-slate-900">{b.bank}</span> },
    { label: 'Scheme Name', icon: Star, render: (b: BankData) => <span className="text-slate-700">{b.scheme}</span> },
    { label: 'Interest Rate (p.a.)', icon: TrendingDown, render: (b: BankData) => (
      <div>
        <span className="font-bold text-slate-900">{b.minRate}%</span>
        <span className="text-slate-400 mx-1">–</span>
        <span className="font-bold text-slate-900">{b.maxRate}%</span>
        {b.minRate === Math.min(...activeBanks.map(x => x.minRate)) && (
          <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full" title="Lowest listed interest rate. Actual rate depends on profile.">Lowest listed rate</span>
        )}
      </div>
    )},
    { label: 'Max Loan Amount', icon: Banknote, render: (b: BankData) => (
      <span className={clsx('font-semibold', b.maxLoanLakh === Math.max(...activeBanks.map(x => x.maxLoanLakh)) && 'text-brand-700')}>
        {fmtLakh(b.maxLoanLakh)}
      </span>
    )},
    { label: 'Collateral Free Upto', icon: ShieldCheck, render: (b: BankData) => (
      <span className="font-semibold text-emerald-700">₹{b.collateralFreeUptoLakh}L</span>
    )},
    { label: 'Margin Money (above ₹4L)', icon: Banknote, render: (b: BankData) => (
      <span className={clsx('font-semibold', b.marginPercent === 0 ? 'text-emerald-700' : 'text-slate-700')}>{b.marginPercent}%</span>
    )},
    { label: 'Moratorium Period', icon: Clock, render: (b: BankData) => `Course + 1 year` },
    { label: 'Max Repayment Tenure', icon: Clock, render: (b: BankData) => `${b.maxTenureYears} years` },
    { label: 'Processing Fee', icon: Banknote, render: (b: BankData) => (
      <span className={clsx('font-semibold', b.processingFeePct === 0 ? 'text-emerald-700' : 'text-amber-700')}>
        {b.processingFeePct === 0 ? 'Nil' : `${b.processingFeePct}%`}
      </span>
    )},
    { label: 'Girl Student Discount', icon: Star, render: (b: BankData) => (
      b.girlConcessionBps > 0
        ? <span className="flex items-center gap-1 text-emerald-700 font-semibold"><CheckCircle2 className="h-3.5 w-3.5" />−{b.girlConcessionBps / 100}% p.a.</span>
        : <span className="text-slate-400">—</span>
    )},
    { label: 'CGFSEL Cover', icon: ShieldCheck, render: (b: BankData) => (
      b.cgfselCover
        ? <span className="flex items-center gap-1 text-emerald-700 font-semibold"><CheckCircle2 className="h-3.5 w-3.5" />Yes</span>
        : <span className="flex items-center gap-1 text-rose-600"><X className="h-3.5 w-3.5" />No</span>
    )},
    { label: 'PM-Vidyalaxmi', icon: Sparkles, render: (b: BankData) => (
      b.pmVidyalaxmi
        ? <span className="flex items-center gap-1 text-emerald-700 font-semibold"><CheckCircle2 className="h-3.5 w-3.5" />Eligible</span>
        : <span className="flex items-center gap-1 text-slate-400"><X className="h-3.5 w-3.5" />Not listed</span>
    )},
    { label: 'Sec 80E Tax Benefit', icon: CheckCircle2, render: (b: BankData) => (
      <span className="flex items-center gap-1 text-emerald-700 font-semibold"><CheckCircle2 className="h-3.5 w-3.5" />Yes</span>
    )},
    { label: 'Prepayment Penalty', icon: AlertCircle, render: (b: BankData) => (
      b.prepaymentPenalty
        ? <span className="flex items-center gap-1 text-amber-700"><AlertCircle className="h-3.5 w-3.5" />Applicable</span>
        : <span className="flex items-center gap-1 text-emerald-700 font-semibold"><CheckCircle2 className="h-3.5 w-3.5" />None</span>
    )},
    { label: 'Avg Processing Time', icon: Clock, render: (b: BankData) => (
      <span className={clsx('font-semibold', b.processingDayMax === Math.min(...activeBanks.map(x => x.processingDayMax)) && 'text-brand-700')}>
        {b.processingDayMin}–{b.processingDayMax} days
      </span>
    )},
    { label: 'EMI on ₹12L / 10yr (min rate)', icon: TrendingDown, render: (b: BankData) => (
      <span className="font-bold text-slate-900">{fmt(calcEMI(EMI_LOAN, b.minRate, EMI_TENURE))}/mo</span>
    )},
    { label: 'Total Loans Given', icon: BarChart3, render: (b: BankData) => (
      <span className="font-semibold text-slate-800">{b.totalLoansGiven ? b.totalLoansGiven.toLocaleString() : 'N/A'}</span>
    )},
    { label: 'Outstanding Amount (Crores)', icon: BarChart3, render: (b: BankData) => (
      <span className="font-semibold text-slate-800">{b.outstandingAmountCrores ? `₹${b.outstandingAmountCrores.toLocaleString()} Cr` : 'N/A'}</span>
    )},
>>>>>>> Stashed changes
  ];
  
  if (comparisonData.length > 0) {
      radarData.forEach(r => {
         comparisonData.forEach(d => {
             if (r.metric === 'Eligibility Score') r[d.bankName] = d.eligibilityScore;
             if (r.metric === 'Customer XP') r[d.bankName] = d.customerExperience * 20; // scale to 100
             if (r.metric === 'Low Interest') r[d.bankName] = Math.max(0, 100 - (d.interestRate * 5));
             if (r.metric === 'Low Fees') r[d.bankName] = Math.max(0, 100 - (d.processingFee / loanAmount * 1000));
         });
      });
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <header className="mb-8">
          <Badge variant="brand" className="mb-3">Dynamic Multi-Loan Comparison</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Dataset-Driven Comparison</h1>
          <p className="mt-2 text-slate-600 max-w-2xl text-lg">Compare any loan product dynamically. The graphs below adapt instantly based on factual dataset records.</p>
        </header>

<<<<<<< Updated upstream
        {/* CONTROLS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-wrap gap-2">
            {loanTypes.map((t: any) => (
              <Button 
                key={t.loan_type_id} 
                variant={selectedType === t.loan_type_id ? 'primary' : 'outline'}
                onClick={() => handleTypeChange(t.loan_type_id)}
                size="sm"
              >
                {t.loan_type_name}
              </Button>
=======
      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-vit-navy via-[#0d3166] to-vit-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="verified">100% Impartial</Badge>
            <Badge variant="neutral">Verified Circulars</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Building2 className="h-9 w-9 text-blue-300 shrink-0" />
            Bank Comparison Center
          </h1>
          <p className="text-blue-100/80 text-base max-w-2xl leading-relaxed">
            Select 2–5 banks below to see verified interest rates, EMI projections, feature grids, and a full comparison table. All data sourced from official bank circulars.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* ── Tabs ── */}
        <div className="flex space-x-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-2 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'compare' ? 'border-brand-700 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Compare Banks
          </button>
          <button
            onClick={() => setActiveTab('eligible')}
            className={`px-4 py-2 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'eligible' ? 'border-brand-700 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Eligible Banks
          </button>
        </div>

        {activeTab === 'compare' ? (
          <div className="space-y-12">

        {/* ════════════════════════════════════════════════════════════════
            ALL BANKS INTEREST RATE OVERVIEW
        ════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-5 w-5 text-brand-700" />
                <h2 className="text-xl font-extrabold text-slate-900">All Banks Overview</h2>
              </div>
              <p className="text-sm text-slate-500">
                Sorted by lowest listed interest rate. <span className="font-semibold text-amber-600">Note:</span> The actual rate will depend on your student profile, course, institution, and bank policy.
              </p>
            </div>
            <VerifiedBadge status="verified" lastVerified="2026-09-01" size="sm" />
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={globalRateChartData} margin={{ top: 10, right: 20, left: -20, bottom: 40 }} barGap={2} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} 
                  tickLine={false} 
                  axisLine={{ stroke: '#CBD5E1' }} 
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis domain={[7, 15]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend verticalAlign="top" height={36} formatter={(v) => <span className="text-xs font-medium text-slate-600">{v}</span>} />
                <Bar dataKey="Min Rate" name="Min Rate" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="Max Rate" name="Max Rate" fill="#bae6fd" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            STEP 1: BANK SELECTOR
        ════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Select Banks to Compare</h2>
              <p className="text-sm text-slate-500 mt-0.5">Choose 2–5 banks · {selected.size} selected</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              Min 2, max 5
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <select
                value={dropdownValue}
                onChange={(e) => setDropdownValue(e.target.value)}
                className="flex-1 max-w-sm rounded-xl border border-slate-300 px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select a bank to add...</option>
                {BANKS.filter((b) => !selected.has(b.id)).map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bank} ({b.shortName})
                  </option>
                ))}
              </select>
              <Button
                variant="primary"
                onClick={() => {
                  if (dropdownValue) {
                    toggleBank(dropdownValue);
                    setDropdownValue('');
                  }
                }}
                disabled={!dropdownValue || selected.size >= 5}
              >
                + Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              {activeBanks.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm"
                >
                  <div
                    className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                    style={{ backgroundColor: b.hexColor }}
                  >
                    {b.shortName.slice(0, 2)}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{b.shortName}</span>
                  <button
                    onClick={() => toggleBank(b.id)}
                    className="ml-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            STEP 2: INTEREST RATE BAR CHART
        ════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-5 w-5 text-brand-700" />
                <h2 className="text-lg font-extrabold text-slate-900">Interest Rate Comparison</h2>
              </div>
              <p className="text-sm text-slate-500">Annual percentage rate (p.a.) — lower is better</p>
            </div>
            <VerifiedBadge status="verified" lastVerified="2026-09-01" size="sm" />
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rateChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barGap={4} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} tickLine={false} axisLine={{ stroke: '#CBD5E1' }} />
                <YAxis domain={[7, 15]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend verticalAlign="top" height={36} formatter={(v) => <span className="text-xs font-medium text-slate-600">{v}</span>} />
                <Bar dataKey="Min Rate" name="Min Rate" fill="#1D4ED8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Max Rate" name="Max Rate" fill="#93C5FD" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Rate summary chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {activeBanks.map((b) => (
              <div key={b.id} className="text-center p-3 rounded-xl border border-slate-100 bg-slate-50">
                <div className="h-2.5 w-2.5 rounded-full mx-auto mb-1.5" style={{ backgroundColor: b.hexColor }} />
                <p className="text-xs font-bold text-slate-700">{b.shortName}</p>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{avg(b.minRate, b.maxRate)}%</p>
                <p className="text-[10px] text-slate-400">avg</p>
              </div>
>>>>>>> Stashed changes
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="text-sm font-bold text-slate-700 block mb-2">Loan Amount (₹ {loanAmount.toLocaleString('en-IN')})</label>
               <input type="range" min="10000" max="5000000" step="10000" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} className="w-full" />
             </div>
             <div>
               <label className="text-sm font-bold text-slate-700 block mb-2">Tenure (Months: {tenureMonths})</label>
               <input type="range" min="6" max="360" step="6" value={tenureMonths} onChange={e => setTenureMonths(Number(e.target.value))} className="w-full" />
             </div>
          </div>

          <div>
             <label className="text-sm font-bold text-slate-700 block mb-2">Select Products to Compare (Max 5)</label>
             <div className="flex flex-wrap gap-2">
                {loanProducts.map((p: any) => {
                   const isSelected = selectedProducts.includes(p.loan_product_id);
                   return (
                     <Button 
                       key={p.loan_product_id}
                       variant={isSelected ? 'brand' : 'outline'}
                       size="sm"
                       onClick={() => toggleProduct(p.loan_product_id)}
                       disabled={!isSelected && selectedProducts.length >= 5}
                     >
                       {p.bankName} - {p.product_name}
                     </Button>
                   );
                })}
             </div>
          </div>
        </div>

<<<<<<< Updated upstream
        {selectedProducts.length === 0 ? (
          <div className="p-10 text-center text-slate-500 bg-white rounded-xl border border-slate-200">Please select at least one product to compare.</div>
        ) : (
          <>
            {/* GRAPHS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Interest Rate Comparison */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Interest Rates (%)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="bankName" tick={{fontSize: 12}} />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip />
                      <Bar dataKey="interestRate" fill="#3b82f6" radius={[4,4,0,0]} name="Interest Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Total Interest & Processing Fees */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Total Cost (Interest + Fees)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="bankName" tick={{fontSize: 12}} />
                      <YAxis />
                      <Tooltip formatter={(v: number) => `₹ ${v.toLocaleString('en-IN')}`} />
                      <Legend />
                      <Bar dataKey="totalInterest" stackId="a" fill="#ef4444" name="Total Interest" />
                      <Bar dataKey="processingFee" stackId="a" fill="#f59e0b" name="Processing Fee" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly EMI Comparison */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Monthly EMI</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="bankName" tick={{fontSize: 12}} />
                      <YAxis />
                      <Tooltip formatter={(v: number) => `₹ ${v.toLocaleString('en-IN')}`} />
                      <Line type="monotone" dataKey="emi" stroke="#10b981" strokeWidth={3} dot={{r: 6}} name="Monthly EMI" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Radar Recommendation */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Overall Score Radar</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{fontSize: 12, fill: '#64748b'}} />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      {comparisonData.map((d, i) => (
                         <Radar key={d.id} name={d.bankName} dataKey={d.bankName} stroke={colors[i % colors.length]} fill={colors[i % colors.length]} fillOpacity={0.4} />
                      ))}
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-900">Detailed Comparison</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Parameter</th>
                      {comparisonData.map(d => <th key={d.id} className="px-4 py-3 font-bold text-brand-700">{d.bankName}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-700">Product Name</td>
                      {comparisonData.map(d => <td key={d.id} className="px-4 py-3">{d.productName}</td>)}
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-700">Interest Rate</td>
                      {comparisonData.map(d => <td key={d.id} className="px-4 py-3">{d.interestRate}%</td>)}
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-700">Monthly EMI</td>
                      {comparisonData.map(d => <td key={d.id} className="px-4 py-3 font-bold">₹ {d.emi.toLocaleString('en-IN')}</td>)}
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-700">Total Interest</td>
                      {comparisonData.map(d => <td key={d.id} className="px-4 py-3 text-red-600">₹ {d.totalInterest.toLocaleString('en-IN')}</td>)}
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-700">Processing Fee</td>
                      {comparisonData.map(d => <td key={d.id} className="px-4 py-3">₹ {d.processingFee.toLocaleString('en-IN')}</td>)}
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-700">Customer XP (1-5)</td>
                      {comparisonData.map(d => <td key={d.id} className="px-4 py-3 flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500 fill-current"/> {d.customerExperience}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
=======
          </div>
        ) : (
          <div className="mt-8">
            <EligibleBanksView />
          </div>
>>>>>>> Stashed changes
        )}
      </div>
    </div>
  );
};

export default ComparePage;
