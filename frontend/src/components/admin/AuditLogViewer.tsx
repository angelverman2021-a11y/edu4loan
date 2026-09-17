import React, { useState } from 'react';
import { Clock, User, ShieldCheck, Filter, Search, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AuditLogItem } from '@/types';

interface AuditLogViewerProps {
  logs: AuditLogItem[];
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs }) => {
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    if (filterEntity !== 'all' && log.entityType !== filterEntity) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      return (
        log.userEmail.toLowerCase().includes(term) ||
        log.entityId.toLowerCase().includes(term) ||
        (log.reason && log.reason.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const getActionBadge = (action: AuditLogItem['action']) => {
    switch (action) {
      case 'VERIFY':
      case 'STATUS_CHANGE':
        return <Badge variant="verified">{action}</Badge>;
      case 'FRESHNESS_SCAN':
        return <Badge variant="info">FRESHNESS SCAN</Badge>;
      case 'RESET_DEMO':
        return <Badge variant="error">DEMO RESET</Badge>;
      default:
        return <Badge variant="neutral">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-brand-700" />
            Immutable Administrative Audit Trail
          </h3>
          <p className="text-[11px] text-slate-500">
            Append-only historical ledger tracking every rate modification, status verification, and
            system maintenance event.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className="p-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="all">All Entities</option>
            <option value="loanscheme">Loan Schemes</option>
            <option value="governmentscheme">Government Schemes</option>
            <option value="bank">Banks</option>
            <option value="source">Sources</option>
            <option value="document">Documents</option>
          </select>
        </div>
      </div>

      {/* Logs Table / Card List */}
      <Card className="border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No audit activities found matching current filter.
            </div>
          ) : (
            filteredLogs.map((log, idx) => (
              <div key={log.id || idx} className="p-4 space-y-2 hover:bg-slate-50/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getActionBadge(log.action)}
                    <span className="font-mono font-bold text-slate-800 text-[11px]">
                      {log.entityType}::{log.entityId}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {log.userEmail}
                    </span>
                    <span>•</span>
                    <span>{new Date(log.timestamp || '').toLocaleString()}</span>
                  </div>
                </div>

                {log.fieldChanged && (
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-slate-500">Field: {log.fieldChanged}</span>
                    <span className="text-slate-400">—</span>
                    <span className="line-through text-slate-400">{String(log.oldValue ?? '')}</span>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                    <span className="font-bold text-emerald-700">{String(log.newValue ?? '')}</span>
                  </div>
                )}

                {log.reason && (
                  <div className="p-2 rounded bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600">
                    <strong className="text-slate-700">Audit Justification:</strong> {log.reason}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
