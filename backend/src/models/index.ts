export { User, IUser } from './User';
export { Source, ISource } from './Source';
export { Source as BankSource, ISource as IBankSource } from './Source';
export { Bank, IBank } from './Bank';
export { LoanScheme, ILoanScheme } from './LoanScheme';
export { DocumentModel, IDocumentItem } from './Document';
export { DocumentModel as DocumentRequirement, IDocumentItem as IDocumentRequirement } from './Document';
export { GovernmentScheme, IGovernmentScheme } from './GovernmentScheme';
export { Institution, IInstitution } from './Institution';
export { Application, IApplication } from './Application';
export { FAQ, IFAQ } from './FAQ';
export { AuditLog, IAuditLog } from './AuditLog';
export { WhatIfScenario, IWhatIfScenario } from './WhatIfScenario';
export { ChatbotKnowledge, IChatbotKnowledge } from './ChatbotKnowledge';

export interface VerificationRecord {
  entityType: string;
  entityId: string;
  source: string;
  sourceUrl: string;
  lastVerifiedAt: string;
  verificationStatus: 'VERIFIED' | 'NEEDS_REVIEW' | 'OUTDATED' | 'UNAVAILABLE';
  verifiedBy?: string;
  notes?: string;
}

export interface BankStatistic {
  bankName: string;
  shortCode: string;
  category: string;
  schemeCount: number;
  hasCampusDesk: boolean;
  turnaroundTime: string;
  source: string;
  sourceUrl: string;
  lastVerifiedAt: string;
  verificationStatus: string;
}

export interface ParentModeContent {
  language: 'en' | 'hi' | 'gu' | 'bn';
  title: string;
  sections: Record<string, string>;
  lastVerifiedAt: string;
  verificationStatus: string;
}

export interface ApplicationTimeline {
  stageNumber: number;
  stageName: string;
  estimatedDays: string;
  responsibleParty: string;
  source: string;
  sourceUrl: string;
}

