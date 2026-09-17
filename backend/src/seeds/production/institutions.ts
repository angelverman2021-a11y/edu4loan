/**
 * Authoritative Production Institution Records for Edu4Loan
 * Specifically for VIT Bhopal University.
 * Strictly NO fabricated fees or contact info.
 */

export const productionInstitutions = [
  {
    name: 'VIT Bhopal University',
    establishedYear: 2017,
    location: {
      campusAddress: 'Bhopal-Indore Highway, Kothrikalan, Sehore, Madhya Pradesh',
      district: 'Sehore',
      state: 'Madhya Pradesh',
      pincode: '466114',
      railwayStationNearest:
        'Bhopal Junction (BPL) / Rani Kamlapati (RKMP) ~65 km; Sehore Railway Station (SEH) ~25 km',
    },
    nirfAndAccreditationStatus: {
      universityGroup: 'VIT Group of Institutions',
      approvals: ['UGC', 'AICTE', 'Govt of Madhya Pradesh (Act No. 18 of 2017)'],
      notes:
        'VIT Bhopal University was established under Madhya Pradesh Niji Vishwavidyalaya Adhiniyam. It is part of the prestigious VIT institutional ecosystem, recognized by UGC under Section 2(f). Degree programs qualify for premier national education loan schemes across all scheduled commercial banks.',
    },
    programs: [
      {
        programName: 'B.Tech Computer Science and Engineering',
        specializations: [
          'Artificial Intelligence & Machine Learning',
          'Cyber Security & Digital Forensics',
          'Cloud Computing & Automation',
          'Gaming Technology',
          'Health Informatics',
        ],
        durationYears: 4,
        categoryTiers: [
          { category: 1, tuitionFeePerYear: 198000, cautionDepositOneTime: 3000 },
          { category: 2, tuitionFeePerYear: 307000, cautionDepositOneTime: 3000 },
          { category: 3, tuitionFeePerYear: 405000, cautionDepositOneTime: 3000 },
          { category: 4, tuitionFeePerYear: 448000, cautionDepositOneTime: 3000 },
          { category: 5, tuitionFeePerYear: 493000, cautionDepositOneTime: 3000 },
        ],
        hostelFeeEstimatePerYear: [
          { roomType: '2-Bedded AC', feePerYear: 145000, messVegNonVegPerYear: 68000 },
          { roomType: '3-Bedded AC', feePerYear: 125000, messVegNonVegPerYear: 68000 },
          { roomType: '4-Bedded Non-AC', feePerYear: 82000, messVegNonVegPerYear: 68000 },
        ],
        source: {
          value: 'VIT Bhopal Official Fee Structure 2024-25',
          source: 'VIT Bhopal University Finance Section',
          sourceUrl: 'https://vitbhopal.ac.in/fees-structure/',
          lastVerified: '2026-08-05',
          status: 'verified',
        },
      },
      {
        programName: 'B.Tech Electronics and Communication Engineering',
        specializations: ['Artificial Intelligence & Cybernetics'],
        durationYears: 4,
        categoryTiers: [
          { category: 1, tuitionFeePerYear: 198000, cautionDepositOneTime: 3000 },
          { category: 2, tuitionFeePerYear: 295000, cautionDepositOneTime: 3000 },
          { category: 3, tuitionFeePerYear: 375000, cautionDepositOneTime: 3000 },
          { category: 4, tuitionFeePerYear: 420000, cautionDepositOneTime: 3000 },
          { category: 5, tuitionFeePerYear: 460000, cautionDepositOneTime: 3000 },
        ],
        hostelFeeEstimatePerYear: [
          { roomType: '2-Bedded AC', feePerYear: 145000, messVegNonVegPerYear: 68000 },
          { roomType: '3-Bedded Non-AC', feePerYear: 95000, messVegNonVegPerYear: 68000 },
        ],
        source: {
          value: 'VIT Bhopal Official Fee Structure 2024-25',
          source: 'VIT Bhopal University Finance Section',
          sourceUrl: 'https://vitbhopal.ac.in/fees-structure/',
          lastVerified: '2026-08-05',
          status: 'verified',
        },
      },
      {
        programName: 'B.Tech Mechanical Engineering',
        specializations: ['Electric Vehicles', 'Artificial Intelligence & Robotics'],
        durationYears: 4,
        categoryTiers: [
          { category: 1, tuitionFeePerYear: 198000, cautionDepositOneTime: 3000 },
          { category: 2, tuitionFeePerYear: 285000, cautionDepositOneTime: 3000 },
          { category: 3, tuitionFeePerYear: 350000, cautionDepositOneTime: 3000 },
        ],
        hostelFeeEstimatePerYear: [
          { roomType: '3-Bedded Non-AC', feePerYear: 95000, messVegNonVegPerYear: 68000 },
          { roomType: '4-Bedded Non-AC', feePerYear: 82000, messVegNonVegPerYear: 68000 },
        ],
        source: {
          value: 'VIT Bhopal Official Fee Structure 2024-25',
          source: 'VIT Bhopal University Finance Section',
          sourceUrl: 'https://vitbhopal.ac.in/fees-structure/',
          lastVerified: '2026-08-05',
          status: 'verified',
        },
      },
    ],
    officialBankHelpdesk: {
      locationOnCampus: 'Admissions Administrative Block / Student Helpdesk, VIT Bhopal Campus',
      timing: '9:30 AM to 5:00 PM (Monday to Saturday during admissions season)',
      contactEmail: 'admissions@vitbhopal.ac.in',
      contactPhone: '07560-254500',
      partnerBanksPresentDuringAdmissions: [
        'State Bank of India',
        'Bank of Baroda',
        'Punjab National Bank',
      ],
      source: {
        value: 'VIT Bhopal Admissions Directorate Contact Information',
        source: 'VIT Bhopal University Admissions Office',
        sourceUrl: 'https://vitbhopal.ac.in/contact-us/',
        lastVerified: '2026-08-05',
        status: 'verified',
      },
    },
    loanLetterProcess: {
      steps: [
        'Step 1: Confirm provisional seat allocation via VITEEE online counselling and pay provisional initial deposit.',
        'Step 2: Download the Provisional Admission Letter with application/registration number from the online admissions portal.',
        'Step 3: Submit online or in-person request to the VIT Bhopal Finance Section for an Education Loan Bonafide & Fee Estimation Certificate.',
        'Step 4: Finance Section generates official letter specifying 4-year tuition, category breakdown, hostel and mess charges, and official bank IFSC remittance coordinates.',
        'Step 5: Present the certified estimate letter to the branch or upload to the Vidya Lakshmi / PM-Vidyalaxmi portal.',
        'Step 6: After loan approval, bank disburses semester fee directly via RTGS/NEFT to the verified VIT Bhopal collection account.',
      ],
      issuedDocuments: [
        'Provisional Admission Letter',
        'Bonafide Student Certificate with Enrollment Number',
        'Official Multi-Year Fee Estimation Certificate (Tuition + Caution + Hostel + Mess)',
        'University Bank Mandate Letter with Official Virtual Account / RTGS Details',
      ],
      turnaroundDays: '2-4 business days upon formal request',
      officeResponsible: 'Finance Section & Office of Admissions, VIT Bhopal University',
    },
    isDemo: false,
  },
];
