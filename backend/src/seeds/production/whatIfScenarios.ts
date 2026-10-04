/**
 * Authoritative Production What-If Scenarios for Edu4Loan
 * Answers real-world situations students and parents encounter before approaching banks.
 */

export const productionWhatIfScenarios = [
  {
    scenarioCode: "NO_SALARY_SLIP",
    title: "Parent or Co-Applicant Does Not Have a Salary Slip",
    category: "income_and_salary",
    summary: "Options and officially accepted documentation when the co-borrower does not receive a monthly corporate pay slip.",
    problemExplanation: "Many public and private banks list monthly salary slips as a standard checklist item. When parents are self-employed, farmers, traders, or freelance professionals, students fear they are ineligible. In reality, Indian banking norms allow multiple alternative proofs of income.",
    practicalGuidance: [
      "If self-employed or running a business, provide 2 to 3 years of Income Tax Returns (ITR) accompanied by computation of total income and balance sheet.",
      "For agriculturalists, provide land revenue records (Khasra/Khatauni), J-Forms, or Tahsildar/Revenue Officer issued income certificates.",
      "Provide bank account statements for the last 12 months showing regular operational cash inflows.",
      "Submit Form 16A or GST returns (GSTR-3B/GSTR-1) if registered under GST.",
      "Obtain a Chartered Accountant (CA) certified Statement of Affairs / Net Worth Certificate if required by the bank."
    ],
    relevantDocuments: [
      "Income Tax Returns (ITR-V / Acknowledgement) for last 2-3 Assessment Years",
      "Bank statement of parent for last 12 months",
      "Business registration license / Udyam Certificate / Shop & Establishment Act license",
      "Tahsildar Income Certificate (for rural/agricultural applicants)",
      "Form 16A / TDS Certificates where applicable"
    ],
    bankSpecificConditions: [
      {
        bankName: "State Bank of India",
        condition: "Accepts last 2 years ITR with computation of income for non-salaried co-applicants. For agriculturists, revenue authorities land ownership and income proof accepted."
      },
      {
        bankName: "Punjab National Bank",
        condition: "Accepts audited balance sheet and P&L statement certified by CA along with 3 years ITR for business owners."
      },
      {
        bankName: "Bank of Baroda",
        condition: "Accepts ITR or agricultural income assessment certificate verified by local branch manager."
      }
    ],
    officialSource: {
      value: "IBA Model Educational Loan Scheme & RBI PSL Master Direction",
      source: "Indian Banks Association (IBA)",
      sourceUrl: "https://www.iba.org.in",
      lastVerified: "2026-08-20",
      status: "verified"
    },
    officialActionLink: "/practical-help?tab=salary-slip",
    actionText: "Explore Salary Slip Alternatives Tool",
    status: "verified"
  },
  {
    scenarioCode: "NO_COLLATERAL",
    title: "No Tangible Collateral (Property or Land) to Pledge",
    category: "collateral_and_security",
    summary: "Statutory rights under RBI and CGFSEL guidelines for collateral-free education loans up to INR 7.5 Lakhs.",
    problemExplanation: "Students often believe that securing an education loan always requires mortgaging residential property or agricultural land. Branch managers sometimes unlawfully demand collateral for loans under INR 7.5 Lakhs.",
    practicalGuidance: [
      "Under Reserve Bank of India (RBI) Priority Sector Lending guidelines and the Central Government CGFSEL credit guarantee scheme, loans up to INR 7.5 Lakhs require ZERO tangible collateral and ZERO third-party guarantee.",
      "The co-obligation of parents is mandatory as joint borrowers, but no physical property deed can be insisted upon for loans <= INR 7.5L.",
      "For loans between INR 7.5L and INR 15L at premier institutes (or under PM-Vidyalaxmi 2024), credit guarantee coverage extends up to 75% without property mortgage.",
      "If a branch insists on collateral for <= INR 7.5 Lakhs, respectfully cite the RBI Master Direction on Education Loans and request the Lead District Manager (LDM) or Nodal Desk details."
    ],
    relevantDocuments: [
      "Admission confirmation letter with fee structure",
      "Student academic mark sheets",
      "Co-borrower KYC and income proof (ITR / Form 16 / Bank statement)",
      "CGFSEL guarantee declaration format provided by bank"
    ],
    bankSpecificConditions: [
      {
        bankName: "State Bank of India",
        condition: "Strictly follows RBI guidelines: Nil collateral up to INR 7.5 Lakhs under Student Loan Scheme; CGFSEL cover applicable."
      },
      {
        bankName: "Canara Bank",
        condition: "Canara Vidya Turan offers collateral-free loans up to INR 20 Lakhs for approved Category-A/B premier institutions."
      },
      {
        bankName: "Punjab National Bank",
        condition: "Nil collateral up to INR 7.5 Lakhs. Third-party guarantee acceptable between INR 4L and INR 7.5L if non-CGFSEL."
      }
    ],
    officialSource: {
      value: "Credit Guarantee Fund Scheme for Education Loans (CGFSEL) / NCGTC",
      source: "National Credit Guarantee Trustee Company (NCGTC)",
      sourceUrl: "https://www.ncgtc.in",
      lastVerified: "2026-08-25",
      status: "verified"
    },
    officialActionLink: "/calculator",
    actionText: "Check Collateral Threshold Calculator",
    status: "verified"
  },
  {
    scenarioCode: "SELF_EMPLOYED_PARENT",
    title: "Parent is Self-Employed, Trader, or Consultant",
    category: "income_and_salary",
    summary: "Dossier preparation strategy for self-employed professionals, traders, and small business owners.",
    problemExplanation: "Self-employed co-borrowers have variable monthly incomes, which bank credit appraisal engines scrutinize closely for repayment continuity and debt-to-income (DTI) compliance.",
    practicalGuidance: [
      "Prepare 3 consecutive assessment years of Income Tax Returns with detailed computation of income and computation sheets.",
      "Ensure business registration certificates (Udyam MSME, GST Registration, Trade License) are active and in the co-borrowers name.",
      "Submit 12 months primary bank statement showing consistent debit and credit cycles without frequent cheque returns/ECS bounces.",
      "Highlight secondary liquid assets (existing fixed deposits, insurance surrender values) to demonstrate financial cushion."
    ],
    relevantDocuments: [
      "ITR-V for last 3 Assessment Years with computation of income",
      "Balance sheet and Profit & Loss statement (audited if turnover exceeds statutory limits)",
      "Udyam Aadhar registration certificate or Shop Act license",
      "Current / Savings bank account statements for last 12 months",
      "GST returns (GSTR-3B) for the trailing 4 quarters where applicable"
    ],
    bankSpecificConditions: [
      {
        bankName: "State Bank of India",
        condition: "Requires 2 years ITR and 6-12 months bank statement. Assesses cash flow stability."
      },
      {
        bankName: "Bank of Baroda",
        condition: "Requires business proof (registration certificate/GST) and past 2 years ITR with tax computation sheet."
      }
    ],
    officialSource: {
      value: "State Bank of India Credit Policy for Non-Salaried Borrowers",
      source: "SBI Retail Credit Division",
      sourceUrl: "https://sbi.co.in/web/student-platform/student-loan-scheme",
      lastVerified: "2026-08-20",
      status: "verified"
    },
    officialActionLink: "/documents",
    actionText: "Generate Personalized Self-Employed Checklist",
    status: "verified"
  },
  {
    scenarioCode: "NO_ITR_FILED",
    title: "Co-Applicant Has Not Filed Income Tax Returns (ITR)",
    category: "income_and_salary",
    summary: "Guidance for families below the taxable income threshold who do not possess ITR acknowledgements.",
    problemExplanation: "Families earning below the basic income tax exemption limit (e.g. farmers, small rural artisans) do not legally require filing ITR. However, loan officers frequently ask for ITR as default proof of repayment capacity.",
    practicalGuidance: [
      "Obtain an official Income Certificate issued by the designated state authority (Tahsildar, Sub-Divisional Magistrate SDM, or Revenue Officer).",
      "For agricultural families, obtain certified land records (Khasra/Khatauni) indicating cultivated area and crop valuation.",
      "Consider adding an additional earning co-borrower (elder sibling, employed aunt/uncle) with filed ITRs to strengthen credit appraisal.",
      "Apply for the Central Sector Interest Subsidy (CSIS) or PM-Vidyalaxmi 2024 if gross annual income is below INR 4.5L or INR 8L respectively.",
      "Show steady banking habits by providing savings passbook entries over the past 12 to 24 months."
    ],
    relevantDocuments: [
      "Revenue Authority Income Certificate (Tahsildar signed with digital verification)",
      "Land revenue records / Patta / Khasra-Khatauni",
      "Affidavit of income sworn before a Notary Public / Executive Magistrate",
      "Savings bank passbook or bank statement for 12 months"
    ],
    bankSpecificConditions: [
      {
        bankName: "State Bank of India",
        condition: "Tahsildar income certificate accepted for CSIS interest subsidy and small agriculture-dependent loans."
      },
      {
        bankName: "Punjab National Bank",
        condition: "Accepts income certificate issued by competent state authority in lieu of ITR for rural/agricultural households."
      }
    ],
    officialSource: {
      value: "Ministry of Education CSIS Operating Guidelines",
      source: "Department of Higher Education, Government of India",
      sourceUrl: "https://www.education.gov.in/schemes",
      lastVerified: "2026-08-20",
      status: "verified"
    },
    officialActionLink: "/practical-help?tab=salary-slip",
    actionText: "View Alternative Document Pathways",
    status: "verified"
  },
  {
    scenarioCode: "NO_CREDIT_HISTORY",
    title: "Student Has No Prior CIBIL Credit History",
    category: "credit_history",
    summary: "Why students have no CIBIL score (Score -1 / NH) and how bank credit underwriting evaluates first-time borrowers.",
    problemExplanation: "First-time undergraduate students entering college usually have never taken a loan or credit card, resulting in a CIBIL score of -1 (No History / NH). Students worry this causes loan rejection.",
    practicalGuidance: [
      "A credit score of -1 (NH) for a full-time student is completely normal and expected by Indian banks.",
      "Education loan credit appraisal relies on the parents / co-borrowers CIBIL score, not the students nonexistent credit history.",
      "Ensure the parent/co-applicant has a clean credit track record: score above 685-700, zero write-offs, no active default flags.",
      "The student builds their initial credit score once loan repayment begins post-graduation. Timely EMI servicing creates an excellent CIBIL foundation."
    ],
    relevantDocuments: [
      "Student identity and residence proofs",
      "Parent / Co-borrower CIBIL report (bank retrieves this automatically with consent)",
      "Proof of academic merit (VITEEE rank card / 12th Board marksheet)"
    ],
    bankSpecificConditions: [
      {
        bankName: "State Bank of India",
        condition: "No student credit history required. Co-borrower CIR (Credit Information Report) minimum cut-off evaluated as per retail credit norms."
      },
      {
        bankName: "Bank of Baroda",
        condition: "Student evaluated on admission status and academic record; co-applicant credit score assessed."
      }
    ],
    officialSource: {
      value: "TransUnion CIBIL Education Loan Underwriting Guidelines",
      source: "CIBIL / Reserve Bank of India",
      sourceUrl: "https://www.cibil.com",
      lastVerified: "2026-08-15",
      status: "verified"
    },
    officialActionLink: "/eligibility",
    actionText: "Check Loan Eligibility Explainer",
    status: "verified"
  },
  {
    scenarioCode: "FIFTEEN_LAKH_REQUIREMENT",
    title: "Requiring an Education Loan of INR 15 Lakhs or More",
    category: "collateral_and_security",
    summary: "Structuring higher-quantum loans (INR 15L - INR 25L) covering four years of VIT Bhopal B.Tech tuition and hostel.",
    problemExplanation: "A 4-year B.Tech program at VIT Bhopal across Category 2-5, along with AC/Non-AC hostel and mess, typically ranges between INR 12 Lakhs and INR 22 Lakhs. Above INR 7.5 Lakhs, standard RBI rules allow banks to request tangible security.",
    practicalGuidance: [
      "Check if your scheme qualifies under premier institute categories (like SBI Scholar Scheme or Canara Vidya Turan) which offer higher collateral-free ceilings up to INR 20 Lakhs.",
      "Under PM-Vidyalaxmi 2024, eligible students admitted to Top NIRF institutions can secure up to INR 10 Lakhs with 75% credit guarantee and 3% interest subvention for family income <= INR 8L.",
      "If applying under standard schemes, be prepared to offer acceptable collateral: residential house/flat, commercial property, bank Fixed Deposit, or LIC surrender value matching the loan quantum.",
      "Ensure the property offered has clear marketable title, registered sale deed, 30-year non-encumbrance certificate (NEC), and approved municipal plan."
    ],
    relevantDocuments: [
      "University comprehensive fee structure covering 4 years (Tuition + Hostel + Mess + Caution Deposit)",
      "Property title deed / Registered conveyance deed",
      "Prior title deeds for past 30 years (Chain of documents)",
      "Non-Encumbrance Certificate (NEC) for 13 to 30 years from Sub-Registrar office",
      "Approved building plan and municipal tax paid receipts"
    ],
    bankSpecificConditions: [
      {
        bankName: "State Bank of India",
        condition: "SBI Student Loan requires 100% tangible collateral security for inland loans exceeding INR 7.5 Lakhs. Third-party legal and valuation charges borne by applicant."
      },
      {
        bankName: "Canara Bank",
        condition: "Canara Vidya Turan provides collateral-free loans up to INR 20L for Category-A/B list institutions; standard schemes require tangible collateral above INR 7.5L."
      }
    ],
    officialSource: {
      value: "IBA Model Educational Loan Scheme & Bank Collateral Schedules",
      source: "Indian Banks Association (IBA)",
      sourceUrl: "https://www.iba.org.in",
      lastVerified: "2026-08-20",
      status: "verified"
    },
    officialActionLink: "/calculator",
    actionText: "Calculate Repayment on INR 15 Lakhs",
    status: "verified"
  },
  {
    scenarioCode: "FIRST_YEAR_STUDENT",
    title: "First-Year Student Applying Before Joining the Campus",
    category: "course_and_institution",
    summary: "Securing loan sanction before traveling to Sehore for physical verification and onboarding.",
    problemExplanation: "Freshers often struggle with timing: university fee deadlines require payment before the student sets foot on campus, yet local hometown bank branches may insist the loan belongs to the campus branch.",
    practicalGuidance: [
      "You do NOT need to wait until physical reporting on campus. Use your Provisional Admission Letter and Allotment Letter to initiate processing at your hometown branch.",
      "Obtain the official Cost of Study Estimate Letter and Fee Structure Notice from the VIT Bhopal Admissions portal.",
      "Submit an application on the Vidya Lakshmi Portal (CELFS) selecting the branch nearest to your parents residence.",
      "Request the bank to issue an In-Principle Sanction Letter to submit to VIT Bhopal during fee payment extensions if disbursement takes longer."
    ],
    relevantDocuments: [
      "VIT Bhopal Provisional Admission Letter / VITEEE Allotment Order",
      "Official VIT Bhopal Tuition & Hostel Fee Structure Letter",
      "Class 10th and 12th Mark sheets and Passing Certificates",
      "Entrance exam (VITEEE) Admit Card & Score Card",
      "Co-borrower KYC and income documents"
    ],
    bankSpecificConditions: [
      {
        bankName: "State Bank of India",
        condition: "Hometown branches can sanction education loans based on provisional allotment letters; disbursement made directly to university escrow account upon verification."
      },
      {
        bankName: "Punjab National Bank",
        condition: "Accepts provisional admission letters for sanctioning; final disbursement requires bonafide confirmation."
      }
    ],
    officialSource: {
      value: "VIT Bhopal Admissions Directorate Circular on Education Loans",
      source: "VIT Bhopal University Finance Section",
      sourceUrl: "https://vitbhopal.ac.in/fees-structure/",
      lastVerified: "2026-08-25",
      status: "verified"
    },
    officialActionLink: "/vit-bhopal",
    actionText: "View VIT Bhopal Campus Guide",
    status: "verified"
  },
  {
    scenarioCode: "HOSTEL_EXPENSES_INCLUSION",
    title: "Including Hostel, Mess, and Laptop in the Loan Quantum",
    category: "expenses_and_fees",
    summary: "How to bundle living expenses, hostel room rent, mess charges, and study equipment into the loan package.",
    problemExplanation: "Students often believe education loans only pay tuition fees directly to the university accounts. At residential universities like VIT Bhopal, hostel and mess charges form a significant part of the annual budget.",
    practicalGuidance: [
      "Under IBA and RBI education loan guidelines, 100% of reasonable hostel and boarding/mess charges are recognized as eligible education loan expenses.",
      "The purchase of a computer / laptop essential for engineering studies is eligible up to reasonable market limits (typically up to INR 50,000 - INR 75,000 against proforma invoice).",
      "Ensure the university issues an official composite fee estimate that includes both Tuition and Hostel/Mess tiers.",
      "Examination, library, and laboratory fees, caution deposit (refundable), and book allowances can also be bundled."
    ],
    relevantDocuments: [
      "VIT Bhopal Hostel Room Allotment letter (AC / Non-AC, bedded tier)",
      "Official mess fee schedule published by VIT Bhopal Student Welfare",
      "Proforma invoice / quotation for laptop from authorized electronic vendor"
    ],
    bankSpecificConditions: [
      {
        bankName: "State Bank of India",
        condition: "Hostel fees paid directly to university. Laptop expenses reimbursed or paid against vendor tax invoice up to 20% of total tuition fees or actuals."
      },
      {
        bankName: "Bank of Baroda",
        condition: "Covers boarding and lodging charges against institution receipt; computer purchase allowed within sanctioned margin."
      }
    ],
    officialSource: {
      value: "IBA Model Educational Loan Scheme - Clause 4.2 (Eligible Expenses)",
      source: "Indian Banks Association (IBA)",
      sourceUrl: "https://www.iba.org.in",
      lastVerified: "2026-08-20",
      status: "verified"
    },
    officialActionLink: "/vit-bhopal",
    actionText: "Inspect VIT Bhopal Fee Tiers",
    status: "verified"
  },
  {
    scenarioCode: "ADDITIONAL_DOCUMENTS_REQUESTED",
    title: "Bank Officer Requests Additional Unexpected Documents",
    category: "application_and_portal",
    summary: "How to handle supplementary document demands during bank credit committee reviews.",
    problemExplanation: "Even after submitting standard checklists, loan officers or centralized processing cells (RACPC) may raise queries requesting additional declarations, legal opinions, or supplementary affidavits.",
    practicalGuidance: [
      "Ask the bank officer to provide the query in writing or via registered email so you have exact specifications.",
      "Common supplementary requests include: Gap Certificate (affidavit explaining 1-year study break), Relationship Affidavit, or 30-year property title search.",
      "For university-specific forms (bonafide letter, expected completion date), submit a formal ticket on the VIT Bhopal Student Portal (V-TOP) to get expedited signatures.",
      "Keep digital scanned PDFs of all documents organized in folders on your phone/laptop to respond within 24-48 hours."
    ],
    relevantDocuments: [
      "Gap certificate affidavit on non-judicial stamp paper (if applicable)",
      "University bonafide certificate with enrollment number",
      "Student undertaking to serve simple interest during moratorium (if opted)",
      "Address verification / electricity bill of co-borrower residence"
    ],
    bankSpecificConditions: [
      {
        bankName: "State Bank of India",
        condition: "RACPC underwriting hub may request registered agreement to mortgage and legal search report from panel advocate."
      },
      {
        bankName: "Punjab National Bank",
        condition: "Credit committee may request CIBIL clarification letter if co-borrower has past resolved disputes."
      }
    ],
    officialSource: {
      value: "RBI Master Direction - Lending to Priority Sector (Education)",
      source: "Reserve Bank of India",
      sourceUrl: "https://www.rbi.org.in",
      lastVerified: "2026-08-15",
      status: "verified"
    },
    officialActionLink: "/documents",
    actionText: "Review Comprehensive Document Checklist",
    status: "verified"
  },
  {
    scenarioCode: "VIDYA_LAKSHMI_APPLICATION",
    title: "Applying Through Vidya Lakshmi & PM-Vidyalaxmi Portals",
    category: "application_and_portal",
    summary: "Avoiding critical application routing mistakes on central government education loan portals.",
    problemExplanation: "Students apply on Vidya Lakshmi (CELFS) but select the wrong branch IFSC code or do not visit the physical branch with the printed application form, leading to application stagnation.",
    practicalGuidance: [
      "Register on Vidya Lakshmi Portal (vidyalakshmi.co.in) and complete the Common Education Loan Application Form (CELFS).",
      "You can apply to a maximum of 3 banks and 3 schemes simultaneously through a single CELFS form.",
      "Check whether your course and family income qualify under PM-Vidyalaxmi (pmvidyalaxmi.education.gov.in) for direct digital e-voucher and 3% interest subvention.",
      "After online submission, download and print the application summary PDF. Submit physical copies along with self-attested document proofs to the designated bank branch within 7 days."
    ],
    relevantDocuments: [
      "Printed Vidya Lakshmi CELFS application confirmation with application reference number",
      "Original Aadhaar cards of student and co-borrower for in-person verification",
      "College admission letter and detailed fee breakup schedule"
    ],
    bankSpecificConditions: [
      {
        bankName: "All Scheduled Commercial Banks",
        condition: "Portal application creates an online lead; formal processing and credit sanction require physical document verification at the mapped branch."
      }
    ],
    officialSource: {
      value: "Vidya Lakshmi Portal Guidelines / NSDL Database Management",
      source: "Protean eGov Technologies Limited (formerly NSDL)",
      sourceUrl: "https://www.vidyalakshmi.co.in",
      lastVerified: "2026-08-20",
      status: "verified"
    },
    officialActionLink: "/schemes",
    actionText: "View Government Portals Guide",
    status: "verified"
  }
];
