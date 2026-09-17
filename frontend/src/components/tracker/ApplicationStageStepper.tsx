import React from 'react';
import {
  FileEdit,
  Send,
  FileQuestion,
  SearchCheck,
  Building2,
  Award,
  CreditCard,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import { ApplicationStage } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface ApplicationStageStepperProps {
  currentStage: ApplicationStage;
  onSelectStage?: (stage: ApplicationStage) => void;
  readOnly?: boolean;
}

export const ApplicationStageStepper: React.FC<ApplicationStageStepperProps> = ({
  currentStage,
  onSelectStage,
  readOnly = false,
}) => {
  const stages: {
    key: ApplicationStage;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'draft',
      label: 'Draft Application',
      description: 'Assembling documents & comparing schemes',
      icon: <FileEdit className="h-4 w-4" />,
    },
    {
      key: 'submitted',
      label: 'Submitted to Portal',
      description: 'Submitted via Vidya Lakshmi or bank website',
      icon: <Send className="h-4 w-4" />,
    },
    {
      key: 'documents_required',
      label: 'Documents Required',
      description: 'Branch requested additional paperwork or clarifications',
      icon: <FileQuestion className="h-4 w-4" />,
    },
    {
      key: 'under_review',
      label: 'Credit Appraisal',
      description: 'Underwriter analyzing CIBIL & co-borrower income',
      icon: <SearchCheck className="h-4 w-4" />,
    },
    {
      key: 'bank_verification',
      label: 'Branch Verification (OSV)',
      description: 'Physical sighting of original documents & residence',
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      key: 'sanctioned',
      label: 'Loan Sanctioned',
      description: 'Sanction letter issued with interest rate & terms',
      icon: <Award className="h-4 w-4" />,
    },
    {
      key: 'disbursed',
      label: 'Disbursed to VIT Bhopal',
      description: 'DD / RTGS issued to university institutional account',
      icon: <CreditCard className="h-4 w-4" />,
    },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === currentStage);
  const isRejected = currentStage === 'rejected';

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
          Application Progression Pipeline
        </span>
        {isRejected ? (
          <Badge variant="error" size="sm">
            Application Rejected by Bank
          </Badge>
        ) : (
          <span className="text-[11px] text-slate-500 font-medium">
            Stage {currentStageIndex + 1} of {stages.length}
          </span>
        )}
      </div>

      {/* Stepper Timeline Bar */}
      <div className="relative overflow-x-auto pb-2">
        <div className="flex items-start min-w-[650px] justify-between relative">
          {/* Connector Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
          <div
            className="absolute top-4 left-6 h-0.5 bg-brand-600 transition-all duration-300 -z-0"
            style={{
              width: isRejected
                ? '0%'
                : `${(Math.max(0, currentStageIndex) / (stages.length - 1)) * 90}%`,
            }}
          />

          {stages.map((st, idx) => {
            const isCompleted = currentStageIndex > idx;
            const isCurrent = currentStageIndex === idx;

            return (
              <div
                key={st.key}
                onClick={() => {
                  if (!readOnly && onSelectStage) onSelectStage(st.key);
                }}
                className={`flex flex-col items-center text-center w-24 relative z-10 transition-all ${
                  !readOnly ? 'cursor-pointer group' : ''
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-600 text-white ring-4 ring-white'
                      : isCurrent
                      ? 'bg-brand-700 text-white ring-4 ring-brand-200 font-bold scale-110'
                      : 'bg-white text-slate-400 border-2 border-slate-300 group-hover:border-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : st.icon}
                </div>

                <span
                  className={`mt-2 font-bold text-[11px] leading-tight ${
                    isCurrent
                      ? 'text-brand-800'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {st.label}
                </span>

                <span className="text-[10px] text-slate-500 mt-0.5 hidden sm:block leading-tight">
                  {st.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
