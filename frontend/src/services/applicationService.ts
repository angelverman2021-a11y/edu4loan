import { api } from './api';
import {
  StudentApplicationItem,
  BankVisitLogItem,
  ApplicationStage,
  DashboardSummary,
} from '@/types';

const STORAGE_KEY = 'edu4loan_student_applications';

// Default starter application for demo/first-time visitors
const DEFAULT_APPLICATIONS: StudentApplicationItem[] = [
  {
    _id: 'app_sbi_scholar_sample',
    targetBankName: 'State Bank of India',
    targetSchemeName: 'SBI Scholar Scheme (Premier Institution)',
    requestedAmount: 1200000,
    status: 'bank_verification',
    degreeProgram: 'B.Tech in Computer Science & Engineering',
    admissionYear: 2026,
    documentReadiness: {
      totalRequired: 14,
      completedCount: 11,
    },
    notes:
      'Application submitted via Vidya Lakshmi. Branch requested physical verification of original marksheets and parents IT returns.',
    nextAction: 'Visit SBI Ashta branch for original document verification (OSV).',
    vidyaLakshmiApplicationId: 'CELFS-2026-VITB-0982',
    bankVisitLogs: [
      {
        id: 'log_1',
        date: '2026-09-05',
        branchName: 'SBI Ashta Branch',
        officerContactName: 'Mr. R. K. Sharma',
        officerDesignation: 'Chief Manager (Credit)',
        discussionSummary:
          'Discussed Scholar scheme eligibility for VIT Bhopal Category 2 B.Tech admission. Officer confirmed 0% margin money and 8.15% interest rate.',
        pendingRequirementsGiven: [
          'Stamped 4-Year Fee Estimate from VIT Bhopal Finance Office',
          'Parent Form 16 for AY 2025-26 with Part A & B',
        ],
        followUpDate: '2026-09-22',
      },
    ],
    isStudentEnteredSelfReported: true,
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-05T15:30:00.000Z',
  },
];

export const applicationService = {
  /**
   * Fetch all applications for the student
   */
  fetchMyApplications: async (): Promise<StudentApplicationItem[]> => {
    try {
      const res = await api.get<StudentApplicationItem[]>('/applications');
      if (res.data && res.data.length > 0) {
        // Also cache locally for offline access
        applicationService.saveToLocalStorage(res.data);
        return res.data;
      }
    } catch {
      // Backend not reached or user unauthenticated: fallback to local storage
    }

    const localData = applicationService.getFromLocalStorage();
    if (localData.length > 0) {
      return localData;
    }

    // Initialize with starter sample
    applicationService.saveToLocalStorage(DEFAULT_APPLICATIONS);
    return DEFAULT_APPLICATIONS;
  },

  /**
   * Create a new application tracker entry
   */
  createApplication: async (
    data: Partial<StudentApplicationItem>
  ): Promise<StudentApplicationItem> => {
    const newApp: StudentApplicationItem = {
      _id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      targetBankName: data.targetBankName || 'State Bank of India',
      targetSchemeName: data.targetSchemeName || 'Education Loan Scheme',
      requestedAmount: data.requestedAmount || 1200000,
      status: data.status || 'draft',
      degreeProgram: data.degreeProgram || 'B.Tech',
      admissionYear: data.admissionYear || 2026,
      documentReadiness: data.documentReadiness || { totalRequired: 14, completedCount: 0 },
      notes: data.notes || '',
      nextAction: data.nextAction || 'Assemble required documents for branch submission',
      vidyaLakshmiApplicationId: data.vidyaLakshmiApplicationId,
      bankVisitLogs: [],
      isStudentEnteredSelfReported: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save locally
    const current = applicationService.getFromLocalStorage();
    const updated = [newApp, ...current];
    applicationService.saveToLocalStorage(updated);

    // Sync to backend if authenticated
    try {
      await api.post('/applications', newApp);
    } catch {
      // offline / unauthenticated
    }

    return newApp;
  },

  /**
   * Update an existing application
   */
  updateApplication: async (
    id: string,
    updates: Partial<StudentApplicationItem>
  ): Promise<StudentApplicationItem> => {
    const current = applicationService.getFromLocalStorage();
    const index = current.findIndex((a) => a._id === id);

    if (index === -1) {
      throw new Error('Application tracker entry not found');
    }

    const updatedApp: StudentApplicationItem = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    current[index] = updatedApp;
    applicationService.saveToLocalStorage(current);

    // Sync to backend
    try {
      await api.put(`/applications/${id}`, updates);
    } catch {
      // offline / unauthenticated
    }

    return updatedApp;
  },

  /**
   * Delete an application
   */
  deleteApplication: async (id: string): Promise<void> => {
    const current = applicationService.getFromLocalStorage();
    const filtered = current.filter((a) => a._id !== id);
    applicationService.saveToLocalStorage(filtered);

    try {
      await api.delete(`/applications/${id}`);
    } catch {
      // offline / unauthenticated
    }
  },

  /**
   * Add a bank visit interaction log
   */
  addBankVisitLog: async (
    appId: string,
    visit: Omit<BankVisitLogItem, 'id' | '_id'>
  ): Promise<BankVisitLogItem> => {
    const newLog: BankVisitLogItem = {
      ...visit,
      id: `log_${Date.now()}`,
      _id: `log_${Date.now()}`,
    };

    const current = applicationService.getFromLocalStorage();
    const app = current.find((a) => a._id === appId);

    if (app) {
      if (!app.bankVisitLogs) app.bankVisitLogs = [];
      app.bankVisitLogs.unshift(newLog);
      app.updatedAt = new Date().toISOString();
      if (visit.followUpDate) {
        app.nextAction = `Follow-up with ${visit.branchName} on ${visit.followUpDate}`;
      }
      applicationService.saveToLocalStorage(current);
    }

    // Sync to backend
    try {
      await api.post(`/applications/${appId}/bank-visits`, visit);
    } catch {
      // offline / unauthenticated
    }

    return newLog;
  },

  /**
   * Aggregate metrics for Dashboard summary
   */
  getDashboardSummary: (applications: StudentApplicationItem[]): DashboardSummary => {
    let totalRequested = 0;
    let totalSanctioned = 0;
    let nextFollowUp: DashboardSummary['nextFollowUp'] = null;

    for (const app of applications) {
      totalRequested += app.requestedAmount || 0;
      if (app.status === 'sanctioned' || app.status === 'disbursed') {
        totalSanctioned += app.requestedAmount || 0;
      }

      if (app.bankVisitLogs && app.bankVisitLogs.length > 0) {
        for (const log of app.bankVisitLogs) {
          if (log.followUpDate) {
            if (!nextFollowUp || log.followUpDate < nextFollowUp.date) {
              nextFollowUp = {
                date: log.followUpDate,
                branchName: log.branchName,
                action: log.discussionSummary,
              };
            }
          }
        }
      }
    }

    return {
      activeApplicationsCount: applications.length,
      totalRequestedAmount: totalRequested,
      sanctionedAmount: totalSanctioned,
      savedSchemesCount: 0,
      documentReadinessPercent: 78,
      nextFollowUp,
      recentApplications: applications.slice(0, 5),
    };
  },

  // Storage helpers
  getFromLocalStorage: (): StudentApplicationItem[] => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(STORAGE_KEY);
        if (item) return JSON.parse(item);
      }
    } catch {
      // ignore
    }
    return [];
  },

  saveToLocalStorage: (data: StudentApplicationItem[]): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch {
      // ignore
    }
  },
};
