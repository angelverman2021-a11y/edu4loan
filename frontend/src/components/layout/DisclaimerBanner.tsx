import React, { useState } from 'react';
import { ShieldAlert, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DisclaimerBanner: React.FC = () => {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <div className="bg-navy-900 text-slate-300 text-xs py-1 px-4 flex items-center justify-between border-b border-navy-800">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
          <span>Independent Advisory Notice</span>
        </span>
        <button
          onClick={() => setMinimized(false)}
          className="text-slate-400 hover:text-white underline text-[11px]"
        >
          Show Regulatory Disclosure
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Regulatory Disclaimer" className="bg-navy-950 text-slate-200 border-b border-navy-800/80 px-4 py-2 text-xs relative">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-start sm:items-center gap-2">
          <span className="inline-flex p-1 rounded bg-navy-800 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="h-3.5 w-3.5" />
          </span>
          <p className="leading-snug text-slate-300">
            <strong className="text-white font-semibold">Important Regulatory Disclosure:</strong> Edu4Loan is an independent academic guidance and decision-support platform for VIT Bhopal students. We are <strong>not a lender, bank, or loan broker</strong>. Final sanction, interest rate, and eligibility are at the sole discretion of the respective banks.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-[11px]">
          <Link
            to="/faqs"
            className="inline-flex items-center gap-0.5 text-brand-300 hover:text-white font-medium hover:underline"
          >
            <span>Learn More</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
          <button
            onClick={() => setMinimized(true)}
            className="text-slate-400 hover:text-slate-200 p-0.5 rounded"
            title="Minimize banner"
            aria-label="Minimize disclaimer banner"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
