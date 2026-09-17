import React from 'react';
import { Info, AlertTriangle, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface AlertProps {
  variant?: 'info' | 'advisory' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className,
}) => {
  const configs = {
    info: {
      container: 'bg-blue-50/70 border-blue-200 text-blue-950',
      icon: Info,
      iconColor: 'text-brand-600',
    },
    advisory: {
      container: 'bg-amber-50/80 border-amber-200 text-amber-950',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    success: {
      container: 'bg-emerald-50/80 border-emerald-200 text-emerald-950',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    error: {
      container: 'bg-rose-50/80 border-rose-200 text-rose-950',
      icon: AlertCircle,
      iconColor: 'text-rose-600',
    },
  };

  const current = configs[variant];
  const Icon = current.icon;

  return (
    <div
      role="alert"
      className={twMerge(
        clsx(
          'relative flex items-start gap-3 rounded-lg border p-4 text-sm leading-relaxed shadow-xs',
          current.container,
          className
        )
      )}
    >
      <Icon className={clsx('h-5 w-5 shrink-0 mt-0.5', current.iconColor)} />
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-1 text-inherit">{title}</h5>}
        <div className="text-inherit opacity-95">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-1 text-inherit opacity-60 hover:opacity-100 transition-opacity rounded focus:outline-none"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
