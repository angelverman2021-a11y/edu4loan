/**
 * Demo Government Scheme Seed Data for Edu4Loan
 * MUST have isDemo: true, status: 'needs_verification'.
 * Tagged: DEMO DATA — NOT FOR PRODUCTION
 */

export const demoGovernmentSchemes = [
  {
    schemeName: 'Credit Guarantee Fund Scheme for Education Loans (CGFSEL) [DEMO TEST RECORD]',
    schemeCode: 'CGFSEL',
    managingAuthority: 'National Credit Guarantee Trustee Company (NCGTC), Govt of India',
    targetBeneficiaries:
      '[DEMO DATA — NOT FOR PRODUCTION] Students obtaining collateral-free loans up to Rs 7.5 Lakhs without third-party guarantee.',
    incomeCeilingPerAnnum: null,
    keyBenefits: [
      '[DEMO DATA — NOT FOR PRODUCTION] Up to 75% credit guarantee on default amount',
      'Enables collateral-free sanction for students with no tangible security',
    ],
    eligibilityConditions: [
      '[DEMO DATA — NOT FOR PRODUCTION] Admission in recognized professional higher education courses',
      'Loan must be sanctioned under IBA model scheme up to Rs 7.5 Lakhs',
    ],
    howToApplySteps: [
      'Step 1: Student applies for loan at participating bank',
      'Step 2: Bank registers the loan account with NCGTC for credit guarantee cover',
    ],
    portalUrl: 'https://example.com/cgfsel-demo',
    vitBhopalRelevance:
      '[DEMO DATA — NOT FOR PRODUCTION] VIT Bhopal students applying for loans between 4L and 7.5L benefit from CGFSEL credit guarantee.',
    source: {
      value: '[DEMO DATA — NOT FOR PRODUCTION] Simulated CGFSEL guidance for test suite',
      source: 'Edu4Loan QA Mock Data',
      sourceUrl: 'https://example.com/cgfsel-source',
      lastVerified: '2026-08-01',
      status: 'needs_verification',
    },
    isDemo: true,
  },
];
