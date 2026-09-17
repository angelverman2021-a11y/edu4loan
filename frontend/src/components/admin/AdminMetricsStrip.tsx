import React from 'react';
import {
  Building2,
  BookOpen,
  FileCheck2,
  Users,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AdminMetrics } from '@/types';

interface AdminMetricsStripProps {
  metrics: AdminMetrics;
  qualityScore?: number;
}

export const AdminMetricsStrip: React.FC<AdminMetricsStripProps> = ({
  metrics,
  qualityScore = 96,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* Banks Card */}
      <Card className="border-slate-200 bg-white shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Partner Banks
            </span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {metrics.banks.total}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Scheduled & Public
            </span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-brand-700 flex items-center justify-center">
            <Building2 className="h-4.5 w-4.5" />
          </div>
        </CardContent>
      </Card>

      {/* Loan Schemes Card */}
      <Card className="border-slate-200 bg-white shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Loan Schemes
            </span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {metrics.loanSchemes.total}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Underwriting rules
            </span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Layers className="h-4.5 w-4.5" />
          </div>
        </CardContent>
      </Card>

      {/* Source Citations */}
      <Card className="border-slate-200 bg-white shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Source Registry
            </span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {metrics.sources.total}
            </span>
            <span className="text-[10px] text-amber-600 font-medium mt-0.5 block">
              {metrics.sources.unverifiedCount} require review
            </span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <FileCheck2 className="h-4.5 w-4.5" />
          </div>
        </CardContent>
      </Card>

      {/* Student Trackers */}
      <Card className="border-slate-200 bg-white shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Active Trackers
            </span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {metrics.studentApplicationsTracked}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Self-reported files
            </span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Users className="h-4.5 w-4.5" />
          </div>
        </CardContent>
      </Card>

      {/* Quality Health Score */}
      <Card className="border-slate-200 bg-white shadow-2xs col-span-2 lg:col-span-1">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Data Integrity
            </span>
            <span className="text-2xl font-black text-emerald-700 mt-0.5 block">
              {qualityScore}%
            </span>
            <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">
              Audit pass grade
            </span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
