import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ExternalLink, ShieldCheck, Landmark } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-base">
      <div className="border-b border-slate-800 bg-slate-950/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-900/60 border border-brand-700/50 text-brand-300">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-white">Non-Brokerage Guarantee:</span> We do not receive commissions from banks.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-brand-700 flex items-center justify-center text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Edu<span className="text-brand-400">4</span>Loan
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800 uppercase">
                VIT Bhopal
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              A student-centric, open-access education loan decision-support engine. Designed specifically for VIT Bhopal students navigating tuition fees, hostel expenses, RBI collateral norms, and government subsidies before approaching bank branches.
            </p>
            <div className="pt-2 text-sm text-slate-500">
              <p className="font-semibold text-slate-400 mb-1">Institutional Notice:</p>
              <p>
                Edu4Loan is an independent academic guidance initiative. It is not an official portal of Vellore Institute of Technology (VIT) or any affiliated banking organization.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8">
            <div>
              <h5 className="font-semibold text-white text-sm uppercase tracking-wider mb-3">Guidance Tools</h5>
              <ul className="space-y-2 text-sm">
                <li><Link to="/finder" className="text-slate-400 hover:text-white transition-colors">Loan Finder</Link></li>
                <li><Link to="/banks" className="text-slate-400 hover:text-white transition-colors">Bank Directory</Link></li>
                <li><Link to="/calculator" className="text-slate-400 hover:text-white transition-colors">EMI Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white text-sm uppercase tracking-wider mb-3 flex items-center gap-1">
                <Landmark className="h-3.5 w-3.5 text-brand-400" />
                <span>Official Portals</span>
              </h5>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.vidyalakshmi.co.in" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1">Vidya Lakshmi <ExternalLink className="h-3 w-3 text-slate-500" /></a></li>
                <li><a href="https://pmvidyalaxmi.education.gov.in" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1">PM-Vidyalaxmi <ExternalLink className="h-3 w-3 text-slate-500" /></a></li>
                <li><a href="https://www.canarabank.com/csis" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1">CSIS Portal <ExternalLink className="h-3 w-3 text-slate-500" /></a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Mandatory Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Edu4Loan. Open Educational Resource. Built for VIT Bhopal Students.</p>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>Interest rates are subject to change by banks at any time.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
