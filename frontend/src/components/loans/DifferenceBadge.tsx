import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface DifferenceBadgeProps {
  status: 'different' | 'same' | 'not_documented';
  className?: string;
}

export const DifferenceBadge: React.FC<DifferenceBadgeProps> = ({ status, className }) => {
  const configs = {
    different: {
      label: 'Different condition',
      classes: 'bg-blue-50 text-blue-800 border-blue-200/90',
    },
    same: {
      label: 'Same documented condition',
      classes: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    not_documented: {
      label: 'Not documented',
      classes: 'bg-amber-50 text-amber-800 border-amber-200/80',
    },
  };

  const current = configs[status] || configs.same;

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border',
          current.classes,
          className
        )
      )}
    >
      {current.label}
    </span>
  );
};
