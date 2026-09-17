/**
 * Demo Documents Seed Data for Edu4Loan
 * MUST have isDemo: true, status: 'needs_verification'.
 * Tagged: DEMO DATA — NOT FOR PRODUCTION
 */

export const demoDocuments = [
  {
    name: 'Sample Mock Bank Application Addendum (DEMO)',
    category: 'bank_specific_forms',
    description:
      '[DEMO DATA — NOT FOR PRODUCTION] Dummy application appendix used for automated form validation tests.',
    isRequired: false,
    applicableCondition: 'For testing document upload pipelines only.',
    issuingAuthority: 'Demo Test Authority',
    verificationTip: '[DEMO DATA — NOT FOR PRODUCTION] Test tip for demo checklist.',
    source: {
      value: '[DEMO DATA — NOT FOR PRODUCTION] Mock document citation',
      source: 'Edu4Loan QA Team',
      sourceUrl: 'https://example.com/demo-doc-source',
      lastVerified: '2026-08-01',
      status: 'needs_verification',
    },
    isDemo: true,
  },
  {
    name: 'Mock Income Self-Declaration Affidavit (DEMO)',
    category: 'coapplicant_income_selfemployed',
    description:
      '[DEMO DATA — NOT FOR PRODUCTION] Simulated affidavit template for unorganized sector income demonstration.',
    isRequired: false,
    applicableCondition: 'Used in test scenarios where ITR is not available.',
    issuingAuthority: 'Mock Notary Office',
    verificationTip: '[DEMO DATA — NOT FOR PRODUCTION] Cross check with local authority format.',
    source: {
      value: '[DEMO DATA — NOT FOR PRODUCTION] Mock citation',
      source: 'Edu4Loan QA Team',
      sourceUrl: 'https://example.com/demo-doc-source-2',
      lastVerified: '2026-08-01',
      status: 'needs_verification',
    },
    isDemo: true,
  },
];
