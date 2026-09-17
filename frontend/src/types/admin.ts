import { AuditLogItem } from '@shared/types';

export interface AdminMetrics {
  banks: { total: number };
  loanSchemes: { total: number };
  sources: {
    total: number;
    unverifiedCount: number;
  };
  studentApplicationsTracked: number;
  recentAuditActivity: AuditLogItem[];
}

export interface DataQualityIssue {
  entityType: string;
  entityId: string;
  entityName: string;
  severity: 'critical' | 'warning' | 'info';
  issue: string;
  suggestion: string;
}

export interface DataQualityReport {
  overallScore: number;
  totalRecordsChecked: number;
  cleanRecordsCount: number;
  issuesCount: {
    critical: number;
    warning: number;
    info: number;
  };
  unverifiedSourcesCount: number;
  staleRecordsCount: number;
  issues: DataQualityIssue[];
  generatedAt: string;
}

export interface FreshnessScanResult {
  totalScanned: number;
  expiredCount: number;
  stillFreshCount: number;
  scanTimestamp: string;
  flaggedRecordIds: string[];
}

export interface VerificationQueueItem {
  id: string;
  entityType: 'bank' | 'loanscheme' | 'governmentscheme' | 'document' | 'source';
  title: string;
  category: string;
  status: 'verified' | 'needs_verification' | 'expired';
  lastVerified: string;
  sourceName: string;
  sourceUrl?: string;
  isDemo?: boolean;
}
