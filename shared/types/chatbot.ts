export interface ChatbotSourceCitation {
  title: string;
  source: string;
  sourceUrl?: string;
  lastVerified: string;
  status: "verified" | "needs_verification" | "expired";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  content: string;
  citations?: ChatbotSourceCitation[];
  timestamp: string;
  suggestedPrompts?: string[];
}

export interface ChatbotQueryContext {
  university?: string;
  course?: string;
  degreeLevel?: string;
  year?: number;
  loanAmount?: number;
  coApplicant?: string;
  incomeType?: "Salaried" | "Self-employed" | "Business" | "Agricultural" | "Other";
  hasCollateral?: boolean;
  selectedBankSlug?: string;
  selectedSchemeCode?: string;
}

export interface ChatbotResponse {
  answer: string;
  citations: ChatbotSourceCitation[];
  relevantUrl?: string;
  suggestedPrompts: string[];
  contextRecognized?: Partial<ChatbotQueryContext>;
}
