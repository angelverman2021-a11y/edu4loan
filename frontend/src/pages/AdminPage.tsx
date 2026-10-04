import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Layers,
  FileCheck2,
  Clock,
  RefreshCw,
  Building2,
  Database,
  CheckCircle2,
  BookOpen,
  FileText,
  HelpCircle,
  Sparkles,
  MessageSquare,
  Link2,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import {
  AdminMetrics,
  DataQualityReport,
  AuditLogItem,
  VerificationQueueItem,
} from '@/types';
import { adminService } from '@/services/adminService';
import {
  AdminMetricsStrip,
  SourceVerificationQueue,
  DataQualityAuditView,
  AuditLogViewer,
} from '@/components/admin';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const AdminPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [qualityReport, setQualityReport] = useState<DataQualityReport | null>(null);
  const [queueItems, setQueueItems] = useState<VerificationQueueItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Section 24: Data Catalog Management state
  const [selectedEntity, setSelectedEntity] = useState<string>('bank');
  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(false);

  const loadCatalogData = async (entity: string) => {
    setCatalogLoading(true);
    try {
      const items = await adminService.getCatalog(entity);
      setCatalogItems(items);
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'catalog') {
      loadCatalogData(selectedEntity);
    }
  }, [activeTab, selectedEntity]);

  const handleUpdateCatalogStatus = async (
    entity: string,
    id: string,
    status: string,
    verificationDate?: string
  ) => {
    const today = verificationDate || new Date().toISOString().split('T')[0];
    const res = await adminService.updateStatus(entity, id, {
      status,
      verificationDate: today,
      reason: `Admin updated status to ${status} via Data Catalog Management`,
    });
    showNotification(res.message);
    await loadCatalogData(entity);
    const logs = await adminService.getAuditLogs();
    setAuditLogs(logs);
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [met, qual, queue, logs] = await Promise.all([
        adminService.getMetrics(),
        adminService.getDataQualityReport(),
        adminService.getVerificationQueue(),
        adminService.getAuditLogs(),
      ]);
      setMetrics(met);
      setQualityReport(qual);
      setQueueItems(queue);
      setAuditLogs(logs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleVerify = async (entity: string, id: string, reason: string) => {
    const res = await adminService.verifyEntity(entity, id, reason);
    showNotification(res.message);
    // Update local queue item
    setQueueItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'verified', lastVerified: new Date().toISOString().split('T')[0] } : item
      )
    );
    // Refresh metrics and audit
    const [met, logs] = await Promise.all([adminService.getMetrics(), adminService.getAuditLogs()]);
    setMetrics(met);
    setAuditLogs(logs);
  };

  const handleScanFreshness = async () => {
    const res = await adminService.triggerFreshnessScan();
    showNotification(
      `Data freshness scan completed: Scanned ${res.totalScanned} records. ${res.expiredCount} records flagged.`
    );
  };

  const handleResetDemo = async () => {
    const res = await adminService.triggerDemoReset();
    showNotification(
      `Demo data reset complete: Safely removed ${res.totalDeleted} quarantined records.`
    );
    const [met, qual] = await Promise.all([adminService.getMetrics(), adminService.getDataQualityReport()]);
    setMetrics(met);
    setQualityReport(qual);
  };

  const tabs = [
    { id: 'overview', label: 'Console Overview', icon: Database },
    { id: 'catalog', label: 'Data Catalog Management', icon: Layers },
    { id: 'verification', label: 'Source Verification Queue', icon: ShieldCheck },
    { id: 'quality', label: 'Data Quality & Freshness', icon: FileCheck2 },
    { id: 'audit', label: 'Audit Trail', icon: Clock },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="info" size="sm">
              Phase 11 — Modules 18 & 19
            </Badge>
            <span className="text-xs text-slate-500 font-medium">
              Administrative & Data Governance Console
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Edu4Loan Data Administration & Provenance Engine
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl mt-1">
            Ensure regulatory fidelity across all financial citations. Review source documents,
            monitor data quality, trigger freshness audits, and verify institutional circulars.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={loadAdminData}
            className="text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Console</span>
          </Button>
        </div>
      </div>

      {/* Notification banner */}
      {notification && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Metrics Strip */}
      {metrics && (
        <AdminMetricsStrip
          metrics={metrics}
          qualityScore={qualityReport?.overallScore || 96}
        />
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-brand-700 text-brand-800 bg-brand-50/40 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-brand-700' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Areas */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Verification Queue Snapshot */}
            <Card className="border-slate-200 bg-white shadow-2xs">
              <CardHeader className="py-3.5 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-brand-700" />
                  Pending Source Verifications
                </CardTitle>
                <button
                  onClick={() => setSearchParams({ tab: 'verification' })}
                  className="text-[11px] font-bold text-brand-700 hover:underline"
                >
                  View Queue
                </button>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {queueItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block">{item.title}</span>
                      <span className="text-[10px] text-slate-400">{item.sourceName}</span>
                    </div>
                    <Badge
                      variant={item.status === 'verified' ? 'verified' : 'advisory'}
                      size="sm"
                    >
                      {item.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Data Quality Snapshot */}
            <Card className="border-slate-200 bg-white shadow-2xs">
              <CardHeader className="py-3.5 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileCheck2 className="h-4 w-4 text-emerald-700" />
                  System Health & Integrity
                </CardTitle>
                <button
                  onClick={() => setSearchParams({ tab: 'quality' })}
                  className="text-[11px] font-bold text-brand-700 hover:underline"
                >
                  Detailed Report
                </button>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Records Checked:</span>
                  <strong className="text-slate-900">{qualityReport?.totalRecordsChecked || 48}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Clean Records:</span>
                  <strong className="text-emerald-700">{qualityReport?.cleanRecordsCount || 46}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Audit Warnings:</span>
                  <strong className="text-amber-600">{qualityReport?.issuesCount.warning || 2}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Review Window Horizon:</span>
                  <strong className="text-slate-900">90 Calendar Days</strong>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Audit Activities */}
          <AuditLogViewer logs={auditLogs.slice(0, 5)} />
        </div>
      )}

      {/* Data Catalog Management Tab (Section 24) */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white shadow-2xs">
            <CardHeader className="py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-brand-700" />
                  <span>Platform Data Catalog Management</span>
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage bank data, schemes, documents, FAQs, What-If scenarios, chatbot knowledge, and sources with official verification status governance.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => loadCatalogData(selectedEntity)}
                className="text-xs flex items-center gap-1.5 self-start sm:self-auto"
              >
                <RefreshCw className={`h-3 w-3 ${catalogLoading ? 'animate-spin' : ''}`} />
                <span>Reload Entity</span>
              </Button>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Entity Selector Chips */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
                {[
                  { id: 'bank', label: 'Banks', icon: Building2 },
                  { id: 'loanscheme', label: 'Loan Schemes', icon: Layers },
                  { id: 'document', label: 'Documents', icon: FileText },
                  { id: 'faq', label: 'FAQs', icon: HelpCircle },
                  { id: 'whatifscenario', label: 'What-If Scenarios', icon: Sparkles },
                  { id: 'chatbotknowledge', label: 'Chatbot Knowledge', icon: MessageSquare },
                  { id: 'source', label: 'Official Sources', icon: Link2 },
                ].map((ent) => {
                  const Icon = ent.icon;
                  const isSelected = selectedEntity === ent.id;
                  return (
                    <button
                      key={ent.id}
                      onClick={() => setSelectedEntity(ent.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-brand-700 text-white border-brand-700 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{ent.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Catalog Items Table */}
              {catalogLoading ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-brand-700" />
                  Loading {selectedEntity} catalog records...
                </div>
              ) : catalogItems.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No records found for {selectedEntity}.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600">
                        <th className="py-2.5 px-3 font-semibold">Title / Identifier</th>
                        <th className="py-2.5 px-3 font-semibold">Current Status</th>
                        <th className="py-2.5 px-3 font-semibold">Last Verified Date</th>
                        <th className="py-2.5 px-3 font-semibold">Source Link</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Administrative Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {catalogItems.map((item) => {
                        const title =
                          item.name ||
                          item.schemeName ||
                          item.title ||
                          item.question ||
                          item.questionCanonical ||
                          item.sourceName ||
                          'Item';

                        const code =
                          item.slug ||
                          item.schemeCode ||
                          item.scenarioCode ||
                          item.topicKey ||
                          item.category ||
                          item._id;

                        const rawStatus = (
                          item.verificationStatus ||
                          item.status ||
                          item.overallSource?.status ||
                          item.source?.status ||
                          item.officialSource?.status ||
                          'VERIFIED'
                        ).toUpperCase();

                        const status = rawStatus === 'EXPIRED' ? 'OUTDATED' : rawStatus;

                        const lastDate =
                          item.lastVerifiedAt ||
                          item.lastVerified ||
                          item.overallSource?.lastVerified ||
                          item.source?.lastVerified ||
                          item.officialSource?.lastVerified ||
                          (item.verifiedAt ? new Date(item.verifiedAt).toISOString().split('T')[0] : '2026-08-20');

                        const sourceUrl =
                          item.sourceUrl ||
                          item.officialWebsite ||
                          item.educationLoanPortalUrl ||
                          item.officialCircularUrl ||
                          item.overallSource?.sourceUrl ||
                          item.source?.sourceUrl ||
                          item.officialSource?.sourceUrl ||
                          item.officialReferenceUrl;

                        const statusBadgeVariant =
                          status === 'VERIFIED'
                            ? 'verified'
                            : status === 'OUTDATED'
                            ? 'error'
                            : 'advisory';

                        return (
                          <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-3">
                              <span className="font-bold text-slate-900 block">{title}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{code}</span>
                            </td>
                            <td className="py-3 px-3">
                              <Badge variant={statusBadgeVariant} size="sm">
                                {status}
                              </Badge>
                            </td>
                            <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                              {lastDate}
                            </td>
                            <td className="py-3 px-3">
                              {sourceUrl ? (
                                <a
                                  href={sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand-700 hover:underline flex items-center gap-1 text-[11px]"
                                >
                                  <span>Official Link</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <span className="text-slate-400 text-[10px]">No Link</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                {status !== 'VERIFIED' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleUpdateCatalogStatus(selectedEntity, item._id, 'VERIFIED')
                                    }
                                    className="text-[10px] px-2 py-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                                  >
                                    Verify Today
                                  </Button>
                                )}
                                {status !== 'NEEDS_REVIEW' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleUpdateCatalogStatus(selectedEntity, item._id, 'NEEDS_REVIEW')
                                    }
                                    className="text-[10px] px-2 py-1 text-amber-700 border-amber-300 hover:bg-amber-50"
                                  >
                                    Review
                                  </Button>
                                )}
                                {status !== 'OUTDATED' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleUpdateCatalogStatus(selectedEntity, item._id, 'OUTDATED')
                                    }
                                    className="text-[10px] px-2 py-1 text-rose-700 border-rose-300 hover:bg-rose-50"
                                  >
                                    Outdated
                                  </Button>
                                )}
                                {status !== 'UNAVAILABLE' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleUpdateCatalogStatus(selectedEntity, item._id, 'UNAVAILABLE')
                                    }
                                    className="text-[10px] px-2 py-1 text-slate-700 border-slate-300 hover:bg-slate-100"
                                  >
                                    Unavailable
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'verification' && (
        <SourceVerificationQueue items={queueItems} onVerify={handleVerify} />
      )}

      {activeTab === 'quality' && qualityReport && (
        <DataQualityAuditView
          report={qualityReport}
          onScanFreshness={handleScanFreshness}
          onResetDemo={handleResetDemo}
        />
      )}

      {activeTab === 'audit' && <AuditLogViewer logs={auditLogs} />}
    </div>
  );
};
