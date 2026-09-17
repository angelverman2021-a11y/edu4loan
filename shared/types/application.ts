export type ApplicationStage =
  | 'exploring_options'
  | 'gathering_documents'
  | 'vidya_lakshmi_submitted'
  | 'bank_branch_processing'
  | 'sanction_letter_received'
  | 'disbursement_initiated'
  | 'closed';

export interface BankVisitLog {
  id: string;
  date: string;
  branchName: string;
  officerContactName?: string;
  officerDesignation?: string;
  discussionSummary: string;
  pendingRequirementsGiven: string[];
  followUpDate?: string;
}

export interface StudentApplicationTracker {
  id: string;
  userId: string;
  targetBankId?: string;
  targetBankName?: string;
  targetSchemeId?: string;
  targetSchemeName?: string;
  requestedAmount: number;
  stage: ApplicationStage;
  degreeProgram: string;
  admissionYear: number;
  documentReadiness: {
    totalRequired: number;
    completedCount: number;
    documentStatusMap: Record<string, 'pending' | 'in_progress' | 'ready'>;
  };
  notes: string;
  bankVisitLogs: BankVisitLog[];
  vidyaLakshmiApplicationId?: string;
  createdAt?: string;
  updatedAt?: string;
}
