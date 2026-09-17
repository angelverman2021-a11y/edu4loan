import { ApplicationStage } from '@shared/types';

export interface BankVisitLogItem {
  _id?: string;
  id?: string;
  date: string;
  branchName: string;
  officerContactName?: string;
  officerDesignation?: string;
  discussionSummary: string;
  pendingRequirementsGiven: string[];
  followUpDate?: string;
}

export interface StudentApplicationItem {
  _id: string;
  id?: string;
  userId?: string;
  targetBankId?: string;
  targetBankName: string;
  targetSchemeId?: string;
  targetSchemeName: string;
  requestedAmount: number;
  status: ApplicationStage;
  degreeProgram: string;
  admissionYear: number;
  documentReadiness: {
    totalRequired: number;
    completedCount: number;
  };
  notes: string;
  nextAction?: string;
  bankVisitLogs: BankVisitLogItem[];
  vidyaLakshmiApplicationId?: string;
  isStudentEnteredSelfReported?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  activeApplicationsCount: number;
  totalRequestedAmount: number;
  sanctionedAmount: number;
  savedSchemesCount: number;
  documentReadinessPercent: number;
  nextFollowUp: {
    date: string;
    branchName: string;
    action: string;
  } | null;
  recentApplications: StudentApplicationItem[];
}
