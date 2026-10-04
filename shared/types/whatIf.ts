import { VerifiedDataPoint } from "./common";

export type WhatIfCategory =
  | "income_and_salary"
  | "collateral_and_security"
  | "credit_history"
  | "course_and_institution"
  | "application_and_portal"
  | "expenses_and_fees";

export interface WhatIfScenario {
  id: string;
  scenarioCode: string;
  title: string;
  category: WhatIfCategory;
  summary: string;
  problemExplanation: string;
  practicalGuidance: string[];
  relevantDocuments: string[];
  bankSpecificConditions: Array<{
    bankName: string;
    condition: string;
  }>;
  officialSource: VerifiedDataPoint<string>;
  officialActionLink?: string;
  actionText?: string;
  status: "verified" | "needs_verification" | "expired";
}
