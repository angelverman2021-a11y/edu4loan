import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataQualityReport } from '@/types';

interface DataQualityAuditViewProps {
  report: DataQualityReport;
  onScanFreshness: () => Promise<void>;
  onResetDemo: () => Promise<void>;
}

export const DataQualityAuditView: React.FC<DataQualityAuditViewProps> = ({
  report,
  onScanFreshness,
  onResetDemo,
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      await onScanFreshness();
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = async () => {
    if (
      window.confirm(
        'Are you sure you want to purge all demo records? Verified production data and student application files will remain untouched.'
      )
    ) {
      setIsResetting(true);
      try {
        await onResetDemo();
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Overview Banner */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">
              Automated Data Quality & Integrity Engine
            </span>
            <Badge variant="verified">HEALTH SCORE: {report.overallScore}%</Badge>
          </div>
          <p className="text-[11px] text-slate-500">
            Continuous audit scanning for missing citations, orphaned bank references, rate range
            anomalies (0% to 35%), and demo record contamination.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isScanning}
            onClick={handleScan}
            className="text-slate-700 hover:text-brand-800 text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Trigger Freshness Scan'}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            disabled={isResetting}
            onClick={handleReset}
            className="text-rose-700 border-rose-200 hover:bg-rose-50 text-xs flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-600" />
            <span>{isResetting ? 'Purging...' : 'Purge Demo Records'}</span>
          </Button>
        </div>
      </div>

      {/* Issues Breakdown Strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg border border-slate-200 bg-white">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Critical Errors
          </span>
          <span className="text-xl font-black text-rose-600 mt-1 block">
            {report.issuesCount.critical}
          </span>
          <span className="text-[10px] text-slate-400">Zero tolerance</span>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-white">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Audit Warnings
          </span>
          <span className="text-xl font-black text-amber-600 mt-1 block">
            {report.issuesCount.warning}
          </span>
          <span className="text-[10px] text-slate-400">Review horizon alerts</span>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-white">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Informational
          </span>
          <span className="text-xl font-black text-blue-600 mt-1 block">
            {report.issuesCount.info}
          </span>
          <span className="text-[10px] text-slate-400">Taxonomy notices</span>
        </div>
      </div>

      {/* Issues Table */}
      <Card className="border-slate-200 bg-white shadow-2xs overflow-hidden">
        <CardHeader className="py-3 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-bold text-slate-900">
            Detected Quality Audit Findings ({report.issues.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {report.issues.map((issue, idx) => (
              <div key={idx} className="p-4 space-y-1.5 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">
                      {issue.entityName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({issue.entityType})
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      issue.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : issue.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {issue.severity}
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">{issue.issue}</p>

                <div className="p-2 rounded bg-slate-50 border border-slate-200/60 text-[11px] text-slate-700 flex items-start gap-1.5">
                  <span className="font-bold text-slate-900 flex-shrink-0">Remedy:</span>
                  <span>{issue.suggestion}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
