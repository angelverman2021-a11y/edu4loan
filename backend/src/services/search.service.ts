import { Bank } from "../models/Bank";
import { LoanScheme } from "../models/LoanScheme";
import { GovernmentScheme } from "../models/GovernmentScheme";
import { Institution } from "../models/Institution";
import { DocumentModel } from "../models/Document";
import { FAQ } from "../models/FAQ";
import { WhatIfScenario } from "../models/WhatIfScenario";
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
  };
  banks: any[];
  loanSchemes: any[];
  governmentSchemes: any[];
  institutions: any[];
  documents: any[];
  faqs: any[];
  whatIfScenarios: any[];
  results: {
    banks: any[];
    loanSchemes: any[];
    governmentSchemes: any[];
    institutions: any[];
    documents: any[];
    faqs: any[];
    whatIfScenarios: any[];
  };
}

export const executeGlobalSearch = async (queryString: string | undefined): Promise<SearchResult> => {
  const sanitized = sanitizeString(queryString);

  if (!sanitized || sanitized.length < 2) {
    return {
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
      },
      banks: [],
      loanSchemes: [],
      governmentSchemes: [],
      institutions: [],
      documents: [],
      faqs: [],
      whatIfScenarios: [],
      results: {
        banks: [],
        loanSchemes: [],
        governmentSchemes: [],
        institutions: [],
        documents: [],
        faqs: [],
        whatIfScenarios: [],
      },
    };
  }

  // Synonym expansion for vernacular / conversational queries
  const lower = sanitized.toLowerCase();
  let searchPattern = sanitized;
  if (lower.includes("salary slip") || lower.includes("payslip")) {
    searchPattern = "salary|payslip|income proof|Form 16|ITR";
  } else if (lower.includes("self employ") || lower.includes("business")) {
    searchPattern = "self employed|business|ITR|balance sheet";
  } else if (lower.includes("collateral") || lower.includes("property") || lower.includes("security")) {
    searchPattern = "collateral|security|guarantee|CGFSEL";
  } else if (lower.includes("cibil") || lower.includes("credit score")) {
    searchPattern = "cibil|credit|score";
  } else if (lower.includes("processing time") || lower.includes("turnaround") || lower.includes("how long")) {
    searchPattern = "processing time|turnaround|days|timeline";
  } else if (lower.includes("parent") || lower.includes("माता-पिता") || lower.includes("વાલી")) {
    searchPattern = "parent|co-applicant|guarantor";
  } else if (lower.includes("ગુજરાતી") || lower.includes("gujarati") || lower.includes("hindi") || lower.includes("हिंदी")) {
    searchPattern = "parent mode|education loan|scheme";
  }

  const isExpanded = searchPattern !== sanitized;
  const regex = isExpanded
    ? { $regex: searchPattern, $options: "i" }
    : { $regex: escapeRegex(sanitized), $options: "i" };

  // Run searches across all 7 collections concurrently
  const [banks, loanSchemes, governmentSchemes, institutions, documents, faqs, whatIfScenarios] = await Promise.all([
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
  ]);

  const totalMatches =
    banks.length +
    loanSchemes.length +
    governmentSchemes.length +
    institutions.length +
    documents.length +
    faqs.length +
    whatIfScenarios.length;

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
    },
    banks,
    loanSchemes,
    governmentSchemes,
    institutions,
    documents,
    faqs,
    whatIfScenarios,
    results: {
      banks,
      loanSchemes,
      governmentSchemes,
      institutions,
      documents,
      faqs,
      whatIfScenarios,
    },
  };
};
