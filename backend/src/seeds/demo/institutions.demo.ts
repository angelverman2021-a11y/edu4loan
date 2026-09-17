/**
 * Demo Institution Seed Data for Edu4Loan
 * MUST have isDemo: true.
 * Tagged: DEMO DATA — NOT FOR PRODUCTION
 */

export const demoInstitutions = [
  {
    name: 'Demo Institute of Technology (DEMO)',
    establishedYear: 2020,
    location: {
      campusAddress: 'Demo Knowledge Park, Sector 5, Bhopal, Madhya Pradesh',
      district: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462001',
      railwayStationNearest: 'Bhopal Junction ~10 km',
    },
    nirfAndAccreditationStatus: {
      universityGroup: 'Demo Educational Trust',
      approvals: ['AICTE (Demo)'],
      notes: '[DEMO DATA — NOT FOR PRODUCTION] Simulated institution profile for integration testing.',
    },
    programs: [
      {
        programName: 'B.Tech Information Technology (DEMO)',
        specializations: ['Data Science'],
        durationYears: 4,
        categoryTiers: [
          { category: 1, tuitionFeePerYear: 150000, cautionDepositOneTime: 5000 },
          { category: 2, tuitionFeePerYear: 200000, cautionDepositOneTime: 5000 },
        ],
        hostelFeeEstimatePerYear: [
          { roomType: 'Double Occupancy (Demo)', feePerYear: 80000, messVegNonVegPerYear: 50000 },
        ],
        source: {
          value: '[DEMO DATA — NOT FOR PRODUCTION] Simulated fee data',
          source: 'Demo Testing Section',
          sourceUrl: 'https://example.com/demo-fees',
          lastVerified: '2026-08-01',
          status: 'needs_verification',
        },
      },
    ],
    officialBankHelpdesk: {
      locationOnCampus: 'Demo Admin Building Desk 3',
      timing: '10:00 AM to 4:00 PM',
      contactEmail: 'demo-desk@example.com',
      contactPhone: '0755-000000',
      partnerBanksPresentDuringAdmissions: ['Demo Federal Trust Bank'],
      source: {
        value: '[DEMO DATA — NOT FOR PRODUCTION] Simulated desk info',
        source: 'Demo Admin Office',
        sourceUrl: 'https://example.com/demo-desk',
        lastVerified: '2026-08-01',
        status: 'needs_verification',
      },
    },
    loanLetterProcess: {
      steps: [
        'Step 1: Download demo letter from student portal',
        'Step 2: Submit to bank for test loan sanction',
      ],
      issuedDocuments: ['Demo Provisional Letter', 'Demo Fee Estimate'],
      turnaroundDays: '1-2 business days',
      officeResponsible: 'Demo Student Records Office',
    },
    isDemo: true,
  },
];
