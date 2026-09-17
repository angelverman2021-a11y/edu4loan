/**
 * Authoritative Production Government Scheme Records for Edu4Loan
 * Strictly NO fabricated benefits or criteria.
 * Explicitly separates PM-Vidyalaxmi (2024 subvention) from Vidya Lakshmi (CELFS portal).
 */

export const productionGovernmentSchemes = [
  {
    schemeName: 'PM-Vidyalaxmi Scheme (Central Sector Scheme 2024)',
    schemeCode: 'PM_VIDYALAXMI',
    managingAuthority: 'Department of Higher Education, Ministry of Education, Government of India',
    targetBeneficiaries:
      'Students admitted to top 100 NIRF higher educational institutions (overall and category) and top 100-200 state govt HEIs with family income up to 8 Lakhs.',
    incomeCeilingPerAnnum: 800000,
    keyBenefits: [
      '3% interest subvention during moratorium period on education loans up to Rs 10 Lakhs',
      '75% credit guarantee by Government of India for collateral-free loans up to Rs 7.5 Lakhs',
      'Digital, transparent, student-centric application process via unified PM-Vidyalaxmi portal',
      'Interest subvention credited directly through digital e-vouchers / Aadhaar linked accounts',
      'Covers both government and eligible private institutions meeting NIRF criteria',
    ],
    eligibilityConditions: [
      'Student must secure admission in an eligible institution ranking in top 100 NIRF or top 200 state govt HEIs',
      'Gross annual family income from all sources must not exceed Rs 8,00,000 (8 Lakhs)',
      'Student must not be receiving any other interest subvention or scholarship from Central or State Government',
      'Valid Aadhaar authentication and PAN required for student and co-borrower',
      'Must apply through the official PM-Vidyalaxmi portal',
    ],
    howToApplySteps: [
      'Step 1: Secure admission and bonafide fee estimation certificate from eligible institution',
      'Step 2: Register on the official PM-Vidyalaxmi portal (pmvidyalaxmi.gov.in) using Aadhaar authentication',
      'Step 3: Submit valid family income certificate issued by competent state revenue authority (Tehsildar / SDM)',
      'Step 4: Select participating scheduled commercial bank and submit loan application',
      'Step 5: Interest subvention e-vouchers are credited directly to the loan account upon sanction and disbursement',
    ],
    portalUrl: 'https://pmvidyalaxmi.gov.in',
    vitBhopalRelevance:
      'VIT group institutions maintain top NIRF national rankings. Eligible students enrolled at VIT Bhopal under eligible NIRF umbrella or approved programs with family income <= Rs 8 Lakhs can claim the 3% interest subvention for loans up to Rs 10 Lakhs.',
    source: {
      value: 'Cabinet Decision and Ministry of Education PM-Vidyalaxmi Notification 2024',
      source: 'Ministry of Education, Government of India',
      sourceUrl: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2071239',
      lastVerified: '2026-08-01',
      status: 'verified',
    },
    isDemo: false,
  },
  {
    schemeName: 'Vidya Lakshmi Common Education Loan Application Portal (CELFS)',
    schemeCode: 'VIDYA_LAKSHMI_PORTAL',
    managingAuthority:
      'Department of Higher Education (MoE), Department of Financial Services (DFS), and Indian Banks Association (IBA); Developed & Maintained by Protean eGov Technologies Limited',
    targetBeneficiaries:
      'All Indian students seeking education loans for studies in India or abroad from 40+ scheduled commercial banks.',
    incomeCeilingPerAnnum: null,
    keyBenefits: [
      'Single Common Education Loan Application Form (CELFS) across 40+ member banks and 130+ schemes',
      'Apply to a maximum of 3 banks and 3 schemes simultaneously with one common form',
      'Transparent real-time online loan application tracking and dashboard',
      'Direct integration with National Scholarship Portal (NSP)',
      'No need to physically visit multiple bank branches for initial submission',
    ],
    eligibilityConditions: [
      'Must be an Indian National',
      'Must have secured admission to a recognized higher education course in India or abroad',
      'Student KYC (Aadhaar, PAN) and co-applicant KYC mandatory',
      'Admission proof and official university fee structure letter required',
    ],
    howToApplySteps: [
      'Step 1: Register on www.vidyalakshmi.co.in with mobile number and email',
      'Step 2: Fill the Common Education Loan Application Form (CELFS) with student, course, expense, and co-borrower details',
      'Step 3: Search and select up to 3 bank loan schemes matching your requirements',
      'Step 4: Upload required KYC, academic marksheets, and institution fee estimation documents',
      'Step 5: Submit application online and note down the CELFS application reference ID',
      'Step 6: Track loan status online; visit selected branch if contacted for original document verification',
    ],
    portalUrl: 'https://www.vidyalakshmi.co.in/Students/',
    vitBhopalRelevance:
      'VIT Bhopal students should use the Vidya Lakshmi portal to submit applications to SBI Ashta, BoB, PNB, or other banks. Mentioning the VIT Bhopal admission registration number and course details in CELFS streamlines branch-level processing.',
    source: {
      value: 'Vidya Lakshmi Portal Guidelines by Ministry of Education & Protean',
      source: 'Department of Higher Education, Govt of India',
      sourceUrl: 'https://www.vidyalakshmi.co.in/Students/',
      lastVerified: '2026-08-15',
      status: 'verified',
    },
    isDemo: false,
  },
  {
    schemeName: 'Central Sector Interest Subsidy Scheme (CSIS)',
    schemeCode: 'CSIS',
    managingAuthority:
      'Ministry of Education, Government of India (Administered via Canara Bank Nodal Cell)',
    targetBeneficiaries:
      'Economically Weaker Section (EWS) students pursuing professional/technical courses in India.',
    incomeCeilingPerAnnum: 450000,
    keyBenefits: [
      '100% full interest subsidy during the moratorium period (course duration + 1 year)',
      'No interest is charged to the student during course study and moratorium',
      'Covers education loans sanctioned under IBA model scheme up to Rs 10 Lakhs',
      'Direct government subsidy credit into the student loan account',
    ],
    eligibilityConditions: [
      'Annual gross parental income from all sources must not exceed Rs 4,50,000 (4.5 Lakhs)',
      'Income certificate issued strictly by state revenue authority competent under state government rules (Tehsildar / SDM)',
      'Course must be an approved professional or technical degree in India (such as B.Tech)',
      'Loan must be availed from an IBA member scheduled commercial bank',
    ],
    howToApplySteps: [
      'Step 1: Apply for education loan at any IBA member bank (via Vidya Lakshmi portal or branch)',
      'Step 2: Submit valid EWS Family Income Certificate issued by Tehsildar / Sub-Divisional Magistrate',
      'Step 3: Bank verifies EWS eligibility and flags the loan account on the Canara Bank CSIS portal',
      'Step 4: Government disburses interest subsidy directly into the bank loan account annually',
    ],
    portalUrl: 'https://www.canarabank.com/csis',
    vitBhopalRelevance:
      'B.Tech students at VIT Bhopal whose parental annual income is <= Rs 4.5 Lakhs can save tens of thousands in interest during their 4-year degree + 1-year buffer by availing CSIS through their lending bank.',
    source: {
      value: 'Ministry of Education Central Sector Interest Subsidy Guidelines',
      source: 'Department of Higher Education, Govt of India',
      sourceUrl: 'https://www.education.gov.in/scholarships-education-loan-4',
      lastVerified: '2026-08-01',
      status: 'verified',
    },
    isDemo: false,
  },
];
