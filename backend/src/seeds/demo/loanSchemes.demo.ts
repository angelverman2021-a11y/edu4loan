/**
 * Demo Loan Schemes Seed Data for Edu4Loan
 * MUST have isDemo: true, status: 'needs_verification'.
 * Tagged: DEMO DATA — NOT FOR PRODUCTION
 */

export const getDemoLoanSchemes = (bankMap: Record<string, string>) => [
  {
    bankId: bankMap['demo-federal-trust-bank'] || bankMap['state-bank-of-india'],
    bankName: 'Demo Federal Trust Bank',
    schemeName: 'DFTB Scholar Advantage Scheme (DEMO)',
    schemeCode: 'DEMO_DFTB_SCHOLAR',
    overview:
      '[DEMO DATA — NOT FOR PRODUCTION] Simulated premier education loan for testing portal calculations.',
    targetDegreeLevel: ['Undergraduate', 'Postgraduate'],
    eligibilityCriteria: [
      '[DEMO DATA — NOT FOR PRODUCTION] Indian National with confirmed admission',
      'Co-applicant mandatory with minimum demo CIBIL score',
    ],
    maxLoanAmountInland: {
      value: 4000000,
      source: 'Internal Demo Seed Dataset',
      sourceUrl: 'https://example.com/demo-source',
      lastVerified: '2026-08-01',
      status: 'needs_verification',
    },
    interestRate: {
      benchmarkType: 'EBLR',
      benchmarkRatePercent: 6.5,
      spreadPercentMin: 2.5,
      spreadPercentMax: 4.0,
      minRate: {
        value: 9.0,
        source: 'Internal Demo Seed Dataset',
        sourceUrl: 'https://example.com/demo-source',
        lastVerified: '2026-08-01',
        status: 'needs_verification',
      },
      maxRate: {
        value: 10.5,
        source: 'Internal Demo Seed Dataset',
        sourceUrl: 'https://example.com/demo-source',
        lastVerified: '2026-08-01',
        status: 'needs_verification',
      },
      girlChildConcessionPercent: {
        value: 0.5,
        source: 'Internal Demo Seed Dataset',
        sourceUrl: 'https://example.com/demo-source',
        lastVerified: '2026-08-01',
        status: 'needs_verification',
      },
      notes: '[DEMO DATA — NOT FOR PRODUCTION] Demo interest structure for UI testing.',
    },
    collateral: {
      upTo4Lakhs: 'No collateral (Demo test criteria)',
      from4To7point5Lakhs: 'Third-party guarantee (Demo test criteria)',
      above7point5Lakhs: 'Tangible collateral required',
      acceptableCollateralTypes: ['House Property', 'Fixed Deposit'],
      details: '[DEMO DATA — NOT FOR PRODUCTION] Demo collateral rules.',
    },
    marginMoney: {
      upTo4LakhsPercent: 0,
      above4LakhsIndiaPercent: 5,
      scholarshipAdjustmentAllowed: true,
      notes: '[DEMO DATA — NOT FOR PRODUCTION] 5% margin above 4 Lakhs.',
    },
    moratorium: {
      courseDurationYears: 4,
      moratoriumBufferMonths: 6,
      repaymentTenureMaxYears: 12,
      interestServicingDuringMoratorium: 'optional_simple',
      explanation: '[DEMO DATA — NOT FOR PRODUCTION] 4-year course + 6-month buffer.',
    },
    processingFee: {
      value: 'Rs 5,000 + GST (Demo)',
      source: 'Internal Demo Seed Dataset',
      sourceUrl: 'https://example.com/demo-source',
      lastVerified: '2026-08-01',
      status: 'needs_verification',
    },
    prepaymentPenalty: {
      value: 'Nil (RBI rules)',
      source: 'Internal Demo Seed Dataset',
      sourceUrl: 'https://example.com/demo-source',
      lastVerified: '2026-08-01',
      status: 'needs_verification',
    },
    section80ETaxBenefitApplicable: true,
    vitBhopalEligible: true,
    vitBhopalCategoryNote: '[DEMO DATA — NOT FOR PRODUCTION] Simulated scheme.',
    officialCircularUrl: 'https://example.com/demo-circular',
    officialApplicationUrl: 'https://example.com/demo-apply',
    source: {
      value: '[DEMO DATA — NOT FOR PRODUCTION] Internal test scheme data',
      source: 'Edu4Loan Internal QA Team',
      sourceUrl: 'https://example.com/demo-source',
      lastVerified: '2026-08-01',
      status: 'needs_verification',
    },
    status: 'needs_verification',
    lastVerified: '2026-08-01',
    isDemo: true,
  },
];
