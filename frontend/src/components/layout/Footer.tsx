import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ExternalLink, ShieldCheck, Landmark } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      {/* Top Banner: Impartiality Statement */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-900/60 border border-brand-700/50 text-brand-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Strict Impartiality & Non-Brokerage Guarantee</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Edu4Loan does not receive commissions, referral fees, or sponsorships from any lending institution. All bank comparisons are purely factual.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>Data Freshness: Verified September 2026</span>
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
            <p className="text-xs leading-relaxed text-slate-400 max-w-md">
              A student-centric, open-access education loan decision-support engine. Designed specifically for VIT Bhopal students navigating tuition fees, hostel expenses, RBI collateral norms, and government subsidies before approaching bank branches.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              <p className="font-semibold text-slate-400 mb-1">Institutional Notice:</p>
              <p>
                Edu4Loan is an independent academic guidance initiative. It is not an official portal of Vellore Institute of Technology (VIT) or any affiliated banking organization.
              </p>
            </div>
          </div>

          {/* Quick Decision Tools */}
          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Guidance Tools</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/finder" className="text-slate-400 hover:text-white transition-colors">
                  Loan Finder Wizard
                </Link>
              </li>
              <li>
                <Link to="/banks" className="text-slate-400 hover:text-white transition-colors">
                  Bank & Scheme Directory
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="text-slate-400 hover:text-white transition-colors">
                  EMI & Moratorium Simulator
                </Link>
              </li>
              <li>
                <Link to="/documents" className="text-slate-400 hover:text-white transition-colors">
                  Personalized Checklist
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-slate-400 hover:text-white transition-colors">
                  Student FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* VIT Bhopal Specifics */}
          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">VIT Bhopal Focus</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/vit-bhopal" className="text-slate-400 hover:text-white transition-colors">
                  Tuition Categories 1 to 5
                </Link>
              </li>
              <li>
                <Link to="/vit-bhopal" className="text-slate-400 hover:text-white transition-colors">
                  Hostel & Mess Breakdown
                </Link>
              </li>
              <li>
                <Link to="/vit-bhopal" className="text-slate-400 hover:text-white transition-colors">
                  Bonafide Estimate SOP
                </Link>
              </li>
              <li>
                <Link to="/vit-bhopal" className="text-slate-400 hover:text-white transition-colors">
                  Campus Bank Helpdesk
                </Link>
              </li>
              <li>
                <Link to="/documents" className="text-slate-400 hover:text-white transition-colors">
                  Disbursement Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Portals (Government & Nodal) */}
          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1">
              <Landmark className="h-3.5 w-3.5 text-brand-400" />
              <span>Official Portals</span>
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.vidyalakshmi.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Vidya Lakshmi Portal</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmvidyalaxmi.education.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>PM-Vidyalaxmi Scheme</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.canarabank.com/csis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>CSIS Subsidy Portal</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ncgtc.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>CGFSEL Guarantee (NCGTC)</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://vitbhopal.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>VIT Bhopal University</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Mandatory Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Edu4Loan. Open Educational Resource. Built for VIT Bhopal Students.</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Interest rates are subject to change by banks at any time.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
