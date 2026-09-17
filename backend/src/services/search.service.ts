import { Bank } from '../models/Bank';
import { LoanScheme } from '../models/LoanScheme';
import { GovernmentScheme } from '../models/GovernmentScheme';
import { Institution } from '../models/Institution';
import { DocumentModel } from '../models/Document';
import { FAQ } from '../models/FAQ';
import { escapeRegex, sanitizeString } from '../utils/querySafety';

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
  };
  banks: any[];
  loanSchemes: any[];
  governmentSchemes: any[];
  institutions: any[];
  documents: any[];
  faqs: any[];
  results: {
    banks: any[];
    loanSchemes: any[];
    governmentSchemes: any[];
    institutions: any[];
    documents: any[];
    faqs: any[];
  };
}

export const executeGlobalSearch = async (queryString: string | undefined): Promise<SearchResult> => {
  const sanitized = sanitizeString(queryString);

  if (!sanitized || sanitized.length < 2) {
    return {
      query: sanitized || '',
      totalMatches: 0,
      summary: {
        totalMatches: 0,
        banksCount: 0,
        loanSchemesCount: 0,
        governmentSchemesCount: 0,
        institutionsCount: 0,
        documentsCount: 0,
        faqsCount: 0,
      },
      banks: [],
      loanSchemes: [],
      governmentSchemes: [],
      institutions: [],
      documents: [],
      faqs: [],
      results: {
        banks: [],
        loanSchemes: [],
        governmentSchemes: [],
        institutions: [],
        documents: [],
        faqs: [],
      },
    };
  }

  const escaped = escapeRegex(sanitized);
  const regex = { $regex: escaped, $options: 'i' };

  // Run searches across all 6 collections concurrently
  const [banks, loanSchemes, governmentSchemes, institutions, documents, faqs] = await Promise.all([
    Bank.find({
      $or: [{ name: regex }, { slug: regex }, { shortCode: regex }, { headquarters: regex }],
    })
      .select('name slug shortCode category logoUrl officialWebsite vidyaLakshmiRegistered pmVidyalaxmiRegistered overallSource')
      .limit(10),

    LoanScheme.find({
      $or: [{ schemeName: regex }, { bankName: regex }, { schemeCode: regex }, { overview: regex }],
    })
      .select('schemeName schemeCode bankName interestRate maxLoanAmountInland status source officialApplicationUrl')
      .limit(10),

    GovernmentScheme.find({
      $or: [{ schemeName: regex }, { schemeCode: regex }, { managingAuthority: regex }, { keyBenefits: regex }],
    })
      .select('schemeName schemeCode managingAuthority incomeCeilingPerAnnum portalUrl vitBhopalRelevance source')
      .limit(10),

    Institution.find({
      $or: [{ name: regex }, { 'location.campusAddress': regex }, { 'nirfAndAccreditationStatus.notes': regex }],
    })
      .select('name location nirfAndAccreditationStatus programs officialBankHelpdesk')
      .limit(5),

    DocumentModel.find({
      $or: [{ name: regex }, { description: regex }, { category: regex }, { issuingAuthority: regex }],
    })
      .select('name category description isRequired applicableCondition issuingAuthority verificationTip source')
      .limit(15),

    FAQ.find({
      $or: [{ question: regex }, { answer: regex }, { category: regex }, { tags: regex }],
    })
      .select('question answer category isHighPriority tags')
      .limit(10),
  ]);

  const totalMatches =
    banks.length +
    loanSchemes.length +
    governmentSchemes.length +
    institutions.length +
    documents.length +
    faqs.length;

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
    },
    banks,
    loanSchemes,
    governmentSchemes,
    institutions,
    documents,
    faqs,
    results: {
      banks,
      loanSchemes,
      governmentSchemes,
      institutions,
      documents,
      faqs,
    },
  };
};
