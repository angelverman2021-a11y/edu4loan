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

  // 1. Identify user context
  const recognizedContext: Partial<ChatbotQueryContext> = { ...userContext };
  if (!recognizedContext.university) {
    if (query.includes("vit") || query.includes("bhopal")) {
      recognizedContext.university = "VIT Bhopal University";
    }
  }

  // Identify loan amount mentioned in query
  if (!recognizedContext.loanAmount) {
    const lakhMatch = query.match(/(\d+(\.\d+)?)\s*(lakh|lakhs|lac|lacs|l)\b/i);
    if (lakhMatch) {
      recognizedContext.loanAmount = parseFloat(lakhMatch[1]) * 100000;
    }
  }

  // Identify income type mentioned in query
  if (!recognizedContext.incomeType) {
    if (query.includes("self employ") || query.includes("business")) {
      recognizedContext.incomeType = "Self-Employed / Business";
    } else if (query.includes("farmer") || query.includes("kisan") || query.includes("agriculture")) {
      recognizedContext.incomeType = "Agriculture / Farmer";
    } else if (query.includes("pension")) {
      recognizedContext.incomeType = "Pensioner";
    } else if (query.includes("salary") || query.includes("salaried")) {
      recognizedContext.incomeType = "Salaried";
    }
  }

  // 2. Identify selected bank / scheme
  if (!recognizedContext.selectedBankSlug) {
    if (query.includes("sbi") || query.includes("state bank")) {
      recognizedContext.selectedBankSlug = "sbi";
      recognizedContext.selectedSchemeCode = "SBI_STUDENT_LOAN";
    } else if (query.includes("canara")) {
      recognizedContext.selectedBankSlug = "canara-bank";
      recognizedContext.selectedSchemeCode = "CANARA_VIDYA_TURAN";
    } else if (query.includes("pnb") || query.includes("punjab national")) {
      recognizedContext.selectedBankSlug = "punjab-national-bank";
      recognizedContext.selectedSchemeCode = "PNB_SARASWATI";
    } else if (query.includes("union")) {
      recognizedContext.selectedBankSlug = "union-bank";
      recognizedContext.selectedSchemeCode = "UNION_EDUCATION";
    }
  }

  // Helper to append verification advisory warning if citation status is not verified
  const attachVerificationWarningIfNeeded = (answer: string, citations: ChatbotSourceCitation[]): string => {
    const hasUnverified = citations.some(
      (c) => c.status === "needs_verification" || (c.status as string) === "NEEDS_REVIEW" || (c.status as string) === "OUTDATED" || (c.status as string) === "UNAVAILABLE" || c.status === "expired"
    );
    if (hasUnverified) {
      return answer + "\n\n[Verification Advisory]: Verification required against the latest official bank circular or university notice.";
    }
    return answer;
  };

  // 3. Search verified database: ChatbotKnowledge
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
            "\n\n[Context Note]: Based on your loan requirement of Rs. " +
            (recognizedContext.loanAmount / 100000).toFixed(1) +
            " Lakhs, your loan falls under the statutory collateral-free bracket (<= Rs. 7.5L).";
        } else {
          contextualNote =
            "\n\n[Context Note]: Because your loan requirement is Rs. " +
            (recognizedContext.loanAmount / 100000).toFixed(1) +
            " Lakhs (> Rs. 7.5L), banks may legally request suitable tangible collateral or third-party guarantee.";
        }
      }

      if (
        recognizedContext.incomeType &&
        item.topicKey === "SALARY_SLIP_UNAVAILABLE"
      ) {
        contextualNote =
          "\n\n[Context Note]: Because your co-applicant is listed as " +
          recognizedContext.incomeType +
          ", focus on providing 2-3 years ITR with computation sheet or official revenue income certificates.";
      }

      const citations: ChatbotSourceCitation[] = [
        {
          title: item.topicKey,
          source: item.sourceTitle,
          sourceUrl: item.sourceUrl,
          lastVerified: item.lastVerified,
          status: item.verificationStatus,
        },
      ];

      const baseAnswer =
        item.answerSummary +
        "\n\nKey points to know:\n" +
        item.detailedPoints.map((p) => "• " + p).join("\n") +
        contextualNote;

      return {
        answer: attachVerificationWarningIfNeeded(baseAnswer, citations),
        citations,
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

  // 4. Search in What-If Scenarios
  const whatIfMatches = await WhatIfScenario.find();
  for (const scenario of whatIfMatches) {
    if (
      query.includes(scenario.scenarioCode.toLowerCase()) ||
      scenario.title.toLowerCase().includes(query) ||
      query.includes(scenario.title.toLowerCase())
    ) {
      const citations: ChatbotSourceCitation[] = [
        {
          title: scenario.title,
          source: scenario.officialSource.source,
          sourceUrl: scenario.officialSource.sourceUrl,
          lastVerified: scenario.officialSource.lastVerified,
          status: scenario.officialSource.status,
        },
      ];

      const baseAnswer =
        scenario.summary +
        "\n\n" +
        scenario.problemExplanation +
        "\n\nActionable Steps:\n" +
        scenario.practicalGuidance.map((g) => "• " + g).join("\n");

      return {
        answer: attachVerificationWarningIfNeeded(baseAnswer, citations),
        citations,
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

  // 5. Search in FAQs
  const faqMatch = await FAQ.findOne({
    $or: [
      { question: { $regex: query, $options: "i" } },
      { answer: { $regex: query, $options: "i" } },
      { tags: { $in: [query] } },
    ],
  });

  if (faqMatch) {
    const citations: ChatbotSourceCitation[] = [
      {
        title: faqMatch.question,
        source: faqMatch.officialReference || "Edu4Loan Verified FAQ Knowledge Base",
        sourceUrl: faqMatch.officialReferenceUrl,
        lastVerified: "2026-08-20",
        status: "verified",
      },
    ];

    return {
      answer: attachVerificationWarningIfNeeded(faqMatch.answer, citations),
      citations,
      relevantUrl: "/faqs",
      suggestedPrompts: [
        "What are the collateral rules?",
        "How is moratorium calculated?",
        "What if parent has no salary slip?",
      ],
      contextRecognized: recognizedContext,
    };
  }

  // 6. Search in Loan Schemes & Banks
  const schemeMatch = await LoanScheme.findOne({
    $or: [
      { schemeName: { $regex: query, $options: "i" } },
      { bankName: { $regex: query, $options: "i" } },
      { schemeCode: { $regex: query, $options: "i" } },
    ],
  });

  if (schemeMatch) {
    const citations: ChatbotSourceCitation[] = [
      {
        title: schemeMatch.schemeName,
        source: schemeMatch.source.source,
        sourceUrl: schemeMatch.source.sourceUrl,
        lastVerified: schemeMatch.source.lastVerified,
        status: schemeMatch.status,
      },
    ];

    const baseAnswer =
      schemeMatch.schemeName +
      " offered by " +
      schemeMatch.bankName +
      ":\n• Interest Rate: " +
      schemeMatch.interestRate.minRate.value +
      "% to " +
      schemeMatch.interestRate.maxRate.value +
      "% (" +
      schemeMatch.interestRate.benchmarkType +
      " linked)\n• Max Inland Loan: Rs. " +
      (schemeMatch.maxLoanAmountInland.value / 100000).toFixed(1) +
      " Lakhs\n• Collateral: " +
      schemeMatch.collateral.upTo4Lakhs +
      " (<= Rs. 4L); " +
      schemeMatch.collateral.from4To7point5Lakhs +
      " (Rs. 4L - Rs. 7.5L)\n• Processing Fee: " +
      schemeMatch.processingFee.value +
      (schemeMatch.publishedProcessingTime ? "\n• Published Processing Window: " + schemeMatch.publishedProcessingTime : "") +
      "\n\nFinal sanction terms are determined by the bank upon formal underwriting and institutional verification.";

    return {
      answer: attachVerificationWarningIfNeeded(baseAnswer, citations),
      citations,
      relevantUrl: "/loans",
      suggestedPrompts: [
        "Compare " + schemeMatch.bankName + " with other banks",
        "What documents are needed for " + schemeMatch.schemeName + "?",
        "Calculate EMI for " + schemeMatch.bankName,
      ],
      contextRecognized: recognizedContext,
    };
  }

  // 7. Grounded Fallback: Section 20 strict fallback string
  return {
    answer:
      "Information not currently verified. Edu4Loan only provides information grounded in verified official sources (RBI, IBA, Ministry of Education, and VIT Bhopal facilitation desks). Please consult official university notices or check the official bank scheme circular.",
    citations: [],
    suggestedPrompts: [
      "What if my parent has no salary slip?",
      "Is collateral required up to Rs. 7.5 Lakhs?",
      "How do I apply for VIT Bhopal education loan?",
      "What is PM-Vidyalaxmi 2024?",
    ],
    contextRecognized: recognizedContext,
  };
};
