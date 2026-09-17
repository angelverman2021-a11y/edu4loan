import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface VerifiedBadgeProps {
  status?: 'verified' | 'needs_verification' | 'expired';
  source?: string;
  sourceUrl?: string;
  lastVerified?: string | Date;
  size?: 'sm' | 'md';
  showDetails?: boolean;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  status = 'verified',
  source,
  sourceUrl,
  lastVerified,
  size = 'md',
  showDetails = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = lastVerified
    ? new Date(lastVerified).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      })
    : null;

  const config = {
    verified: {
      label: 'Verified Data',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/90 hover:bg-emerald-100/70',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
    },
    needs_verification: {
      label: 'Needs Verification',
      bg: 'bg-amber-50 text-amber-900 border-amber-200/90 hover:bg-amber-100/70',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    expired: {
      label: 'Update Pending',
      bg: 'bg-rose-50 text-rose-800 border-rose-200/90 hover:bg-rose-100/70',
      icon: Clock,
      iconColor: 'text-rose-600',
    },
  };

  const current = config[status] || config.verified;
  const Icon = current.icon;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const hasPopover = Boolean(source || sourceUrl || lastVerified);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => hasPopover && setIsOpen(!isOpen)}
        className={twMerge(
          clsx(
            'inline-flex items-center font-medium rounded-full border transition-colors cursor-pointer select-none',
            current.bg,
            sizeStyles[size],
            className
          )
        )}
        title={source ? `Source: ${source}` : current.label}
      >
        <Icon className={clsx('shrink-0', size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5', current.iconColor)} />
        <span>{current.label}</span>
        {formattedDate && <span className="opacity-75 font-normal">({formattedDate})</span>}
      </button>

      {/* Popover showing authoritative citation */}
      {isOpen && hasPopover && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-1.5 z-50 w-72 rounded-lg bg-white p-3.5 shadow-lg border border-slate-200 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100">
            <div className="font-semibold text-slate-900 mb-1 flex items-center justify-between">
              <span>Source Provenance</span>
              <span
                className={clsx(
                  'px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                  status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                )}
              >
                {status}
              </span>
            </div>

            {source && (
              <p className="text-slate-600 mb-1.5">
                <span className="font-medium text-slate-800">Primary Source: </span>
                {source}
              </p>
            )}

            {lastVerified && (
              <p className="text-slate-500 mb-2">
                <span className="font-medium text-slate-700">Verified On: </span>
                {new Date(lastVerified).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}

            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-700 hover:text-brand-800 font-medium hover:underline pt-1 border-t border-slate-100 w-full"
              >
                <span>View Official Documentation</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
};
