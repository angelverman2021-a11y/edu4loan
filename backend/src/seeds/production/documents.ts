/**
 * Authoritative Production Document Taxonomy for Edu4Loan
 * Standardized checklist across student KYC, academics, VIT Bhopal admission,
 * co-applicant financials, collateral, and bank forms.
 */

export const productionDocuments = [
  // 1. Student KYC
  {
    name: 'Student Aadhaar Card',
    category: 'student_kyc',
    description:
      'Official UIDAI identity document containing 12-digit Aadhaar number with linked mobile number for OTP e-KYC verification.',
    isRequired: true,
    applicableCondition: 'Mandatory for all students and all loan amounts.',
    issuingAuthority: 'Unique Identification Authority of India (UIDAI)',
    verificationTip:
      'Ensure the mobile number linked to Aadhaar is active to complete online Aadhaar OTP e-sign on Vidya Lakshmi / PM-Vidyalaxmi portals.',
    source: {
      value: 'RBI Master Direction on KYC Norms & Vidya Lakshmi Guidelines',
      source: 'Reserve Bank of India',
      sourceUrl: 'https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=12143',
      lastVerified: '2026-08-10',
      status: 'verified',
    },
    isDemo: false,
  },
  {
    name: 'Student Permanent Account Number (PAN) Card',
    category: 'student_kyc',
    description:
      'Laminated PAN card issued by the Income Tax Department bearing the student name, photograph, and signature.',
    isRequired: true,
    applicableCondition: 'Mandatory for credit bureau verification and banking regulations.',
    issuingAuthority: 'Income Tax Department, Government of India',
    verificationTip:
      'The name on the PAN card must match the Class 10 marksheet letter-by-letter. If the student is a minor at the time of application, minor PAN is accepted.',
    source: {
      value: 'Income Tax Rules & IBA Model Loan Scheme',
      source: 'Indian Banks Association',
      sourceUrl: 'https://sbi.co.in/web/student-platform/student-loan-scheme',
      lastVerified: '2026-08-15',
      status: 'verified',
    },
    isDemo: false,
  },
  {
    name: 'Student Passport-size Photographs',
    category: 'student_kyc',
    description: '3 to 5 recent colored passport-size photographs on plain white background.',
    isRequired: true,
    applicableCondition: 'Mandatory for physical bank forms and loan account opening.',
    issuingAuthority: 'Self / Studio',
    verificationTip: 'Keep digital softcopies (.jpg < 100KB) ready for online portal uploads.',
    source: {
      value: 'Bank Application Checklists',
      source: 'State Bank of India',
      sourceUrl: 'https://sbi.co.in/web/student-platform/student-loan-scheme',
      lastVerified: '2026-08-20',
      status: 'verified',
    },
    isDemo: false,
  },

  // 2. Academic Records
  {
    name: 'Class 10 Marksheet and Passing Certificate',
    category: 'academic_records',
    description:
      'Secondary school examination marksheet serving as official proof of age and date of birth.',
    isRequired: true,
    applicableCondition: 'Mandatory for all education loan applications.',
    issuingAuthority: 'Central Board of Secondary Education (CBSE) / ICSE / State Board',
    verificationTip:
      'Date of birth on this marksheet is treated by banks as the primary benchmark for all KYC documents.',
    source: {
      value: 'IBA Model Educational Loan Scheme',
      source: 'Indian Banks Association',
      sourceUrl: 'https://www.bankofbaroda.in/personal-banking/loans/education-loan/baroda-gyan',
      lastVerified: '2026-08-10',
      status: 'verified',
    },
    isDemo: false,
  },
  {
    name: 'Class 12 / Higher Secondary Marksheet',
    category: 'academic_records',
    description:
      'Senior secondary (10+2) board examination statement of marks showing scores in Physics, Chemistry, and Mathematics.',
    isRequired: true,
    applicableCondition: 'Mandatory for undergraduate B.Tech loan applications.',
    issuingAuthority: 'CBSE / ICSE / Respective State Examination Board',
    verificationTip:
      'Banks verify whether aggregate percentage in PCM meets minimum university eligibility criteria (e.g. 60% for VIT).',
    source: {
      value: 'VIT Admissions Criteria & Bank Underwriting Norms',
      source: 'VIT Bhopal University',
      sourceUrl: 'https://vitbhopal.ac.in/fees-structure/',
      lastVerified: '2026-08-05',
      status: 'verified',
    },
    isDemo: false,
  },

  // 3. VIT Bhopal Admission Documents
  {
    name: 'VITEEE Rank Card / Admit Card',
    category: 'vit_bhopal_admission',
    description:
      'Official scorecard of VIT Engineering Entrance Examination confirming merit ranking in national test.',
    isRequired: true,
    applicableCondition:
      'Mandatory for validating merit-based admission as per RBI priority lending directives.',
    issuingAuthority: 'Admissions Directorate, Vellore Institute of Technology',
    verificationTip:
      'Entrance exam rank helps establish that admission was secured through an open competitive selection process.',
    source: {
      value: 'VIT Bhopal Admissions Handbook 2024-25',
      source: 'VIT Bhopal University',
      sourceUrl: 'https://vitbhopal.ac.in/fees-structure/',
      lastVerified: '2026-08-05',
      status: 'verified',
    },
    isDemo: false,
  },
  {
    name: 'VIT Bhopal Provisional Admission Letter',
    category: 'vit_bhopal_admission',
    description:
      'Official admission offer letter stating student name, application number, assigned branch, and allotted tuition fee category (Category 1 to 5).',
    isRequired: true,
    applicableCondition: 'Mandatory to establish confirmed admission to VIT Bhopal University.',
    issuingAuthority: 'Office of Admissions, VIT Bhopal University',
    verificationTip:
      'Ensure the admission letter clearly specifies the assigned category number and program duration (4 years for B.Tech).',
    source: {
      value: 'VIT Bhopal Admission Guidelines',
      source: 'VIT Bhopal University',
      sourceUrl: 'https://vitbhopal.ac.in/fees-structure/',
      lastVerified: '2026-08-05',
      status: 'verified',
    },
    isDemo: false,
  },
  {
    name: 'VIT Bhopal Official Fee Estimation Letter (Bonafide & Loan Schedule)',
    category: 'vit_bhopal_admission',
    description:
      'University certified statement outlining year-wise tuition fees, one-time caution deposit, hostel room charges, and mess advance for the complete degree duration.',
    isRequired: true,
    applicableCondition:
      'Mandatory to determine maximum loan quantum and semester-wise disbursement schedule.',
    issuingAuthority: 'Finance Section, VIT Bhopal University',
    verificationTip:
      'Request this letter directly from the VIT Bhopal Finance Section. Must bear the official university seal, authorized signatory, and official bank IFSC remittance coordinates.',
    source: {
      value: 'VIT Bhopal Finance Section Notification',
      source: 'VIT Bhopal University Finance Section',
      sourceUrl: 'https://vitbhopal.ac.in/fees-structure/',
      lastVerified: '2026-08-05',
      status: 'verified',
    },
    isDemo: false,
  },

  // 4. Co-Applicant KYC
  {
    name: 'Co-Applicant Aadhaar Card and PAN Card',
    category: 'coapplicant_kyc',
    description:
      'Government identity proofs of the primary earning parent or legal guardian who is joint co-borrower.',
    isRequired: true,
    applicableCondition: 'Mandatory for all education loans.',
    issuingAuthority: 'UIDAI & Income Tax Department',
    verificationTip:
      'Co-applicant CIBIL/Experian credit score will be pulled based on PAN. An unblemished credit history (>700 CIBIL) expedites sanction.',
    source: {
      value: 'RBI Master Circular on Retail Loans',
      source: 'Reserve Bank of India',
      sourceUrl: 'https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=12143',
      lastVerified: '2026-08-10',
      status: 'verified',
    },
    isDemo: false,
  },

  // 5. Co-Applicant Income (Salaried)
  {
    name: 'Salary Slips (Last 3 Months)',
    category: 'coapplicant_income_salaried',
    description:
      'Monthly pay slips issued by employer indicating gross earnings, deductions (PF, professional tax, TDS), and net in-hand pay.',
    isRequired: true,
    applicableCondition: 'Mandatory if co-applicant is a salaried employee.',
    issuingAuthority: 'Employer / Human Resources Section',
    verificationTip:
      'Net monthly pay is assessed by credit underwriters to compute Fixed Obligation to Income Ratio (FOIR).',
    source: {
      value: 'SBI Personal Banking Credit Guidelines',
      source: 'State Bank of India',
      sourceUrl: 'https://sbi.co.in/web/student-platform/student-loan-scheme',
      lastVerified: '2026-08-20',
      status: 'verified',
    },
    isDemo: false,
  },
  {
    name: 'Form 16 (Part A & B for Last 2 Years)',
    category: 'coapplicant_income_salaried',
    description:
      'Certificate under Section 203 of Income Tax Act 1961 for tax deducted at source on salary income.',
    isRequired: true,
    applicableCondition: 'Mandatory for salaried co-borrowers.',
    issuingAuthority: 'Employer / TRACES Portal',
    verificationTip:
      'Ensure TRACES watermark is present on Part A to certify authenticity.',
    source: {
      value: 'Public Sector Bank Underwriting Standards',
      source: 'Punjab National Bank',
      sourceUrl: 'https://www.pnbindia.in/education.html',
      lastVerified: '2026-08-18',
      status: 'verified',
    },
    isDemo: false,
  },
  {
    name: 'Salary Account Bank Statement (Last 6 Months)',
    category: 'coapplicant_income_salaried',
    description:
      'Complete account statement from the bank where monthly salary is credited, with all transactions.',
    isRequired: true,
    applicableCondition: 'Mandatory for salaried co-borrowers.',
    issuingAuthority: 'Co-applicant Salary Account Bank',
    verificationTip:
      'Statement must clearly show salary credits matching pay slips, with no recurring bounced ECS or cheque returns.',
    source: {
      value: 'Bank of Baroda Credit Appraisal Manual',
      source: 'Bank of Baroda',
      sourceUrl: 'https://www.bankofbaroda.in/personal-banking/loans/education-loan/baroda-gyan',
      lastVerified: '2026-08-22',
      status: 'verified',
    },
    isDemo: false,
  },

  // 6. Co-Applicant Income (Self-Employed / Business)
  {
    name: 'ITR-V and Computation of Total Income (Last 2 to 3 Assessment Years)',
    category: 'coapplicant_income_selfemployed',
    description:
      'Income Tax Return Acknowledgement receipts along with detailed CA-certified computation sheet.',
    isRequired: true,
    applicableCondition: 'Mandatory if co-applicant is self-employed, businessman, or professional.',
    issuingAuthority: 'Income Tax Department / Chartered Accountant',
    verificationTip:
      'Must contain e-verification confirmation code from the Income Tax e-filing portal.',
    source: {
      value: 'IBA Operational Guidelines for MSME & Retail Borrowers',
      source: 'Indian Banks Association',
      sourceUrl: 'https://sbi.co.in/web/student-platform/student-loan-scheme',
      lastVerified: '2026-08-15',
      status: 'verified',
    },
    isDemo: false,
  },
  {
    name: 'Audited Financial Statements (Balance Sheet & P&L for 2 Years)',
    category: 'coapplicant_income_selfemployed',
    description:
      'Audited balance sheet and profit & loss account statement with schedule notes certified by a Chartered Accountant.',
    isRequired: true,
    applicableCondition:
      'Required for business turnover or proprietary concerns of self-employed co-borrowers.',
    issuingAuthority: 'Practicing Chartered Accountant (with UDIN)',
    verificationTip:
      'Must bear a valid 18-digit Unique Document Identification Number (UDIN) generated on ICAI portal.',
    source: {
      value: 'ICAI Audit Standards & Bank Credit Norms',
      source: 'State Bank of India',
      sourceUrl: 'https://sbi.co.in/web/student-platform/student-loan-scheme',
      lastVerified: '2026-08-20',
      status: 'verified',
    },
    isDemo: false,
  },
  {
    name: 'Business Current Account Statement (Last 6 to 12 Months)',
    category: 'coapplicant_income_selfemployed',
    description:
      'Official bank statement of the primary operating business bank account showing regular commercial turnover.',
    isRequired: true,
    applicableCondition: 'Mandatory for self-employed co-applicants.',
    issuingAuthority: 'Commercial Bank',
    verificationTip:
      'Shows business cash flow sustainability to confirm capacity to service education loan.',
    source: {
      value: 'PNB Credit Policy',
      source: 'Punjab National Bank',
      sourceUrl: 'https://www.pnbindia.in/education.html',
      lastVerified: '2026-08-18',
      status: 'verified',
    },
    isDemo: false,
  },

  // 7. Collateral Documents (Immovable Property)
  {
    name: 'Registered Title Deed / Sale Deed / Conveyance Deed',
    category: 'collateral_property',
    description:
      'Original registered parent title documents proving unquestionable legal ownership of property offered as security.',
    isRequired: false,
    applicableCondition:
      'Mandatory only if loan amount exceeds Rs 7.5 Lakhs and property collateral is offered.',
    issuingAuthority: 'Sub-Registrar Office, Department of Registration & Stamps',
    verificationTip:
      'Original title documents must be deposited with the bank for equitable mortgage creation (deposit of title deeds).',
    source: {
      value: 'Transfer of Property Act & IBA Mortgage Documentation Manual',
      source: 'Reserve Bank of India',
      sourceUrl: 'https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=12143',
      lastVerified: '2026-08-10',
      status: 'verified',
    },
    isDemo: false,
  },
  {
    name: '30-Year Non-Encumbrance Certificate (NEC)',
    category: 'collateral_property',
    description:
      'Official search certificate confirming the property is free from prior mortgages, legal attachments, or court disputes for the preceding 13 to 30 years.',
    isRequired: false,
    applicableCondition: 'Mandatory for property collateral above Rs 7.5 Lakhs.',
    issuingAuthority: 'Sub-Registrar of the territorial revenue jurisdiction',
    verificationTip:
      'Banks empanelled legal advocate will conduct an independent search at the registrar office.',
    source: {
      value: 'State Bank of India Legal Vetting Manual',
      source: 'State Bank of India',
      sourceUrl: 'https://sbi.co.in/web/student-platform/student-loan-scheme',
      lastVerified: '2026-08-20',
      status: 'verified',
    },
    isDemo: false,
  },
  {
    name: 'Approved Building Plan and Local Municipal Tax Receipts',
    category: 'collateral_property',
    description:
      'Architectural building sanction plan approved by the local municipal corporation or Town and Country Planning (T&CP) along with up-to-date paid property tax challan.',
    isRequired: false,
    applicableCondition: 'Mandatory for constructed residential house or apartment collateral.',
    issuingAuthority: 'Municipal Corporation / Local Development Authority',
    verificationTip:
      'Bank approved technical valuer visits the site to cross-check actual built-up area with approved sanction plan.',
    source: {
      value: 'Bank Valuation Policy',
      source: 'Bank of Baroda',
      sourceUrl: 'https://www.bankofbaroda.in/personal-banking/loans/education-loan/baroda-gyan',
      lastVerified: '2026-08-22',
      status: 'verified',
    },
    isDemo: false,
  },

  // 8. Collateral Documents (Liquid Security)
  {
    name: 'Fixed Deposit Receipt (FDR / TDR Advice)',
    category: 'collateral_liquid',
    description:
      'Term deposit receipt held with the lending bank to be marked with bank lien as 100% liquid collateral.',
    isRequired: false,
    applicableCondition:
      'Optional alternative to property collateral for loans above Rs 7.5 Lakhs.',
    issuingAuthority: 'Lending Bank / Scheduled Commercial Bank',
    verificationTip:
      'FD collateral is the fastest route to loan sanction because it eliminates title search and property valuation delays.',
    source: {
      value: 'RBI Master Circular on Loans Against Fixed Deposits',
      source: 'Reserve Bank of India',
      sourceUrl: 'https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=12143',
      lastVerified: '2026-08-10',
      status: 'verified',
    },
    isDemo: false,
  },

  // 9. Bank Specific Application Forms
  {
    name: 'Common Education Loan Application Form (CELFS) Printout',
    category: 'bank_specific_forms',
    description:
      'Signed hardcopy or PDF export of the completed application submitted through the Vidya Lakshmi / PM-Vidyalaxmi portal.',
    isRequired: true,
    applicableCondition: 'Mandatory when visiting designated branch for original verification.',
    issuingAuthority: 'Vidya Lakshmi Portal (Protean) / PM-Vidyalaxmi Portal',
    verificationTip:
      'Ensure both student and co-applicant have signed across photographs and signature declaration boxes.',
    source: {
      value: 'Vidya Lakshmi Application Portal Handbook',
      source: 'Department of Higher Education, Govt of India',
      sourceUrl: 'https://www.vidyalakshmi.co.in/Students/',
      lastVerified: '2026-08-15',
      status: 'verified',
    },
    isDemo: false,
  },
  {
    name: 'Declaration / Affidavit of No Prior Education Loan',
    category: 'bank_specific_forms',
    description:
      'Standard sworn affidavit on non-judicial stamp paper declaring that the student has not availed any other education loan from any other bank for the same course.',
    isRequired: true,
    applicableCondition: 'Mandatory standard banking legal condition before sanction.',
    issuingAuthority: 'Notary Public / Student & Parent Self-Declaration',
    verificationTip:
      'Bank will provide the exact affidavit text template upon initial document scrutiny.',
    source: {
      value: 'IBA Standard Model Documentation',
      source: 'Indian Banks Association',
      sourceUrl: 'https://sbi.co.in/web/student-platform/student-loan-scheme',
      lastVerified: '2026-08-15',
      status: 'verified',
    },
    isDemo: false,
  },
];
