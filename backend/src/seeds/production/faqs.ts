/**
 * Authoritative Production Frequently Asked Questions (FAQ) for Edu4Loan
 * Answers grounded in RBI guidelines, IBA Model Scheme, MoE rules, and VIT Bhopal procedures.
 */

export const productionFAQs = [
  {
    question: 'What is an education loan moratorium period, and does interest accrue during this time?',
    answer:
      'The moratorium period (also called holiday period) is the course duration plus a buffer period (typically 6 to 12 months after course completion, or 6 months after getting a job, whichever is earlier). Simple interest accrues during the moratorium. If the student or family pays the interest monthly during moratorium, the principal is not compounded. If not paid, accrued simple interest is capitalized (added to the principal) when EMI repayment begins.',
    category: 'moratorium_and_repayment',
    tags: ['moratorium', 'interest', 'capitalization', 'repayment', 'holiday period'],
    officialReference: 'IBA Model Educational Loan Scheme (Section 8: Repayment Holiday / Moratorium)',
    officialReferenceUrl: 'https://www.iba.org.in',
    isHighPriority: true,
    status: 'verified',
  },
  {
    question: 'Is collateral or third-party guarantee required for education loans up to ₹7.5 Lakhs?',
    answer:
      'Under IBA Model Education Loan Guidelines and RBI Priority Sector Lending guidelines: loans up to ₹4 Lakhs require nil tangible collateral and nil third-party guarantee. For loans between ₹4 Lakhs and ₹7.5 Lakhs, tangible collateral is not mandatory, but banks may obtain a suitable third-party guarantee or credit guarantee cover under the Credit Guarantee Fund Scheme for Education Loans (CGFSEL). Loans exceeding ₹7.5 Lakhs require tangible collateral security acceptable to the bank along with co-obligation of parents.',
    category: 'collateral_and_guarantees',
    tags: ['collateral', 'guarantee', 'cgfsel', '4 lakhs', '7.5 lakhs'],
    officialReference: 'RBI Master Circular - Priority Sector Lending - Education Loans',
    officialReferenceUrl: 'https://www.rbi.org.in',
    isHighPriority: true,
    status: 'verified',
  },
  {
    question: 'What is the distinction between PM-Vidyalaxmi and the Vidya Lakshmi Portal?',
    answer:
      'Vidya Lakshmi (vidyalakshmi.co.in) is the unified Common Education Loan Application Form (CELFS) portal launched in 2015, maintained by Protean, allowing students to apply to 40+ banks. PM-Vidyalaxmi is a new Central Sector Scheme approved by the Union Cabinet in 2024 providing a 3% interest subvention during moratorium for students with family income up to ₹8 Lakhs enrolled in top NIRF higher educational institutions, along with a 75% credit guarantee for loans up to ₹7.5 Lakhs.',
    category: 'pm_vidyalaxmi_scheme',
    tags: ['pm-vidyalaxmi', 'vidya lakshmi', 'subvention', 'celfs', 'nirf'],
    officialReference: 'Cabinet Decision / Ministry of Education PIB Notification',
    officialReferenceUrl: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2071239',
    isHighPriority: true,
    status: 'verified',
  },
  {
    question: 'How do VIT Bhopal students obtain the official loan estimate and bonafide certificate?',
    answer:
      'After confirming admission via VITEEE seat allotment, students can request the official Multi-Year Bonafide & Fee Estimation Certificate from the VIT Bhopal University Admissions & Finance Office. The certificate specifies the annual tuition category fees, caution deposit, hostel room rent, and mess charges, along with the university official bank IFSC collection account coordinates for direct disbursement.',
    category: 'vit_bhopal_processes',
    tags: ['vit bhopal', 'fee structure', 'bonafide', 'disbursement', 'admissions'],
    officialReference: 'VIT Bhopal University Directorate of Admissions Guidelines',
    officialReferenceUrl: 'https://vitbhopal.ac.in',
    isHighPriority: true,
    status: 'verified',
  },
  {
    question: 'Who is eligible for the Central Sector Interest Subsidy (CSIS) scheme?',
    answer:
      'CSIS provides 100% full interest subsidy during the moratorium period (course duration + 1 year) for students from Economically Weaker Sections (EWS) whose total gross annual family income from all sources does not exceed ₹4,50,000 (₹4.5 Lakhs). The loan must be sanctioned by an IBA member scheduled commercial bank for an approved professional or technical course in India.',
    category: 'interest_rates_and_subsidies',
    tags: ['csis', 'interest subsidy', 'ews', '4.5 lakhs', 'moratorium'],
    officialReference: 'Ministry of Education CSIS Guidelines (Administered via Canara Bank Nodal Cell)',
    officialReferenceUrl: 'https://www.education.gov.in/scholarships-education-loan-4',
    isHighPriority: true,
    status: 'verified',
  },
  {
    question: 'How does the co-applicant credit score (CIBIL) affect education loan evaluation?',
    answer:
      'Because students generally have no established credit history, banks assess the primary earning co-applicant (parent or legal guardian). A clean credit repayment history with a CIBIL score of 700 or higher significantly expedites approval. Existing defaults or overdue EMIs on the co-applicant credit report may lead to sanction delays or require an alternate co-borrower.',
    category: 'cibil_and_credit_score',
    tags: ['cibil', 'credit score', 'co-applicant', 'eligibility', 'bureau'],
    officialReference: 'RBI Fair Lending Practices & Credit Bureau Guidelines',
    officialReferenceUrl: 'https://www.rbi.org.in',
    isHighPriority: false,
    status: 'verified',
  },
  {
    question: 'How many bank applications can be submitted through the Vidya Lakshmi Portal simultaneously?',
    answer:
      'Through the Vidya Lakshmi CELFS portal, a student can apply to a maximum of 3 banks and 3 loan schemes simultaneously using one common application form. Tracking updates and lender communications are visible directly in the student portal dashboard.',
    category: 'vidya_lakshmi_portal',
    tags: ['vidya lakshmi', 'celfs', '3 banks', 'portal application', 'tracking'],
    officialReference: 'Vidya Lakshmi Portal Student User Guide',
    officialReferenceUrl: 'https://www.vidyalakshmi.co.in/Students/',
    isHighPriority: false,
    status: 'verified',
  },
];
