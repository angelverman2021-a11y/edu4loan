import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Building2,
  Calculator,
  FileCheck2,
  ShieldCheck,
  ArrowRight,
  Landmark,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
  Users,
  BarChart3,
  BookOpen,
  HelpCircle,
  UserCheck,
  Layers,
  ChevronDown,
  Star,
  TrendingUp,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

/* ─── Helper: animated number counter ─────────────────────────────────── */
const AnimatedNumber: React.FC<{ target: number; prefix?: string; suffix?: string; duration?: number }> = ({
  target, prefix = '', suffix = '', duration = 1800,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
};

/* ─── Quick EMI calc ───────────────────────────────────────────────────── */
const calcEMI = (p: number, r: number, n: number) => {
  const mr = r / 12 / 100;
  if (mr === 0) return p / n;
  return (p * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
};

const formatINR = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(v));

/* ═══════════════════════════════════════════════════════════════════════ */
export const HomePage: React.FC = () => {
  // Always start at the top
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const [loanAmount, setLoanAmount] = useState(1200000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenureYears, setTenureYears] = useState(10);

  const totalMonths = tenureYears * 12;
  const emi = calcEMI(loanAmount, interestRate, totalMonths);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#0B2545] via-[#0d3166] to-[#1a4a8a]">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#ffffff 1px,transparent 1px),linear-gradient(90deg,#ffffff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Glow orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-16">

          {/* Left: copy */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            {/* Trust pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-blue-100">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              Impartial · Non-Brokerage · VIT Bhopal Specific
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
              Navigate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                Education Loan
              </span>
              <br />With Clarity.
            </h1>

            <p className="text-base sm:text-lg text-blue-100/80 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              Compare verified bank schemes, simulate moratorium interest, check RBI collateral limits,
              and review VIT Bhopal fee tiers — all before stepping into a branch.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 pt-2">
              <Link to="/journey">
                <Button size="lg" className="bg-white text-vit-navy hover:bg-blue-50 font-bold shadow-lg hover:shadow-xl transition-shadow" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Launch Loan Finder
                </Button>
              </Link>
              <Link to="/loans">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Browse All Banks
                </Button>
              </Link>
            </div>

            {/* Stat strip */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-sm mx-auto lg:mx-0">
              {[
                { label: 'Bank Schemes', value: 12, suffix: '+' },
                { label: 'Govt Subsidies', value: 4, suffix: '' },
                { label: 'Verified Data', value: 100, suffix: '%' },
              ].map(({ label, value, suffix }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-extrabold text-white">
                    <AnimatedNumber target={value} suffix={suffix} />
                  </div>
                  <div className="text-[11px] text-blue-200/70 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating EMI card */}
          <div className="flex-shrink-0 w-full max-w-sm lg:max-w-[380px]">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white">Quick EMI Preview</p>
                <VerifiedBadge status="verified" lastVerified="2026-09-01" size="sm" />
              </div>

              {/* Loan slider */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Loan Amount</label>
                  <span className="text-xs font-bold text-white">{formatINR(loanAmount)}</span>
                </div>
                <input type="range" min={200000} max={4000000} step={50000} value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-cyan-400" />
              </div>

              {/* Rate slider */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Interest Rate</label>
                  <span className="text-xs font-bold text-white">{interestRate}% p.a.</span>
                </div>
                <input type="range" min={7.5} max={14.0} step={0.1} value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-cyan-400" />
              </div>

              {/* Tenure slider */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Tenure</label>
                  <span className="text-xs font-bold text-white">{tenureYears} yrs</span>
                </div>
                <input type="range" min={5} max={15} step={1} value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-cyan-400" />
              </div>

              {/* Result */}
              <div className="bg-white/15 rounded-2xl p-4 border border-white/20 space-y-2">
                <div className="text-center">
                  <p className="text-xs text-blue-200/70 mb-1">Monthly EMI</p>
                  <p className="text-3xl font-extrabold text-white tracking-tight">{formatINR(emi)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px]">
                  <div className="text-center">
                    <p className="text-blue-200/60">Total Interest</p>
                    <p className="font-bold text-amber-300">{formatINR(totalInterest)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-200/60">Total Outflow</p>
                    <p className="font-bold text-white">{formatINR(totalPayment)}</p>
                  </div>
                </div>
              </div>

              <Link to="/calculator" className="block">
                <button className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-900 text-sm font-bold transition-colors">
                  Open Full Simulator →
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-50">
          <p className="text-[10px] text-blue-200 font-medium tracking-widest uppercase">Scroll to explore</p>
          <ChevronDown className="h-4 w-4 text-blue-200" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — FEATURE PILLARS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <Badge variant="info">Core Capabilities</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Built Specifically For VIT Bhopal Students
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base">
              Every tool is designed to demystify banking jargon and ensure you enter loan negotiations fully prepared.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Building2, color: 'blue', title: 'Unbiased Bank Comparison',
                desc: 'Factual breakdown of SBI, Canara, PNB, Union Bank and leading private lenders with zero sponsored rankings.',
                link: '/loans', cta: 'Browse Banks',
              },
              {
                icon: ShieldCheck, color: 'emerald', title: 'RBI Collateral Intelligence',
                desc: 'Know your rights: No collateral <₹4L, third-party guarantee up to ₹7.5L, tangible security above.',
                link: '/finder', cta: 'Check Your Tier',
              },
              {
                icon: Calculator, color: 'amber', title: 'Moratorium & EMI Simulator',
                desc: 'See how interest accrues during 4 years + 1-year grace and the massive impact of interest capitalization.',
                link: '/calculator', cta: 'Simulate Repayment',
              },
              {
                icon: FileCheck2, color: 'purple', title: 'Personalized Checklist',
                desc: 'Generate a custom dossier of KYC, academic records, co-applicant ITRs and VIT Bhopal bonafide letters.',
                link: '/documents', cta: 'Generate Checklist',
              },
            ].map(({ icon: Icon, color, title, desc, link, cta }) => (
              <div key={title} className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className={`h-12 w-12 rounded-xl mb-4 flex items-center justify-center bg-${color}-50 border border-${color}-100`}>
                  <Icon className={`h-6 w-6 text-${color}-600`} />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{desc}</p>
                <Link to={link} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:text-brand-900 group-hover:gap-2 transition-all">
                  {cta} <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — BANK SCHEMES HIGHLIGHT
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#F8FAFC] border-y border-slate-200/70" id="banks">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <Badge variant="verified" dot className="mb-2">Official Bank Schemes</Badge>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Prominent Education Loan Programs</h2>
              <p className="text-slate-500 mt-1 text-sm max-w-xl">Verified terms from public sector banks actively serving VIT Bhopal students.</p>
            </div>
            <Link to="/loans">
              <Button variant="secondary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>View All 12+ Schemes</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                bank: 'State Bank of India', scheme: 'SBI Scholar Scheme',
                rate: '8.15% – 8.85% p.a.', maxLoan: '₹20,00,000',
                collateral: 'Nil (100% unsecured)', highlight: 'emerald',
                tag: 'Zero Collateral', link: '/loans?bank=sbi',
              },
              {
                bank: 'Canara Bank', scheme: 'Canara Vidya Turan',
                rate: '8.60% – 9.25% p.a.', maxLoan: '₹30,00,000',
                collateral: 'Nil up to ₹7.5 Lakhs', highlight: 'blue',
                tag: 'CSIS Nodal Bank', link: '/loans?bank=canara',
              },
              {
                bank: 'Punjab National Bank', scheme: 'PNB Saraswati',
                rate: '8.80% – 9.80% p.a.', maxLoan: 'Need-based',
                collateral: '5% margin above ₹4L', highlight: 'amber',
                tag: '0.5% Girl Concession', link: '/loans?bank=pnb',
              },
            ].map(({ bank, scheme, rate, maxLoan, collateral, highlight, tag, link }) => (
              <div key={scheme} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden">
                <div className={`h-1.5 w-full bg-${highlight}-500`} />
                <div className="p-6 flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="info">{bank}</Badge>
                    <VerifiedBadge status="verified" lastVerified="2026-09-01" size="sm" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{scheme}</h3>
                    <span className={`inline-flex items-center gap-1 mt-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-${highlight}-50 text-${highlight}-700 border border-${highlight}-200`}>
                      <Star className="h-2.5 w-2.5" /> {tag}
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    {[['Interest Rate', rate], ['Max Loan', maxLoan], ['Collateral', collateral]].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">{k}</span>
                        <span className="font-semibold text-slate-900">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-6 pb-5">
                  <Link to={link} className="block">
                    <Button variant="outline" size="sm" className="w-full">View Scheme Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — TOOLS GRID (full feature set preview)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white" id="tools">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="neutral" className="mb-2">Everything You Need</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Practical Resolution Center</h2>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto text-base">
              From informal income alternatives to 9-stage bank timelines — every real-world challenge covered.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: Compass, label: 'Loan Finder', desc: 'Guided wizard', link: '/journey', hot: true },
              { icon: Layers, label: 'Compare Schemes', desc: 'Up to 4 side-by-side', link: '/compare' },
              { icon: UserCheck, label: 'Eligibility Check', desc: 'FOIR & CIBIL gauge', link: '/eligibility' },
              { icon: Sparkles, label: 'Practical Help', desc: '7 real-world tools', link: '/practical-help', hot: true },
              { icon: BarChart3, label: 'Bank Statistics', desc: 'EBLR & SLA data', link: '/statistics' },
              { icon: Users, label: 'Parent Mode', desc: 'Hindi · Gujarati · Bengali', link: '/parent-mode' },
              { icon: BookOpen, label: 'VIT Bhopal Guide', desc: 'Fee tiers & VTOP SOP', link: '/vit-bhopal' },
              { icon: HelpCircle, label: 'FAQs', desc: 'Common questions', link: '/faqs' },
            ].map(({ icon: Icon, label, desc, link, hot }) => (
              <Link key={link} to={link}
                className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-brand-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center gap-3"
              >
                {hot && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold px-1.5 py-0.5 bg-brand-700 text-white rounded-full uppercase tracking-wider">Hot</span>
                )}
                <div className="h-11 w-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-brand-50 group-hover:border-brand-200 transition-colors">
                  <Icon className="h-5 w-5 text-slate-500 group-hover:text-brand-700 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-brand-800">{label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — GOVERNMENT SUBSIDIES BANNER
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-r from-slate-900 via-[#0d2b5e] to-[#0B2545]" id="subsidies">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: text */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Landmark className="h-3.5 w-3.5" /> Central Government Subsidies
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                Could You Get a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                  100% Interest Waiver?
                </span>
              </h2>
              <p className="text-slate-300 leading-relaxed text-base max-w-xl mx-auto lg:mx-0">
                Families earning up to <strong className="text-white">₹4.5 Lakhs/year</strong> qualify for full moratorium interest subsidy under <strong className="text-white">CSIS</strong>.
                The new <strong className="text-white">PM-Vidyalaxmi scheme</strong> covers loans up to ₹10L with 3% subvention for income ≤ ₹8L.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                <Link to="/schemes">
                  <Button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold shadow-lg">
                    Check Subsidy Eligibility
                  </Button>
                </Link>
                <a href="https://pmvidyalaxmi.education.gov.in" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-slate-300 hover:text-white text-sm font-medium hover:bg-white/10 transition-colors">
                  PM-Vidyalaxmi Portal <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Right: subsidy cards */}
            <div className="flex-shrink-0 w-full max-w-md space-y-4">
              {[
                {
                  code: 'CSIS', name: 'Central Sector Interest Subsidy',
                  income: '≤ ₹4.5 Lakhs/year', benefit: '100% interest waiver during moratorium',
                  accent: 'emerald',
                },
                {
                  code: 'PM-VL', name: 'PM-Vidyalaxmi Scheme 2024',
                  income: '≤ ₹8 Lakhs/year', benefit: '3% interest subvention on loans ≤ ₹10L',
                  accent: 'blue',
                },
                {
                  code: 'VL', name: 'Vidya Lakshmi Portal',
                  income: 'All income levels', benefit: 'Single-window for 40+ bank scheme applications',
                  accent: 'amber',
                },
              ].map(({ code, name, income, benefit, accent }) => (
                <div key={code} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3 hover:bg-white/8 transition-colors">
                  <div className={`h-9 w-9 rounded-lg bg-${accent}-500/20 border border-${accent}-400/30 flex items-center justify-center shrink-0`}>
                    <span className={`text-xs font-extrabold text-${accent}-300`}>{code}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Income: {income}</p>
                    <p className="text-xs text-emerald-300 font-medium mt-1 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> {benefit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6 — VIT BHOPAL GUIDE CALLOUT
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#F8FAFC] border-y border-slate-200/70" id="vit-guide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left */}
              <div className="p-10 lg:p-14 space-y-6 flex flex-col justify-center">
                <Badge variant="neutral">VIT Bhopal Specific SOP</Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Getting Your Bonafide & Fee Estimate Letter
                </h2>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Banks require an official institutional fee estimate detailing Tuition (Category 1–5), Specialization charges,
                  Caution deposits, and Hostel/Mess fees. Learn to generate this via <strong className="text-slate-700">VTOP</strong> and
                  submit to on-campus Indian Bank or SBI Ashta.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['VTOP Letter Generation', 'On-Campus Helpdesk', 'Disbursement Letters', 'Category 1–5 Fees'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <Link to="/vit-bhopal">
                    <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      View VIT Bhopal Campus Guide
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: fee tier preview */}
              <div className="bg-gradient-to-br from-vit-navy to-vit-blue p-10 lg:p-14 flex flex-col justify-center space-y-4">
                <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">B.Tech Fee Tiers</p>
                {[
                  ['Category 1', '₹3,25,000 / year', 'Top VITEEE rank'],
                  ['Category 2', '₹3,75,000 / year', 'Merit based'],
                  ['Category 3', '₹4,05,000 / year', 'Management quota'],
                  ['Category 4–5', '₹4,20,000+ / year', 'Management / NRI'],
                ].map(([cat, fee, note]) => (
                  <div key={cat} className="flex items-center justify-between p-3.5 bg-white/10 rounded-xl border border-white/10">
                    <div>
                      <p className="text-sm font-bold text-white">{cat}</p>
                      <p className="text-xs text-blue-200/60">{note}</p>
                    </div>
                    <span className="text-sm font-extrabold text-cyan-300">{fee}</span>
                  </div>
                ))}
                <p className="text-[10px] text-blue-200/40 text-center pt-2">Approximate figures · verify via VTOP</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7 — WHY TRUST US
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white" id="trust">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Why Edu4Loan?</h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto">Built on principles that put students first — always.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: '100% Neutral', desc: 'Zero commissions from banks. No sponsored rankings. Ever.', color: 'emerald' },
              { icon: TrendingUp, title: 'Primary Sources', desc: 'All data sourced directly from official RBI circulars and bank websites.', color: 'blue' },
              { icon: Zap, title: 'VIT Tailored', desc: 'Category 1–5 fee tiers, VTOP SOP, and on-campus helpdesk contacts built in.', color: 'amber' },
              { icon: Clock, title: 'Always Verified', desc: 'Every scheme carries a last-verified date. No stale data.', color: 'purple' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="text-center space-y-4">
                <div className={`h-14 w-14 rounded-2xl mx-auto flex items-center justify-center bg-${color}-50 border border-${color}-100`}>
                  <Icon className={`h-7 w-7 text-${color}-600`} />
                </div>
                <h3 className="text-base font-bold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8 — CTA FOOTER BAND
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-r from-brand-700 via-brand-800 to-vit-navy">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to find your best loan option?
          </h2>
          <p className="text-blue-200/80 text-base">
            Launch the guided wizard and get matched to verified schemes in under 2 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/journey">
              <Button size="lg" className="bg-white text-vit-navy hover:bg-blue-50 font-bold shadow-lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Start Loan Finder
              </Button>
            </Link>
            <Link to="/calculator">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Open EMI Calculator
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
