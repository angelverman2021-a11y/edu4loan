export type FAQCategory =
  | 'moratorium_and_repayment'
  | 'collateral_and_guarantees'
  | 'cibil_and_credit_score'
  | 'vidya_lakshmi_portal'
  | 'pm_vidyalaxmi_scheme'
  | 'vit_bhopal_processes'
  | 'interest_rates_and_subsidies';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  tags: string[];
  officialReference?: string;
  officialReferenceUrl?: string;
  isHighPriority: boolean;
}
