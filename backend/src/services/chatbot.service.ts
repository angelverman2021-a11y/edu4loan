import { ChatbotKnowledge } from "../models/ChatbotKnowledge";
import { FAQ } from "../models/FAQ";
import { LoanScheme } from "../models/LoanScheme";
import { WhatIfScenario } from "../models/WhatIfScenario";
import { Bank } from "../models/Bank";
import { DocumentModel } from "../models/Document";

export interface ChatbotQueryContext {
  university?: string;
  course?: string;
  degreeLevel?: string;
  year?: number;
  loanAmount?: number;
  coApplicant?: string;
  incomeType?: string;
  hasCollateral?: boolean;
  selectedBankSlug?: string;
  selectedSchemeCode?: string;
}

export interface ChatbotSourceCitation {
  title: string;
  source: string;
  sourceUrl?: string;
  lastVerified: string;
  status: "verified" | "needs_verification" | "expired";
}

export interface ChatbotQueryResult {
  answer: string;
  citations: ChatbotSourceCitation[];
  relevantUrl?: string;
  suggestedPrompts: string[];
  contextRecognized: Partial<ChatbotQueryContext>;
}

export const queryChatbot = async (
  rawQuestion: string,
  userContext: ChatbotQueryContext = {}
): Promise<ChatbotQueryResult> => {
  const query = (rawQuestion || "").trim().toLowerCase();

  const recognizedContext: Partial<ChatbotQueryContext> = { ...userContext };
  if (!recognizedContext.university) {
    if (query.includes("vit") || query.includes("bhopal")) {
      recognizedContext.university = "VIT Bhopal University";
    }
  }

  // 1. Direct match in ChatbotKnowledge by aliases or canonical question
  const knowledgeMatches = await ChatbotKnowledge.find();
  for (const item of knowledgeMatches) {
    const isDirectMatch =
      item.questionCanonical.toLowerCase().includes(query) ||
      query.includes(item.questionCanonical.toLowerCase()) ||
      item.questionAliases.some((alias) => query.includes(alias.toLowerCase()));

    if (isDirectMatch) {
      let contextualNote = "";
      if (
        recognizedContext.loanAmount &&
        item.topicKey === "COLLATERAL_RULES_7POINT5_LAKH"
      ) {
        if (recognizedContext.loanAmount <= 750000) {
          contextualNote =
            "\\n\\n[Context Note]: Based on your loan requirement of ₹" +
            (recognizedContext.loanAmount / 100000).toFixed(1) +
            " Lakhs, your loan falls under the statutory collateral-free bracket (<= ₹7.5L).";
        } else {
          contextualNote =
            "\\n\\n[Context Note]: Because your loan requirement is ₹" +
            (recognizedContext.loanAmount / 100000).toFixed(1) +
            " Lakhs (> ₹7.5L), banks may legally request suitable tangible collateral or third-party guarantee.";
        }
      }

      if (
        recognizedContext.incomeType &&
        item.topicKey === "SALARY_SLIP_UNAVAILABLE"
      ) {
        contextualNote =
          "\\n\\n[Context Note]: Because your co-applicant is listed as " +
          recognizedContext.incomeType +
          ", focus on providing 2-3 years ITR with computation sheet or official revenue income certificates.";
      }

      return {
        answer:
          item.answerSummary +
          "\\n\\nKey points to know:\\n" +
          item.detailedPoints.map((p) => "• " + p).join("\\n") +
          contextualNote,
        citations: [
          {
            title: item.topicKey,
            source: item.sourceTitle,
            sourceUrl: item.sourceUrl,
            lastVerified: item.lastVerified,
            status: item.verificationStatus,
          },
        ],
        relevantUrl:
          item.topicKey === "SALARY_SLIP_UNAVAILABLE"
            ? "/practical-help?tab=salary-slip"
            : item.topicKey === "COLLATERAL_RULES_7POINT5_LAKH"
            ? "/calculator?tab=collateral"
            : item.topicKey === "VIT_BHOPAL_CAMPUS_LOAN_PROCESS"
            ? "/vit-bhopal"
            : item.topicKey === "PM_VIDYALAXMI_SCHEME_2024"
            ? "/schemes"
            : undefined,
        suggestedPrompts: item.suggestedFollowUps || [],
        contextRecognized: recognizedContext,
      };
    }
  }

  // 2. Search in What-If Scenarios
  const whatIfMatches = await WhatIfScenario.find();
  for (const scenario of whatIfMatches) {
    if (
      query.includes(scenario.scenarioCode.toLowerCase()) ||
      scenario.title.toLowerCase().includes(query) ||
      query.includes(scenario.title.toLowerCase())
    ) {
      return {
        answer:
          scenario.summary +
          "\\n\\n" +
          scenario.problemExplanation +
          "\\n\\nActionable Steps:\\n" +
          scenario.practicalGuidance.map((g) => "• " + g).join("\\n"),
        citations: [
          {
            title: scenario.title,
            source: scenario.officialSource.source,
            sourceUrl: scenario.officialSource.sourceUrl,
            lastVerified: scenario.officialSource.lastVerified,
            status: scenario.officialSource.status,
          },
        ],
        relevantUrl: scenario.officialActionLink,
        suggestedPrompts: [
          "What documents are required for this scenario?",
          "How do different banks handle this condition?",
          "Show official guidelines",
        ],
        contextRecognized: recognizedContext,
      };
    }
  }

  // 3. Search in FAQs
  const faqMatch = await FAQ.findOne({
    $or: [
      { question: { $regex: query, $options: "i" } },
      { answer: { $regex: query, $options: "i" } },
      { tags: { $in: [query] } },
    ],
  });

  if (faqMatch) {
    return {
      answer: faqMatch.answer,
      citations: [
        {
          title: faqMatch.question,
          source: faqMatch.officialReference || "Edu4Loan Verified FAQ Knowledge Base",
          sourceUrl: faqMatch.officialReferenceUrl,
          lastVerified: "2026-08-20",
          status: "verified",
        },
      ],
      relevantUrl: "/faqs",
      suggestedPrompts: [
        "What are the collateral rules?",
        "How is moratorium calculated?",
        "What if parent has no salary slip?",
      ],
      contextRecognized: recognizedContext,
    };
  }

  // 4. Search in Loan Schemes
  const schemeMatch = await LoanScheme.findOne({
    $or: [
      { schemeName: { $regex: query, $options: "i" } },
      { bankName: { $regex: query, $options: "i" } },
    ],
  });

  if (schemeMatch) {
    return {
      answer:
        schemeMatch.schemeName +
        " offered by " +
        schemeMatch.bankName +
        ":\\n• Interest Rate: " +
        schemeMatch.interestRate.minRate.value +
        "% to " +
        schemeMatch.interestRate.maxRate.value +
        "% (" +
        schemeMatch.interestRate.benchmarkType +
        " linked)\\n• Max Inland Loan: ₹" +
        (schemeMatch.maxLoanAmountInland.value / 100000).toFixed(1) +
        " Lakhs\\n• Collateral: " +
        schemeMatch.collateral.upTo4Lakhs +
        " (<= ₹4L); " +
        schemeMatch.collateral.from4To7point5Lakhs +
        " (₹4L-₹7.5L)\\n• Processing Fee: " +
        schemeMatch.processingFee.value +
        "\\n\\nFinal sanction terms are determined by the bank upon formal application.",
      citations: [
        {
          title: schemeMatch.schemeName,
          source: schemeMatch.source.source,
          sourceUrl: schemeMatch.source.sourceUrl,
          lastVerified: schemeMatch.source.lastVerified,
          status: schemeMatch.status,
        },
      ],
      relevantUrl: "/loans",
      suggestedPrompts: [
        "Compare " + schemeMatch.bankName + " with other banks",
        "What documents are needed for " + schemeMatch.schemeName + "?",
        "Calculate EMI for " + schemeMatch.bankName,
      ],
      contextRecognized: recognizedContext,
    };
  }

  // 5. Grounded Fallback (No Hallucination)
  return {
    answer:
      "Information is not currently verified for this query in our authoritative database. Please consult official university notices or check the official bank scheme circular.\\n\\nEdu4Loan only provides information grounded in verified official sources (RBI, IBA, Ministry of Education, and VIT Bhopal desks).",
    citations: [],
    suggestedPrompts: [
      "What if my parent has no salary slip?",
      "Is collateral required up to ₹7.5 Lakhs?",
      "How do I apply for VIT Bhopal education loan?",
      "What is PM-Vidyalaxmi 2024?",
    ],
    contextRecognized: recognizedContext,
  };
};
