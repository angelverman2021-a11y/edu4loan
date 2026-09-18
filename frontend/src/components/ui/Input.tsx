import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftAddon, rightAddon, className, id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold uppercase tracking-wider text-slate-700">
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative flex rounded-lg shadow-sm">
          {leftAddon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {leftAddon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              clsx(
                'block w-full rounded-lg border bg-white py-2 text-base text-slate-900 placeholder:text-slate-400 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600',
                leftAddon ? 'pl-9' : 'pl-3',
                rightAddon ? 'pr-9' : 'pr-3',
                error ? 'border-rose-400 text-rose-900 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300',
                props.disabled && 'bg-slate-50 text-slate-500 cursor-not-allowed opacity-75',
                className
              )
            )}
            {...props}
          />

          {rightAddon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              {rightAddon}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-rose-600 mt-1">{error}</p>}
        {!error && helperText && <p className="text-sm text-slate-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
