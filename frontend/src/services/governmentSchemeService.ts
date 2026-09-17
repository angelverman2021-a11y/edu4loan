import { api } from './api';
import {
  GovernmentSchemeItem,
  SubsidyCheckParams,
  SubsidyCheckResult,
} from '@/types';

// Fallback authoritative seeds for offline resilience
const FALLBACK_SCHEMES: GovernmentSchemeItem[] = [
  {
    code: 'PM_VIDYALAXMI',
    name: 'PM-Vidyalaxmi Scheme (Cabinet Approved 2024)',
    nodalMinistry: 'Department of Higher Education, Ministry of Education',
    description:
      'Mission-mode central sector initiative to ensure financial constraints never prevent meritorious students from pursuing quality higher education in top NIRF institutions.',
    officialPortalUrl: 'https://pmvidyalaxmi.education.gov.in',
    launchYear: 2024,
    subsidyDetails: {
      interestSubventionPercent: 3.0,
      coveragePercent: 75,
      maxLoanLimit: 1000000,
    },
    eligibilityCriteria: {
      incomeCeilingAnnual: 800000,
      courseType: ['Undergraduate', 'Postgraduate', 'Professional', 'Technical'],
      institutionCriteria: 'Higher Educational Institutions (HEIs) ranked in top 100 NIRF overall/category or 101-200.',
    },
    applicableInstitutions: 'Top 100/200 NIRF Higher Educational Institutions in India (including VIT).',
    targetBeneficiaries: 'Students admitted to eligible HEIs with annual family income up to ₹8 Lakhs.',
    status: 'verified',
    lastVerified: '2026-09-01',
    keyFeatures: [
      '3% Annual Interest Subvention on loans up to ₹10 Lakhs during moratorium period.',
      '75% Credit Guarantee coverage by NCGTC for loans up to ₹7.5 Lakhs.',
      'Seamless digital evaluation and direct electronic payment of subvention.',
      'Integrated with Unified Portal for single-window application and tracking.',
    ],
  },
  {
    code: 'CSIS',
    name: 'Central Sector Interest Subsidy Scheme (CSIS)',
    nodalMinistry: 'Ministry of Education, Government of India',
    description:
      'Provides full 100% interest waiver during the moratorium period (course duration + 1 year) for economically weaker students pursuing approved professional/technical degrees.',
    officialPortalUrl: 'https://www.education.gov.in/schemes',
    launchYear: 2009,
    subsidyDetails: {
      interestFreeMoratorium: true,
      maxLoanLimit: 1000000,
    },
    eligibilityCriteria: {
      incomeCeilingAnnual: 450000,
      courseType: ['Professional', 'Technical Degrees (e.g. B.Tech, MCA, M.Tech)'],
      institutionCriteria: 'NAAC / NBA accredited or Centrally Funded Technical Institutions.',
    },
    applicableInstitutions: 'All recognized technical and professional institutions in India.',
    targetBeneficiaries: 'Economically Weaker Section (EWS) students with annual family income up to ₹4.5 Lakhs.',
    status: 'verified',
    lastVerified: '2026-08-20',
    keyFeatures: [
      '100% Government of India interest reimbursement during entire course + 1 year grace period.',
      'Student only pays principal and interest accrued starting from the commencement of repayment.',
      'Income certificate issued by competent State Revenue Authority (Tahsildar / SDO) is mandatory.',
      'Claimed directly by Member Lending Banks through the Canara Bank Nodal Portal.',
    ],
  },
  {
    code: 'VIDYA_LAKSHMI_PORTAL',
    name: 'Vidya Lakshmi Portal (VLP)',
    nodalMinistry: 'Department of Financial Services (DFS) & Ministry of Education',
    description:
      'First-of-its-kind unified gateway for students seeking education loans and government scholarships, developed and maintained by NSDL e-Governance Infrastructure Ltd.',
    officialPortalUrl: 'https://www.vidyalakshmi.co.in',
    launchYear: 2015,
    subsidyDetails: {
      coveragePercent: 100,
    },
    eligibilityCriteria: {
      courseType: ['All Courses'],
      institutionCriteria: 'Recognized Indian and Foreign Universities.',
    },
    applicableInstitutions: 'All Indian and Foreign Accredited Universities.',
    targetBeneficiaries: 'All students applying for educational loans across 40+ member banks.',
    status: 'verified',
    lastVerified: '2026-08-15',
    keyFeatures: [
      'Single Common Educational Loan Application Form (CELFS) accepted across all major banks.',
      'Apply to up to 3 different banks and loan schemes simultaneously through a single portal.',
      'Real-time status tracking from application submission to final sanction.',
      'Direct grievance escalation and bank loan officer communication desk.',
    ],
  },
  {
    code: 'CGFSEL',
    name: 'Credit Guarantee Fund Scheme for Education Loans (CGFSEL)',
    nodalMinistry: 'Department of Higher Education via NCGTC',
    description:
      'Statutory credit guarantee mechanism administered by the National Credit Guarantee Trustee Company (NCGTC) to protect banks against defaults on collateral-free education loans.',
    officialPortalUrl: 'https://www.ncgtc.in/en/cgfsel',
    launchYear: 2015,
    subsidyDetails: {
      coveragePercent: 75,
      maxLoanLimit: 750000,
    },
    eligibilityCriteria: {
      courseType: ['Approved Higher Education'],
      institutionCriteria: 'Recognized institutions under IBA Model Scheme.',
    },
    applicableInstitutions: 'All IBA-affiliated member lending banks in India.',
    targetBeneficiaries: 'Students taking education loans up to ₹7.5 Lakhs without physical collateral.',
    status: 'verified',
    lastVerified: '2026-08-10',
    keyFeatures: [
      'Guarantees 75% of default exposure to Member Lending Institutions (MLIs).',
      'Enables students to secure loans between ₹4L and ₹7.5L without pledging family home or land deeds.',
      'Guarantee fee is paid directly by banks or structured into loan pricing without upfront burden.',
    ],
  },
];

export const governmentSchemeService = {
  /**
   * Fetch all government schemes
   */
  fetchGovernmentSchemes: async (): Promise<GovernmentSchemeItem[]> => {
    try {
      const res = await api.get<GovernmentSchemeItem[]>('/government-schemes');
      if (res.data && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn('Backend government-schemes API unavailable, using local fallback:', err);
    }
    return FALLBACK_SCHEMES;
  },

  /**
   * Fetch scheme by code / alias
   */
  fetchSchemeByCode: async (code: string): Promise<GovernmentSchemeItem | null> => {
    try {
      const res = await api.get<GovernmentSchemeItem>(`/government-schemes/${code}`);
      if (res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn(`Backend scheme fetch failed for ${code}, resolving locally:`, err);
    }

    const norm = code.toUpperCase().replace(/-/g, '_');
    const found = FALLBACK_SCHEMES.find(
      (s) => s.code === norm || s.code.includes(norm) || norm.includes(s.code)
    );
    return found || null;
  },

  /**
   * Evaluate central subsidy eligibility based on income, degree, and loan quantum
   */
  evaluateSubsidyEligibility: (params: SubsidyCheckParams): SubsidyCheckResult => {
    const income = params.annualIncome;
    const loanAmt = params.loanAmount;
    const isTopNirf = params.institutionType === 'nirf_top_100_200';

    const isCsisEligible = income <= 450000;
    const isPmVidyalaxmiEligible = income <= 800000 && isTopNirf && loanAmt <= 1000000;
    const isCgfselEligible = loanAmt <= 750000;

    const matchedSchemes: SubsidyCheckResult['matchedSchemes'] = [];

    // 1. CSIS
    if (isCsisEligible) {
      matchedSchemes.push({
        code: 'CSIS',
        name: 'Central Sector Interest Subsidy (CSIS)',
        benefit: '100% Full Interest Waiver during Moratorium',
        subventionRate: '100% of Accrued Interest',
        incomeCeiling: 'Gross Family Income ≤ ₹4.5 Lakhs/year',
        badgeVariant: 'verified',
        notes:
          'Government of India pays 100% of simple interest accrued during the 4-year degree plus 1-year grace period. Competent revenue authority income certificate required.',
      });
    }

    // 2. PM-Vidyalaxmi
    if (isPmVidyalaxmiEligible) {
      matchedSchemes.push({
        code: 'PM_VIDYALAXMI',
        name: 'PM-Vidyalaxmi Scheme (2024)',
        benefit: '3.0% Annual Interest Subvention on loans up to ₹10 Lakhs',
        subventionRate: '3.0% p.a. Subvention',
        incomeCeiling: 'Annual Family Income ≤ ₹8.0 Lakhs/year',
        badgeVariant: 'verified',
        notes:
          'Applicable for higher education in top NIRF institutions. Direct e-voucher / digital payment subvention reducing your net interest payable.',
      });
    }

    // 3. CGFSEL Guarantee
    if (isCgfselEligible) {
      matchedSchemes.push({
        code: 'CGFSEL',
        name: 'Credit Guarantee Fund for Education Loans (CGFSEL)',
        benefit: '75% NCGTC Credit Guarantee (No Physical Property Collateral Required)',
        subventionRate: 'Credit Protection',
        incomeCeiling: 'No Income Limit (Applicable for loans up to ₹7.5 Lakhs)',
        badgeVariant: 'info',
        notes:
          'Enables banks to sanction loans between ₹4L and ₹7.5L without demanding residential property or commercial land mortgages.',
      });
    }

    let explanation = '';
    if (isCsisEligible && isPmVidyalaxmiEligible) {
      explanation =
        'Exceptional Eligibility: Your family income (≤ ₹4.5L) qualifies for 100% full interest waiver under CSIS during study. For loan components beyond CSIS or after moratorium, PM-Vidyalaxmi provisions may further assist.';
    } else if (isPmVidyalaxmiEligible) {
      explanation =
        'Eligible for PM-Vidyalaxmi: Your family income (≤ ₹8.0L) and admission to a premier institution qualify you for 3% interest subvention on loans up to ₹10 Lakhs.';
    } else if (isCsisEligible) {
      explanation =
        'Eligible for CSIS: Your annual family income qualifies for complete 100% interest waiver during the entire course of study and moratorium.';
    } else if (isCgfselEligible) {
      explanation =
        'Eligible for CGFSEL Guarantee: While family income exceeds interest subvention ceilings, your loan quantum qualifies for statutory collateral-free credit guarantee coverage.';
    } else {
      explanation =
        'Standard Education Loan Terms: Your profile exceeds central subsidy income ceilings and credit guarantee thresholds. Normal bank lending rates and standard tangible collateral rules apply.';
    }

    return {
      isCsisEligible,
      isPmVidyalaxmiEligible,
      isCgfselEligible,
      matchedSchemes,
      explanation,
    };
  },
};
