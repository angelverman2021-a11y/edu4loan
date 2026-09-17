import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  Menu,
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
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/context/AuthContext';
import { SearchModal } from './SearchModal';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Loan Discovery', path: '/loans', icon: Compass },
    { name: 'Compare Schemes', path: '/compare', icon: Building2 },
    { name: 'EMI Calculator', path: '/calculator', icon: Calculator },
    { name: 'Eligibility', path: '/eligibility', icon: UserCheck },
    { name: 'Documents', path: '/documents', icon: FileCheck2 },
    { name: 'Tracker', path: '/tracker', icon: Layers },
    { name: 'Govt Schemes', path: '/schemes', icon: Landmark },
    { name: 'VIT Bhopal Guide', path: '/vit-bhopal', icon: BookOpen },
    { name: 'FAQs', path: '/faqs', icon: HelpCircle },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Identity */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="h-10 w-10 rounded-xl bg-vit-navy flex items-center justify-center text-white shadow-sm group-hover:bg-vit-blue transition-colors">
                  <GraduationCap className="h-6 w-6 text-blue-200" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold text-slate-950 tracking-tight">
                      Edu<span className="text-brand-700">4</span>Loan
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 tracking-wide uppercase">
                      VIT Bhopal
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                    Smart Education Loan Decision Support
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={clsx(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50/80 text-brand-800 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side: Global Search + Auth */}
            <div className="flex items-center gap-2.5">
              {/* Search Trigger Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs font-medium transition-colors border border-slate-200/70"
                aria-label="Open search dialog"
              >
                <Search className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden md:inline">Search banks, schemes...</span>
                <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] text-slate-400 bg-white rounded border border-slate-300">
                  ⌘K
                </kbd>
              </button>

              {/* Auth Portal Button / User Menu */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 text-xs font-medium transition-colors"
                  >
                    <User className="h-3.5 w-3.5 text-brand-600" />
                    <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setUserDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 z-40 w-48 rounded-xl bg-white p-1.5 shadow-lg border border-slate-200 text-xs">
                        <div className="px-3 py-2 border-b border-slate-100 mb-1">
                          <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                          <p className="text-slate-500 truncate">{user.email}</p>
                          {user.vitRegistrationNumber && (
                            <p className="text-[10px] font-mono text-brand-700 mt-0.5">
                              {user.vitRegistrationNumber}
                            </p>
                          )}
                        </div>

                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium text-left"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5 text-brand-700" />
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          to="/tracker"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium text-left"
                        >
                          <Layers className="h-3.5 w-3.5 text-brand-700" />
                          <span>Loan Tracker</span>
                        </Link>

                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium text-left"
                        >
                          <Shield className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Admin Console</span>
                        </Link>

                        <div className="my-1 border-t border-slate-100" />

                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors font-medium text-left"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/dashboard">
                    <Button variant="secondary" size="sm" leftIcon={<LayoutDashboard className="h-3.5 w-3.5 text-slate-500" />}>
                      Dashboard
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle main menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-brand-800 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <Icon className={clsx('h-4 w-4', isActive ? 'text-brand-700' : 'text-slate-400')} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                leftIcon={<Search className="h-4 w-4" />}
              >
                Search Database
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
