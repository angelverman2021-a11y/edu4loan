import { Bank } from "../models/Bank";
import { LoanScheme } from "../models/LoanScheme";
import { GovernmentScheme } from "../models/GovernmentScheme";
import { Institution } from "../models/Institution";
import { DocumentModel } from "../models/Document";
import { FAQ } from "../models/FAQ";
import { WhatIfScenario } from "../models/WhatIfScenario";
import { Source } from "../models/Source";
import { ChatbotKnowledge } from "../models/ChatbotKnowledge";
import { escapeRegex, sanitizeString } from "../utils/querySafety";

export interface SearchResult {
  query: string;
  totalMatches: number;
  summary: {
    totalMatches: number;
    banksCount: number;
    loanSchemesCount: number;
    governmentSchemesCount: number;
    institutionsCount: number;
    documentsCount: number;
    faqsCount: number;
    whatIfCount: number;
    sourcesCount: number;
    chatbotCount: number;
  };
  banks: any[];
  loanSchemes: any[];
  bankSchemes: any[];
  governmentSchemes: any[];
  institutions: any[];
  documents: any[];
  faqs: any[];
  whatIfScenarios: any[];
  whatIfAnswers: any[];
  sources: any[];
  officialSources: any[];
  chatbotAnswers: any[];
  results: {
    banks: any[];
    loanSchemes: any[];
    bankSchemes: any[];
    governmentSchemes: any[];
    institutions: any[];
    documents: any[];
    faqs: any[];
    whatIfScenarios: any[];
    whatIfAnswers: any[];
    sources: any[];
    officialSources: any[];
    chatbotAnswers: any[];
  };
}

export const executeGlobalSearch = async (queryString: string | undefined): Promise<SearchResult> => {
  const sanitized = sanitizeString(queryString);

  const emptyResult: SearchResult = {
    query: sanitized || "",
    totalMatches: 0,
    summary: {
      totalMatches: 0,
      banksCount: 0,
      loanSchemesCount: 0,
      governmentSchemesCount: 0,
      institutionsCount: 0,
      documentsCount: 0,
      faqsCount: 0,
      whatIfCount: 0,
      sourcesCount: 0,
      chatbotCount: 0,
    },
    banks: [],
    loanSchemes: [],
    bankSchemes: [],
    governmentSchemes: [],
    institutions: [],
    documents: [],
    faqs: [],
    whatIfScenarios: [],
    whatIfAnswers: [],
    sources: [],
    officialSources: [],
    chatbotAnswers: [],
    results: {
      banks: [],
      loanSchemes: [],
      bankSchemes: [],
      governmentSchemes: [],
      institutions: [],
      documents: [],
      faqs: [],
      whatIfScenarios: [],
      whatIfAnswers: [],
      sources: [],
      officialSources: [],
      chatbotAnswers: [],
    },
  };

  if (!sanitized || sanitized.length < 2) {
    return emptyResult;
  }

  // Synonym expansion for Section 21 vernacular & conversational queries
  const lower = sanitized.toLowerCase();
  let searchPattern = sanitized;

  if (lower.includes("salary slip") || lower.includes("payslip") || lower.includes("salary slip nahi")) {
    searchPattern = "salary|payslip|income proof|Form 16|ITR|income certificate";
  } else if (lower.includes("self employ") || lower.includes("parent is self")) {
    searchPattern = "self employed|business|ITR|balance sheet|profit and loss";
  } else if (lower.includes("no collateral") || lower.includes("collateral")) {
    searchPattern = "collateral|security|guarantee|CGFSEL|7.5 lakh";
  } else if (lower.includes("documents required") || lower.includes("document required") || lower.includes("minimum documents")) {
    searchPattern = "document|kyc|marksheet|bonafide|fee estimate|allotment";
  } else if (lower.includes("compare bank") || lower.includes("compare banks")) {
    searchPattern = "SBI|Canara|PNB|Union|scholar|education loan|interest";
  } else if (lower.includes("processing time") || lower.includes("turnaround") || lower.includes("published processing")) {
    searchPattern = "processing time|turnaround|days|timeline|SLA";
  } else if (lower.includes("verify student") || lower.includes("verification") || lower.includes("how does bank verify")) {
    searchPattern = "verify|verification|bonafide|VTOP|institutional";
  } else if (lower.includes("approval statistics") || lower.includes("loan approval") || lower.includes("statistics")) {
    searchPattern = "statistics|underwriting|CIBIL|FOIR|quantum|threshold";
  } else if (lower.includes("parents ke liye") || lower.includes("parent") || lower.includes("simple explanation")) {
    searchPattern = "parent|co-applicant|guarantor|moratorium|margin money";
  } else if (lower.includes("ગુજરાતી") || lower.includes("gujarati") || lower.includes("લોનની માહિતી")) {
    searchPattern = "parent mode|education loan|scheme|સહાય|scholar";
  }

  const isExpanded = searchPattern !== sanitized;
  const regex = isExpanded
    ? { $regex: searchPattern, $options: "i" }
    : { $regex: escapeRegex(sanitized), $options: "i" };

  // Run searches across all 9 collections concurrently
  const [banks, loanSchemes, governmentSchemes, institutions, documents, faqs, whatIfScenarios, sources, chatbotKnowledge] =
    await Promise.all([
      Bank.find({
        $or: [{ name: regex }, { slug: regex }, { shortCode: regex }, { headquarters: regex }],
      })
        .select("name slug shortCode category logoUrl officialWebsite vidyaLakshmiRegistered pmVidyalaxmiRegistered overallSource")
        .limit(10),

      LoanScheme.find({
        $or: [
          { schemeName: regex },
          { bankName: regex },
          { schemeCode: regex },
          { overview: regex },
          { publishedProcessingTime: regex },
        ],
      })
        .select("schemeName schemeCode bankName interestRate maxLoanAmountInland status source officialApplicationUrl publishedProcessingTime")
        .limit(10),

      GovernmentScheme.find({
        $or: [{ schemeName: regex }, { schemeCode: regex }, { managingAuthority: regex }, { keyBenefits: regex }],
      })
        .select("schemeName schemeCode managingAuthority incomeCeilingPerAnnum portalUrl vitBhopalRelevance source")
        .limit(10),

      Institution.find({
        $or: [{ name: regex }, { "location.campusAddress": regex }, { "nirfAndAccreditationStatus.notes": regex }],
      })
        .select("name location nirfAndAccreditationStatus programs officialBankHelpdesk")
        .limit(5),

      DocumentModel.find({
        $or: [{ name: regex }, { description: regex }, { category: regex }, { issuingAuthority: regex }],
      })
        .select("name category description isRequired applicableCondition issuingAuthority verificationTip source")
        .limit(15),

      FAQ.find({
        $or: [{ question: regex }, { answer: regex }, { category: regex }, { tags: regex }],
      })
        .select("question answer category isHighPriority tags")
        .limit(10),

      WhatIfScenario.find({
        $or: [{ title: regex }, { summary: regex }, { problemExplanation: regex }, { category: regex }],
      })
        .select("title scenarioCode category summary officialSource officialActionLink")
        .limit(10),

      Source.find({
        $or: [{ sourceName: regex }, { issuingAuthority: regex }, { circularReference: regex }, { notes: regex }],
      })
        .select("sourceName sourceUrl sourceType issuingAuthority circularReference verifiedAt status")
        .limit(10),

      ChatbotKnowledge.find({
        $or: [{ questionCanonical: regex }, { questionAliases: regex }, { answerSummary: regex }, { topicKey: regex }],
      })
        .select("topicKey questionCanonical answerSummary sourceTitle sourceUrl lastVerified verificationStatus")
        .limit(10),
    ]);

  const totalMatches =
    banks.length +
    loanSchemes.length +
    governmentSchemes.length +
    institutions.length +
    documents.length +
    faqs.length +
    whatIfScenarios.length +
    sources.length +
    chatbotKnowledge.length;

  return {
    query: sanitized,
    totalMatches,
    summary: {
      totalMatches,
      banksCount: banks.length,
      loanSchemesCount: loanSchemes.length,
      governmentSchemesCount: governmentSchemes.length,
      institutionsCount: institutions.length,
      documentsCount: documents.length,
      faqsCount: faqs.length,
      whatIfCount: whatIfScenarios.length,
      sourcesCount: sources.length,
      chatbotCount: chatbotKnowledge.length,
    },
    banks,
    loanSchemes,
    bankSchemes: loanSchemes,
    governmentSchemes,
    institutions,
    documents,
    faqs,
    whatIfScenarios,
    whatIfAnswers: whatIfScenarios,
    sources,
    officialSources: sources,
    chatbotAnswers: chatbotKnowledge,
    results: {
      banks,
      loanSchemes,
      bankSchemes: loanSchemes,
      governmentSchemes,
      institutions,
      documents,
      faqs,
      whatIfScenarios,
      whatIfAnswers: whatIfScenarios,
      sources,
      officialSources: sources,
      chatbotAnswers: chatbotKnowledge,
    },
  };
};
