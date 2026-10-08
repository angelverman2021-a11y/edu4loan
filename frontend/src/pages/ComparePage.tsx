import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  }
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmt = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
const fmtLakh = (v: number) => v === 0 ? 'Need-based' : `₹${v}L`;
const avg = (min: number, max: number) => +((min + max) / 2).toFixed(2);

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

  const toggleBank = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size <= 2) return prev; // keep minimum 2
        next.delete(id);
      } else {
        if (next.size >= 5) return prev; // max 5
        next.add(id);
      }
      return next;
    });
  };

  const activeBanks = useMemo(() => BANKS.filter((b) => selected.has(b.id)), [selected]);

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

  const emiChartData = useMemo(() =>
    activeBanks.map((b) => {
      const emiMin = calcEMI(EMI_LOAN, b.minRate, EMI_TENURE);
      const emiMax = calcEMI(EMI_LOAN, b.maxRate, EMI_TENURE);
      return { name: b.shortName, 'Min Rate EMI': Math.round(emiMin), 'Max Rate EMI': Math.round(emiMax) };
    }),
    [activeBanks]
  );

  const radarData = useMemo(() => {
    const metrics = [
      { label: 'Low Rate', fn: (b: BankData) => Math.max(0, 100 - (b.minRate - 7) * 10) },
      { label: 'Max Loan', fn: (b: BankData) => Math.min(100, (b.maxLoanLakh / 80) * 100) },
      { label: 'Speed', fn: (b: BankData) => Math.max(0, 100 - b.processingDayMax * 2) },
      { label: 'Zero Fee', fn: (b: BankData) => b.processingFeePct === 0 ? 100 : 40 },
      { label: 'Girl Discount', fn: (b: BankData) => b.girlConcessionBps > 0 ? 100 : 0 },
      { label: 'CGFSEL', fn: (b: BankData) => b.cgfselCover ? 100 : 0 },
    ];
    return metrics.map((m) => {
      const obj: Record<string, any> = { metric: m.label };
      activeBanks.forEach((b) => { obj[b.shortName] = Math.round(m.fn(b)); });
      return obj;
    });
  }, [activeBanks]);

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
          <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">LOWEST</span>
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
  ];

  const BANK_COLORS = ['#1D4ED8', '#059669', '#D97706', '#7C3AED', '#EA580C', '#E11D48'];
  const colorFor = (i: number) => BANK_COLORS[i % BANK_COLORS.length];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BANKS.map((b) => {
              const isSelected = selected.has(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => toggleBank(b.id)}
                  className={clsx(
                    'relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 text-center transition-all duration-200',
                    isSelected
                      ? 'border-brand-600 bg-brand-50 shadow-md scale-[1.02]'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  )}
                >
                  {/* Color dot */}
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-sm"
                    style={{ backgroundColor: b.hexColor }}>
                    {b.shortName.slice(0, 2)}
                  </div>
                  <div>
                    <p className={clsx('text-xs font-bold leading-tight', isSelected ? 'text-brand-800' : 'text-slate-800')}>
                      {b.shortName}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{b.minRate}%–{b.maxRate}%</p>
                  </div>
                  {/* Checkmark */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-brand-600 flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
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
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            STEP 3: EMI COMPARISON LINE CHART
        ════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-extrabold text-slate-900">Monthly EMI Comparison</h2>
            </div>
            <p className="text-sm text-slate-500">Based on ₹12 Lakh loan · 10-year repayment tenure · post-moratorium EMI</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emiChartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }} barGap={4} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} tickLine={false} axisLine={{ stroke: '#CBD5E1' }} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomEMITooltip />} />
                <Legend verticalAlign="top" height={36} formatter={(v) => <span className="text-xs font-medium text-slate-600">{v}</span>} />
                <Bar dataKey="Min Rate EMI" name="EMI at Min Rate" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Max Rate EMI" name="EMI at Max Rate" fill="#FCA5A5" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <p><strong>Note:</strong> EMIs shown are post-moratorium repayment only. During your B.Tech + 1-year grace period, simple interest accrues on the outstanding principal. Servicing this interest monthly can save ₹1.5–3L in capitalized interest.</p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            STEP 4: RADAR CHART — OVERALL SCORE
        ════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-extrabold text-slate-900">Multi-Dimension Score Card</h2>
            </div>
            <p className="text-sm text-slate-500">Composite score across 6 dimensions — higher area = better overall offering</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94A3B8' }} />
                  {activeBanks.map((b, i) => (
                    <Radar key={b.id} name={b.shortName} dataKey={b.shortName}
                      stroke={colorFor(i)} fill={colorFor(i)} fillOpacity={0.12} strokeWidth={2} />
                  ))}
                  <Legend formatter={(v) => <span className="text-xs font-medium text-slate-600">{v}</span>} />
                  <Tooltip formatter={(v: any) => [`${v}/100`, '']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Dimension legend */}
            <div className="space-y-3">
              {[
                { label: 'Low Rate', desc: 'Lower interest rate = higher score' },
                { label: 'Max Loan', desc: 'Higher loan ceiling = higher score' },
                { label: 'Speed', desc: 'Faster processing = higher score' },
                { label: 'Zero Fee', desc: 'No processing fee = 100' },
                { label: 'Girl Discount', desc: '0.5% girl concession = 100' },
                { label: 'CGFSEL', desc: 'Credit guarantee cover = 100' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-md bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{label}</p>
                    <p className="text-[11px] text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            STEP 5: FULL COMPARISON TABLE
        ════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Detailed Comparison Table</h2>
              <p className="text-sm text-slate-500 mt-0.5">All terms verified from official bank circulars · <span className="text-brand-700 font-semibold">Green</span> = best in category</p>
            </div>
            <VerifiedBadge status="verified" lastVerified="2026-09-01" size="sm" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-44">Parameter</th>
                  {activeBanks.map((b, i) => (
                    <th key={b.id} className="text-center px-4 py-3 min-w-[140px]">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="h-7 w-7 rounded-lg flex items-center justify-center text-white text-[10px] font-extrabold"
                          style={{ backgroundColor: b.hexColor }}>
                          {b.shortName.slice(0, 2)}
                        </div>
                        <span className="text-xs font-bold text-slate-800">{b.shortName}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rowIdx) => {
                  const Icon = row.icon;
                  return (
                    <tr key={row.label} className={clsx('border-b border-slate-100', rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50')}>
                      <td className="px-5 py-3.5 text-xs font-semibold text-slate-600 flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {row.label}
                      </td>
                      {activeBanks.map((b) => (
                        <td key={b.id} className="px-4 py-3.5 text-center text-xs">
                          {row.render(b)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Official links row */}
          <div className="px-6 sm:px-8 py-5 border-t border-slate-100 bg-slate-50">
            <div className="flex flex-wrap gap-3">
              {activeBanks.map((b) => (
                <a key={b.id} href={b.officialUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-900 hover:underline">
                  <ExternalLink className="h-3 w-3" />
                  {b.shortName} Official Circular
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            STEP 6: BANK NOTES + CTA
        ════════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeBanks.map((b, i) => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-extrabold" style={{ backgroundColor: b.hexColor }}>
                  {b.shortName.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{b.bank}</p>
                  <p className="text-xs text-slate-400">{b.scheme}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {b.cgfselCover && <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">CGFSEL ✓</span>}
                {b.pmVidyalaxmi && <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">PM-VL ✓</span>}
                {b.processingFeePct === 0 && <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200">Zero Fee</span>}
                {b.girlConcessionBps > 0 && <span className="text-[10px] font-bold px-2 py-0.5 bg-pink-50 text-pink-700 rounded-full border border-pink-200">Girl −0.5%</span>}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{b.note}</p>
              <a href={b.officialUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="w-full" rightIcon={<ExternalLink className="h-3 w-3" />}>
                  Official Details
                </Button>
              </a>
            </div>
          ))}
        </section>

        {/* Bottom CTA */}
        <div className="text-center space-y-4 py-4">
          <p className="text-sm text-slate-500">Ready to apply? Use the guided finder to get matched to the best scheme for your profile.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/journey"><Button variant="primary" rightIcon={<Building2 className="h-4 w-4" />}>Launch Loan Finder</Button></Link>
            <Link to="/calculator"><Button variant="secondary" rightIcon={<ChevronDown className="h-4 w-4" />}>Open EMI Calculator</Button></Link>
          </div>
        </div>

      </div>
    </div>
  );
};
