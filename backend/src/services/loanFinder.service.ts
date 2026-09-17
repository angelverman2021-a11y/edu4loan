import { LoanScheme } from '../models/LoanScheme';
import { Bank } from '../models/Bank';
import { AppError } from '../utils/apiResponse';

export interface LoanFinderInput {
  college?: string;
  course?: string;
  courseType?: string;
  yearOfStudy?: string | number;
  loanAmount?: number;
  requestedAmount?: number;
  studyLocation?: string;
  collateralAvailable?: boolean;
  hasCollateral?: boolean;
  coApplicant?: string;
  familyIncome?: number;
  annualFamilyIncome?: number;
  admissionType?: string;
  admissionConfirmed?: boolean;
  hostelRequired?: boolean;
  tuitionFee?: number;
  hostelFee?: number;
  otherExpenses?: number;
}

export interface MatchedScheme {
  schemeId: string;
  schemeName: string;
  schemeCode: string;
  bankName: string;
  bankSlug: string;
  bankCategory: string;
  interestRateRange: {
    min: number;
    max: number;
    benchmark: string;
    girlChildConcession?: number;
  };
  relevanceReasons: string[];
  collateralSummary: string;
  marginMoneySummary: string;
  moratoriumSummary: string;
  verification: {
    status: string;
    lastVerified: string;
    source: string;
    sourceUrl: string;
  };
  officialApplicationUrl: string;
}

export interface LoanFinderResult {
  message: string;
  disclaimer: string;
  inputSummary: {
    loanAmount: number;
    studyLocation: string;
    familyIncome: number | null;
    collateralAvailable: boolean;
  };
  totalFound: number;
  schemes: MatchedScheme[];
  matchingSchemes: MatchedScheme[];
  applicableGovernmentSchemes: {
    schemeName: string;
    schemeCode: string;
    benefit: string;
    portalUrl: string;
  }[];
}

export const findRelevantLoanSchemes = async (input: LoanFinderInput): Promise<LoanFinderResult> => {
  const rawAmount = input.loanAmount ?? input.requestedAmount;
  if (typeof rawAmount !== 'number' || isNaN(rawAmount) || rawAmount <= 0) {
    throw new AppError('A valid positive loan amount in ₹ is required.', 400, 'VALIDATION_ERROR');
  }

  const requestedAmount = rawAmount;
  const location = (input.studyLocation || 'india').toLowerCase();
  const rawIncome = input.familyIncome ?? input.annualFamilyIncome;
  const income = rawIncome !== undefined && rawIncome !== null ? Number(rawIncome) : null;
  const hasCollateral = Boolean(input.collateralAvailable ?? input.hasCollateral);

  // Fetch production schemes
  const schemes = await LoanScheme.find({ isDemo: false }).populate(
    'bankId',
    'name slug category vidyaLakshmiRegistered pmVidyalaxmiRegistered'
  );

  const matchedSchemes: MatchedScheme[] = [];

  for (const s of schemes) {
    const reasons: string[] = [];

    // 1. Institution Matching
    if (s.vitBhopalEligible) {
      reasons.push(
        'Institution matches: VIT Bhopal University degree programs qualify under recognized university norms for this scheme.'
      );
    } else {
      reasons.push('Institution matches: Approved technical/professional higher education courses in India.');
    }

    // 2. Loan Amount Limit Check
    const documentedMax = s.maxLoanAmountInland?.value || 0;
    if (documentedMax >= requestedAmount) {
      reasons.push(
        `Loan amount of ₹${requestedAmount.toLocaleString('en-IN')} falls within documented maximum inland limit of ₹${documentedMax.toLocaleString('en-IN')}.`
      );
    } else {
      reasons.push(
        `Note: Requested ₹${requestedAmount.toLocaleString('en-IN')} exceeds documented baseline inland limit of ₹${documentedMax.toLocaleString('en-IN')}; higher amounts require branch credit committee approval.`
      );
    }

    // 3. Study Location
    if (location === 'india') {
      reasons.push('Study location: Scheme is specifically designed for inland higher education studies in India.');
    }

    // 4. Collateral Framework
    if (requestedAmount <= 400000) {
      reasons.push(
        'Collateral framework: Under RBI priority guidelines, loans up to ₹4 Lakhs require nil tangible collateral and nil third-party guarantee.'
      );
    } else if (requestedAmount <= 750000) {
      reasons.push(
        'Collateral framework: Under RBI guidelines and CGFSEL cover, loans up to ₹7.5 Lakhs require suitable third-party guarantee or credit guarantee cover; tangible collateral is not mandatory.'
      );
    } else {
      if (hasCollateral) {
        reasons.push(
          'Collateral framework: For loans exceeding ₹7.5 Lakhs, student indicated collateral availability matching documented scheme tangible security requirements.'
        );
      } else {
        reasons.push(
          'Collateral notice: For loans exceeding ₹7.5 Lakhs, documented scheme terms require tangible collateral security (e.g. house property, FD, or government securities).'
        );
      }
    }

    // 5. Margin Money
    if (requestedAmount <= 400000) {
      reasons.push('Margin money: Nil (0%) margin money required for studies in India up to ₹4 Lakhs.');
    } else {
      reasons.push('Margin money: 5% margin money applies above ₹4 Lakhs for studies in India.');
    }

    // 6. Government Scheme Relevance (Conditional on family income)
    if (income !== null) {
      if (income <= 800000) {
        reasons.push(
          `Government subsidy relevance: Annual family income of ₹${income.toLocaleString('en-IN')} falls within the ₹8,00,000 ceiling for PM-Vidyalaxmi 3% interest subvention during moratorium (for eligible institutions under NIRF criteria).`
        );
      }
      if (income <= 450000) {
        reasons.push(
          `Central Sector Interest Subsidy (CSIS) relevance: Family income of ₹${income.toLocaleString('en-IN')} falls within the ₹4,50,000 ceiling for 100% full interest subsidy during the moratorium period.`
        );
      }
    }

    const bankObj: any = s.bankId || {};

    matchedSchemes.push({
      schemeId: s._id.toString(),
      schemeName: s.schemeName,
      schemeCode: s.schemeCode,
      bankName: s.bankName,
      bankSlug: bankObj.slug || '',
      bankCategory: bankObj.category || 'public',
      interestRateRange: {
        min: s.interestRate.minRate.value,
        max: s.interestRate.maxRate.value,
        benchmark: s.interestRate.benchmarkType,
        girlChildConcession: s.interestRate.girlChildConcessionPercent?.value,
      },
      relevanceReasons: reasons,
      collateralSummary:
        requestedAmount <= 400000
          ? s.collateral.upTo4Lakhs
          : requestedAmount <= 750000
          ? s.collateral.from4To7point5Lakhs
          : s.collateral.above7point5Lakhs,
      marginMoneySummary:
        requestedAmount <= 400000
          ? `${s.marginMoney.upTo4LakhsPercent}% up to ₹4 Lakhs`
          : `${s.marginMoney.above4LakhsIndiaPercent}% above ₹4 Lakhs`,
      moratoriumSummary: s.moratorium.explanation,
      verification: {
        status: s.status,
        lastVerified: s.lastVerified,
        source: s.source.source,
        sourceUrl: s.source.sourceUrl,
      },
      officialApplicationUrl: s.officialApplicationUrl,
    });
  }

  // Factual neutral alphabetical sort by schemeName — strictly NO subjective ranking!
  matchedSchemes.sort((a, b) => a.schemeName.localeCompare(b.schemeName));

  const applicableGovernmentSchemes = [];
  if (income !== null && income <= 800000) {
    applicableGovernmentSchemes.push({
      schemeName: 'PM-Vidyalaxmi Scheme (Central Sector Scheme 2024)',
      schemeCode: 'PM_VIDYALAXMI',
      benefit: '3% interest subvention during moratorium for family income <= ₹8 Lakhs at eligible HEIs.',
      portalUrl: 'https://pmvidyalaxmi.gov.in',
    });
  }
  if (income !== null && income <= 450000) {
    applicableGovernmentSchemes.push({
      schemeName: 'Central Sector Interest Subsidy Scheme (CSIS)',
      schemeCode: 'CSIS',
      benefit: '100% full interest subsidy during moratorium for EWS family income <= ₹4.5 Lakhs.',
      portalUrl: 'https://www.canarabank.com/csis',
    });
  }
  applicableGovernmentSchemes.push({
    schemeName: 'Vidya Lakshmi Common Education Loan Portal (CELFS)',
    schemeCode: 'VIDYA_LAKSHMI_PORTAL',
    benefit: 'Common application portal for 40+ scheduled commercial banks.',
    portalUrl: 'https://www.vidyalakshmi.co.in/Students/',
  });

  return {
    message:
      'Based on the information entered, these schemes may be relevant. Final eligibility is determined by the bank.',
    disclaimer:
      'Edu4Loan is an information and decision-support platform. It does not sanction, approve, or guarantee loan issuance. All sanctions and terms remain under the sole discretion of the respective lending institution.',
    inputSummary: {
      loanAmount: requestedAmount,
      studyLocation: location,
      familyIncome: income,
      collateralAvailable: hasCollateral,
    },
    totalFound: matchedSchemes.length,
    schemes: matchedSchemes,
    matchingSchemes: matchedSchemes,
    applicableGovernmentSchemes,
  };
};
