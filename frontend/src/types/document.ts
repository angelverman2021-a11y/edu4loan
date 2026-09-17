import { VerifiedDataPoint } from '@shared/types/common';
import { DocumentCategory } from '@shared/types/document';

export interface DocumentModelItem {
  _id: string;
  name: string;
  category: DocumentCategory;
  description: string;
  isRequired: boolean;
  applicableCondition: string;
  sampleUrl?: string;
  issuingAuthority: string;
  verificationTip: string;
  source: VerifiedDataPoint<string>;
  isDemo?: boolean;
}

export interface PersonalizedChecklistParams {
  estimatedLoanAmount: number;
  coApplicantType: 'salaried' | 'self_employed' | 'pensioner';
  hasCollateral: boolean;
  collateralType: 'property' | 'liquid' | 'none';
  applyingThroughVidyaLakshmi: boolean;
  degreeLevel: 'Undergraduate' | 'Postgraduate';
}

export interface PersonalizedChecklistData {
  profileParameters: PersonalizedChecklistParams;
  summary: {
    totalRequired: number;
    totalOptional: number;
    totalNotApplicable: number;
  };
  requiredDocuments: DocumentModelItem[];
  optionalDocuments: DocumentModelItem[];
  notApplicableDocuments: DocumentModelItem[];
  verificationNotes: {
    documentName: string;
    tip: string;
    authority: string;
  }[];
  disclaimer: string;
}

export interface DocumentReadinessScore {
  totalRequired: number;
  completedCount: number;
  percentage: number;
  isReady: boolean;
  pendingRequiredNames: string[];
}

export interface DossierSection {
  tabNumber: number;
  tabTitle: string;
  subtitle: string;
  colorClass: string;
  documents: {
    name: string;
    originalMandatory: boolean;
    copiesNeeded: number;
    tip: string;
  }[];
}
