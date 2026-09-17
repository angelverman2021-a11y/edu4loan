import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Filter,
  Search,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VerificationQueueItem } from '@/types';

interface SourceVerificationQueueProps {
  items: VerificationQueueItem[];
  onVerify: (entity: string, id: string, reason: string) => Promise<void>;
}

export const SourceVerificationQueue: React.FC<SourceVerificationQueueProps> = ({
  items,
  onVerify,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [reason, setReason] = useState<string>('Verified against official master circular.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const filteredItems = items.filter((item) => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(term) ||
        item.sourceName.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleVerifySubmit = async (item: VerificationQueueItem) => {
    if (!item.sourceUrl || !item.sourceUrl.startsWith('http')) {
      alert('Cannot verify: Primary source URL must be a valid HTTP/HTTPS link.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onVerify(item.entityType, item.id, reason);
      setVerifyingId(null);
      setReason('Verified against official master circular.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: VerificationQueueItem['status']) => {
    switch (status) {
      case 'verified':
        return <Badge variant="verified">VERIFIED PROVENANCE</Badge>;
      case 'expired':
        return <Badge variant="error">EXPIRED (&gt;90 DAYS)</Badge>;
      case 'needs_verification':
      default:
        return <Badge variant="advisory">NEEDS VERIFICATION</Badge>;
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-brand-700" />
            Source Verification Queue & Provenance Workflow
          </h3>
          <p className="text-[11px] text-slate-500">
            Review primary regulatory circulars and update verified stamps with mandatory audit logging.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="needs_verification">Needs Verification</option>
            <option value="verified">Verified</option>
            <option value="expired">Expired (&gt;90 Days)</option>
          </select>
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isSelectedForVerify = verifyingId === item.id;
          return (
            <Card
              key={item.id}
              className={`border transition-all ${
                isSelectedForVerify
                  ? 'border-brand-500 ring-1 ring-brand-200 shadow-md bg-brand-50/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
              }`}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <span className="text-slate-500 text-[11px] block">{item.category}</span>
                  </div>

                  <div className="text-right text-[11px] text-slate-400">
                    Last Verified: <strong className="text-slate-600">{item.lastVerified}</strong>
                  </div>
                </div>

                {/* Source Citation */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Primary Source Citation:
                    </span>
                    <span className="text-slate-700 font-medium text-[11px]">
                      {item.sourceName}
                    </span>
                  </div>

                  {item.sourceUrl ? (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-700 hover:text-brand-800 font-semibold text-[11px] whitespace-nowrap self-start sm:self-auto"
                    >
                      <span>Check Official URL</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-rose-600 text-[10px] font-semibold">
                      Missing Citation URL
                    </span>
                  )}
                </div>

                {/* Verification Action Drawer / Form */}
                {isSelectedForVerify ? (
                  <div className="pt-2 border-t border-brand-100 space-y-2">
                    <label className="font-bold text-slate-700 block text-[11px]">
                      Mandatory Audit Verification Note:
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. Cross-referenced with official bank portal rate schedule"
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setVerifyingId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleVerifySubmit(item)}
                        disabled={isSubmitting || !reason.trim()}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white"
                      >
                        {isSubmitting ? 'Recording Audit...' : 'Confirm Verification & Update'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setVerifyingId(item.id);
                        setReason('Verified against official master circular.');
                      }}
                      className="text-slate-700 hover:text-brand-700 border-slate-300 text-xs flex items-center gap-1"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{item.status === 'verified' ? 'Re-Verify Record' : 'Verify Citation'}</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
