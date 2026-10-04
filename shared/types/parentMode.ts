export type ParentModeLanguage = "en" | "hi" | "gu" | "bn";

export interface TermDefinition {
  termKey: string;
  canonicalEnglish: string;
  localizedTerm: string;
  simpleExplanation: string;
  officialWording: string;
  whyThisMatters: string;
  practicalTip: string;
}

export interface ParentPreparationItem {
  id: string;
  category: "student_academic" | "parent_financial" | "bank_clarification";
  title: string;
  description: string;
  isMandatory: boolean;
  status: "pending" | "in_progress" | "completed";
}

export interface ParentModeDictionary {
  language: ParentModeLanguage;
  languageName: string;
  nativeName: string;
  labels: Record<string, string>;
  terms: Record<string, TermDefinition>;
}
