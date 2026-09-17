/**
 * Demo Banks Seed Data for Edu4Loan
 * MUST have isDemo: true, status: 'needs_verification'.
 * Tagged: DEMO DATA — NOT FOR PRODUCTION
 */

export const demoBanks = [
  {
    name: 'Demo Federal Trust Bank',
    slug: 'demo-federal-trust-bank',
    shortCode: 'DFTB',
    category: 'private',
    logoUrl: 'https://banklogo.edu4loan.org/demo-bank.svg',
    officialWebsite: 'https://example.com/dftb',
    educationLoanPortalUrl: 'https://example.com/dftb/education-loans',
    vidyaLakshmiRegistered: true,
    pmVidyalaxmiRegistered: false,
    tollFreeNumber: '1800-00-0000',
    headquarters: 'Demo Financial Tower, Mumbai',
    vitBhopalTieUp: {
      hasFormalMOU: false,
      onCampusDeskAvailable: false,
      designatedBranchName: 'Demo Bhopal Branch',
      details: '[DEMO DATA — NOT FOR PRODUCTION] Simulated private bank for testing demo flows.',
      source: 'Internal Demo Seed Dataset',
      sourceUrl: 'https://example.com/sources/demo-bank',
      lastVerified: '2026-08-01',
      status: 'needs_verification',
    },
    branches: [
      {
        branchName: 'DFTB Bhopal Commercial Branch',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        address: 'Demo Street, Bhopal, MP',
        pincode: '462001',
        isNodalForVitBhopal: false,
      },
    ],
    generalTurnaroundTimeDays: '7-10 business days',
    overallSource: {
      value: '[DEMO DATA — NOT FOR PRODUCTION] Simulated Federal Trust Bank profile for offline dev',
      source: 'Internal Test Suite',
      sourceUrl: 'https://example.com/sources/demo-bank',
      lastVerified: '2026-08-01',
      status: 'needs_verification',
    },
    isDemo: true,
  },
  {
    name: 'Demo Apex Urban Bank',
    slug: 'demo-apex-urban-bank',
    shortCode: 'DAUB',
    category: 'private',
    logoUrl: 'https://banklogo.edu4loan.org/demo-apex.svg',
    officialWebsite: 'https://example.com/daub',
    educationLoanPortalUrl: 'https://example.com/daub/loans',
    vidyaLakshmiRegistered: false,
    pmVidyalaxmiRegistered: false,
    tollFreeNumber: '1800-11-0000',
    headquarters: 'Demo Cyber City, Gurugram',
    vitBhopalTieUp: {
      hasFormalMOU: false,
      onCampusDeskAvailable: false,
      designatedBranchName: 'Demo Branch',
      details: '[DEMO DATA — NOT FOR PRODUCTION] Simulated Urban Bank.',
      source: 'Internal Demo Seed Dataset',
      sourceUrl: 'https://example.com/sources/demo-bank-2',
      lastVerified: '2026-08-01',
      status: 'needs_verification',
    },
    branches: [
      {
        branchName: 'DAUB Indore Branch',
        city: 'Indore',
        state: 'Madhya Pradesh',
        address: 'Demo Road, Indore, MP',
        pincode: '452001',
        isNodalForVitBhopal: false,
      },
    ],
    generalTurnaroundTimeDays: '10-14 business days',
    overallSource: {
      value: '[DEMO DATA — NOT FOR PRODUCTION] Simulated Apex Urban Bank for integration test',
      source: 'Internal Test Suite',
      sourceUrl: 'https://example.com/sources/demo-bank-2',
      lastVerified: '2026-08-01',
      status: 'needs_verification',
    },
    isDemo: true,
  },
];
