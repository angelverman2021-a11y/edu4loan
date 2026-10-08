import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  X,
  User,
  LogOut,
  ChevronDown,
  Calculator,
  Compass,
  Building2,
  FileCheck2,
  Landmark,
  BookOpen,
  HelpCircle,
  Layers,
  LayoutDashboard,
  UserCheck,
  Shield,
  BarChart3,
  Users,
  Sparkles,
  ArrowRight,
  ExternalLink,
  PanelLeftOpen,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/context/AuthContext';
import { SearchModal } from './SearchModal';
import { Button } from '@/components/ui/Button';

// ─── All tools shown in the right drawer ────────────────────────────────────
const DRAWER_SECTIONS = [
  {
    label: 'Core Tools',
    items: [
      { name: 'VIT Bhopal Campus Guide', path: '/vit-bhopal', icon: BookOpen, desc: 'Fee tiers, VTOP SOP, contacts' },
      { name: 'Student Loan Finder', path: '/journey', icon: Compass, desc: 'Step-by-step scheme matching' },
      { name: 'Bank & Scheme Explorer', path: '/loans', icon: Building2, desc: 'Browse all loan schemes' },
      { name: 'EMI & Moratorium Calculator', path: '/calculator', icon: Calculator, desc: 'Full repayment simulator' },
      { name: 'Compare Schemes', path: '/compare', icon: Layers, desc: 'Side-by-side comparison' },
    ],
  },
  {
    label: 'Eligibility & Documents',
    items: [
      { name: 'Eligibility Checker', path: '/eligibility', icon: UserCheck, desc: 'FOIR & CIBIL readiness' },
      { name: 'Document Checklist', path: '/documents', icon: FileCheck2, desc: 'Personalized document list' },
      { name: 'Application Tracker', path: '/tracker', icon: Layers, desc: '9-stage loan progress tracker' },
    ],
  },
  {
    label: 'Reference & Guidance',
    items: [
      { name: 'Govt Subsidies & Schemes', path: '/schemes', icon: Landmark, desc: 'CSIS, PM-Vidyalaxmi, Vidya Lakshmi' },
      { name: 'Practical Help Hub', path: '/practical-help', icon: Sparkles, desc: '7 real-world loan tools' },
      { name: 'Bank Statistics', path: '/statistics', icon: BarChart3, desc: 'EBLR rates & SLA data' },
      { name: 'Parent Mode', path: '/parent-mode', icon: Users, desc: 'Multilingual parent guide' },
      { name: 'FAQs', path: '/faqs', icon: HelpCircle, desc: 'Common questions answered' },
    ],
  },
];

// ─── 4 primary links shown in the header ────────────────────────────────────
const PRIMARY_LINKS = [
  { name: 'Compare Banks', path: '/compare', icon: Building2 },
  { name: 'Loan Finder', path: '/journey', icon: Compass },
  { name: 'Calculator', path: '/calculator', icon: Calculator },
  { name: 'Tracker', path: '/tracker', icon: Layers },
  { name: 'Schemes', path: '/schemes', icon: Landmark },
];

export const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [helpdeskOpen, setHelpdeskOpen] = useState(false);
  const [helpdeskExpanded, setHelpdeskExpanded] = useState<'student' | 'bank' | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setDrawerOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <>
      {/* ─── Sticky Navbar ─────────────────────────────────────────────── */}
      <header
        className={clsx(
          'sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b transition-shadow duration-200',
          scrolled ? 'border-slate-200 shadow-md' : 'border-slate-200/60 shadow-none'
        )}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* ── Left Side (Slider + Logo) ── */}
            <div className="flex items-center gap-4 shrink-0">
              {/* ── Slider Icon Trigger ── */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open all tools panel"
                title="All Tools Panel"
                className="flex items-center justify-center h-9 w-9 rounded-lg border-2 border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white transition-all duration-150 shadow-sm"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>

              {/* ── Logo ── */}
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-vit-navy to-vit-blue flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow">
                  <GraduationCap className="h-5 w-5 text-blue-100" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-heading font-extrabold text-slate-950 tracking-tight">
                      Edu<span className="text-brand-700">4</span>Loan
                    </span>
                    <span className="hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 tracking-wide uppercase">
                      VIT Bhopal
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* ── Primary Nav Links (desktop) ── */}
            <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {PRIMARY_LINKS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-brand-700 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    )}
                  >
                    <Icon className={clsx('h-3.5 w-3.5', isActive ? 'text-blue-200' : 'text-slate-400')} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Helpdesk */}
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setHelpdeskOpen(!helpdeskOpen)}
                  
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-brand-700 text-sm font-medium transition-colors border border-blue-200"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  <span>Helpdesk</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {helpdeskOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in slide-in-from-top-2">
                    <div className="px-3 pb-2 mb-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Support</p>
                    </div>

                    <div className="px-2 space-y-1">
                      {/* For Students */}
                      <div className="rounded-lg overflow-hidden border border-transparent hover:border-slate-100 transition-colors">
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setHelpdeskExpanded(helpdeskExpanded === 'student' ? null : 'student'); }}
                          className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-slate-50 text-left"
                        >
                          <span className="text-sm font-medium text-slate-800">For Students</span>
                          <ChevronDown className={clsx("h-3.5 w-3.5 text-slate-400 transition-transform", helpdeskExpanded === 'student' && "rotate-180")} />
                        </button>
                        {helpdeskExpanded === 'student' && (
                          <div className="px-3 pb-3 bg-slate-50 space-y-2">
                            <a href="mailto:students@edu4loan.com" className="flex flex-col p-2 bg-white rounded border border-slate-200 hover:border-brand-300 transition-colors">
                              <span className="text-[10px] text-slate-400 uppercase font-semibold">Email ID</span>
                              <span className="text-xs font-medium text-brand-600">students@edu4loan.com</span>
                            </a>
                            <a href="tel:+919876543210" className="flex flex-col p-2 bg-white rounded border border-slate-200 hover:border-brand-300 transition-colors">
                              <span className="text-[10px] text-slate-400 uppercase font-semibold">Phone Number</span>
                              <span className="text-xs font-medium text-slate-700">+91 98765 43210</span>
                            </a>
                          </div>
                        )}
                      </div>

                      {/* For Banks */}
                      <div className="rounded-lg overflow-hidden border border-transparent hover:border-slate-100 transition-colors">
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setHelpdeskExpanded(helpdeskExpanded === 'bank' ? null : 'bank'); }}
                          className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-slate-50 text-left"
                        >
                          <span className="text-sm font-medium text-slate-800">For Banks / Partners</span>
                          <ChevronDown className={clsx("h-3.5 w-3.5 text-slate-400 transition-transform", helpdeskExpanded === 'bank' && "rotate-180")} />
                        </button>
                        {helpdeskExpanded === 'bank' && (
                          <div className="px-3 pb-3 bg-slate-50 space-y-2">
                            <a href="mailto:banks@edu4loan.com" className="flex flex-col p-2 bg-white rounded border border-slate-200 hover:border-brand-300 transition-colors">
                              <span className="text-[10px] text-slate-400 uppercase font-semibold">Email ID</span>
                              <span className="text-xs font-medium text-brand-600">banks@edu4loan.com</span>
                            </a>
                            <a href="tel:+911234567890" className="flex flex-col p-2 bg-white rounded border border-slate-200 hover:border-brand-300 transition-colors">
                              <span className="text-[10px] text-slate-400 uppercase font-semibold">Phone Number</span>
                              <span className="text-xs font-medium text-slate-700">+91 12345 67890</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Auth */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors"
                  >
                    <User className="h-3.5 w-3.5 text-brand-600" />
                    <span className="hidden sm:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </button>
                  {userDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setUserDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 z-40 w-52 rounded-xl bg-white p-1.5 shadow-xl border border-slate-200 text-sm">
                        <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                          <p className="font-bold text-slate-900 truncate">{user.name}</p>
                          <p className="text-slate-400 truncate text-xs">{user.email}</p>
                        </div>
                        <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
                          <LayoutDashboard className="h-3.5 w-3.5 text-brand-600" /> Dashboard
                        </Link>
                        <Link to="/tracker" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
                          <Layers className="h-3.5 w-3.5 text-brand-600" /> Loan Tracker
                        </Link>
                        <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
                          <Shield className="h-3.5 w-3.5 text-emerald-600" /> Admin
                        </Link>
                        <div className="my-1 border-t border-slate-100" />
                        <button onClick={() => { logout(); setUserDropdownOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-medium">
                          <LogOut className="h-3.5 w-3.5" /> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/dashboard" className="hidden sm:flex">
                  <Button variant="secondary" size="sm" leftIcon={<LayoutDashboard className="h-3.5 w-3.5" />}>
                    Dashboard
                  </Button>
                </Link>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* ─── Left Slide-in Drawer ──────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full z-50 w-[340px] max-w-[92vw] bg-white shadow-2xl flex flex-col',
          'transition-transform duration-300 ease-in-out',
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="All tools navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-vit-navy to-vit-blue text-white">
          <div>
            <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest mb-0.5">Edu4Loan</p>
            <h2 className="text-base font-bold">All Tools & Features</h2>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 text-blue-100 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Helpdesk inside drawer */}
        <div className="px-4 py-3 border-b border-slate-100 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Helpdesk Support</p>
          
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 overflow-hidden">
            <button
              type="button"
              onClick={() => setHelpdeskExpanded(helpdeskExpanded === 'student' ? null : 'student')}
              className="w-full flex items-center justify-between px-3.5 py-3 text-brand-700 text-sm hover:bg-blue-50 transition-colors text-left"
            >
              <span className="font-bold">For Students</span>
              <ChevronDown className={clsx("h-4 w-4 transition-transform", helpdeskExpanded === 'student' && "rotate-180")} />
            </button>
            {helpdeskExpanded === 'student' && (
              <div className="px-3 pb-3 space-y-2 bg-blue-50/30">
                <a href="mailto:students@edu4loan.com" className="flex flex-col p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Email ID</span>
                  <span className="text-xs font-semibold text-brand-700">students@edu4loan.com</span>
                </a>
                <a href="tel:+919876543210" className="flex flex-col p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Phone Number</span>
                  <span className="text-xs font-semibold text-slate-800">+91 98765 43210</span>
                </a>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
            <button
              type="button"
              onClick={() => setHelpdeskExpanded(helpdeskExpanded === 'bank' ? null : 'bank')}
              className="w-full flex items-center justify-between px-3.5 py-3 text-slate-700 text-sm hover:bg-slate-100 transition-colors text-left"
            >
              <span className="font-bold">For Banks / Partners</span>
              <ChevronDown className={clsx("h-4 w-4 transition-transform", helpdeskExpanded === 'bank' && "rotate-180")} />
            </button>
            {helpdeskExpanded === 'bank' && (
              <div className="px-3 pb-3 space-y-2 bg-slate-50/50">
                <a href="mailto:banks@edu4loan.com" className="flex flex-col p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Email ID</span>
                  <span className="text-xs font-semibold text-brand-700">banks@edu4loan.com</span>
                </a>
                <a href="tel:+911234567890" className="flex flex-col p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Phone Number</span>
                  <span className="text-xs font-semibold text-slate-800">+91 12345 67890</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Nav Sections */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
          {DRAWER_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1.5">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
                        isActive
                          ? 'bg-brand-700 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <div className={clsx(
                        'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                        isActive ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-brand-50'
                      )}>
                        <Icon className={clsx('h-4 w-4', isActive ? 'text-white' : 'text-brand-700')} />
                      </div>
                      <div className="min-w-0">
                        <p className={clsx('text-sm font-semibold leading-tight', isActive ? 'text-white' : 'text-slate-800')}>
                          {item.name}
                        </p>
                        <p className={clsx('text-xs leading-tight mt-0.5 truncate', isActive ? 'text-blue-100' : 'text-slate-400')}>
                          {item.desc}
                        </p>
                      </div>
                      <ArrowRight className={clsx('h-3.5 w-3.5 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity', isActive ? 'opacity-100 text-blue-200' : 'text-slate-400')} />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="px-4 py-4 border-t border-slate-100 bg-slate-50 space-y-2">
          <p className="text-[10px] text-slate-400 text-center font-medium">Official external portals</p>
          <div className="flex gap-2">
            <a
              href="https://www.vidyalakshmi.co.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-700 transition-colors"
            >
              Vidya Lakshmi <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://pmvidyalaxmi.education.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-700 transition-colors"
            >
              PM-Vidyalaxmi <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </aside>

      {/* Global Search Dialog */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
