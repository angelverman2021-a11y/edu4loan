import { WhatIfScenario } from "@/types";

export const fallbackWhatIfScenarios: WhatIfScenario[] = [
  {
    "scenarioCode": "NO_FORM_16",
    "title": "Parent or Co-Applicant Does Not Have Form 16",
    "category": "income_and_salary",
    "summary": "Accepted documentation when the co-borrower does not have Form 16 due to non-TDS or non-corporate employment.",
    "problemExplanation": "Form 16 is issued exclusively to salaried employees whose employers deduct tax at source (TDS). When parents work in small enterprises, non-profit institutions, or earn below the taxable deduction limit, students assume they are disqualified.",
    "practicalGuidance": [
      "Submit Income Tax Return Acknowledgements (ITR-V) for the last 2 to 3 financial years along with Computation of Total Income.",
      "Provide 6 to 12 months of certified savings or salary bank account statements showing regular monthly deposits.",
      "Obtain an official Employer Salary Certificate on company letterhead indicating gross earnings, deductions, net salary, and employer seal.",
      "Download Form 26AS or Annual Information Statement (AIS) from the Income Tax e-filing portal confirming recorded tax credits."
    ],
    "relevantDocuments": [
      "ITR-V Acknowledgement for last 2-3 Assessment Years",
      "Computation of Income sheet",
      "6-12 months bank statements showing salary credits",
      "Employer Salary Certificate on official letterhead with seal",
      "Form 26AS / AIS from Income Tax portal"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Accepts 2 years ITR with computation of income or employer salary certificate with 12 months salary account statement."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Accepts employer certificate and 6 months bank statement when Form 16 is not generated."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Accepts ITR-V or Tahsildar income certificate for non-corporate employees."
      }
    ],
    "officialSource": {
      "value": "Income Tax Act Section 192 & IBA Model Educational Loan Scheme",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/practical-help?tab=salary-slip",
    "actionText": "Explore Salary Slip Alternatives",
    "status": "verified",
    "id": "no_form_16"
  },
  {
    "scenarioCode": "NO_SALARY_SLIP",
    "title": "Parent or Co-Applicant Does Not Have a Salary Slip",
    "category": "income_and_salary",
    "summary": "Options and officially accepted documentation when the co-borrower does not receive a monthly corporate pay slip.",
    "problemExplanation": "Many public and private banks list monthly salary slips as a standard checklist item. When parents are self-employed, farmers, traders, or freelance professionals, students fear they are ineligible. In reality, Indian banking norms allow multiple alternative proofs of income.",
    "practicalGuidance": [
      "If self-employed or running a business, provide 2 to 3 years of Income Tax Returns (ITR) accompanied by computation of total income and balance sheet.",
      "For agriculturalists, provide land revenue records (Khasra/Khatauni, 7/12 extract), J-Forms, or Tahsildar/Revenue Officer issued income certificates.",
      "Provide bank account statements for the last 12 months showing regular operational cash inflows.",
      "Submit Form 16A or GST returns (GSTR-3B/GSTR-1) if registered under GST.",
      "Obtain a Chartered Accountant (CA) certified Statement of Affairs / Net Worth Certificate if required by the bank."
    ],
    "relevantDocuments": [
      "Income Tax Returns (ITR-V / Acknowledgement) for last 2-3 Assessment Years",
      "Bank statement of parent for last 12 months",
      "Business registration license / Udyam Certificate / Shop & Establishment Act license",
      "Tahsildar Income Certificate (for rural/agricultural applicants)",
      "Form 16A / TDS Certificates where applicable"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Accepts last 2 years ITR with computation of income for non-salaried co-applicants. For agriculturists, revenue authorities land ownership and income proof accepted."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Accepts audited balance sheet and P&L statement certified by CA along with 3 years ITR for business owners."
      },
      {
        "bankName": "Bank of Baroda",
        "condition": "Accepts ITR or agricultural income assessment certificate verified by local branch manager."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme & RBI PSL Master Direction",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/practical-help?tab=salary-slip",
    "actionText": "Explore Salary Slip Alternatives Tool",
    "status": "verified",
    "id": "no_salary_slip"
  },
  {
    "scenarioCode": "SELF_EMPLOYED_PARENT",
    "title": "Parent is Self-Employed, Trader, or Consultant",
    "category": "income_and_salary",
    "summary": "Dossier preparation strategy for self-employed professionals, traders, and small business owners.",
    "problemExplanation": "Self-employed co-borrowers have variable monthly incomes, which bank credit appraisal engines scrutinize closely for repayment continuity and debt-to-income (DTI) compliance.",
    "practicalGuidance": [
      "Collate Income Tax Returns (ITR-V) for the last 3 financial years along with Computation of Total Income.",
      "Attach CA-certified Balance Sheet and Profit & Loss accounts verifying business turnover and profit margins.",
      "Submit official Proof of Business Existence: Udyam MSME Registration Certificate, GST Registration, Trade License, or Shop & Establishment Act license.",
      "Include 12 consecutive months of bank statements for both personal savings account and primary business current account."
    ],
    "relevantDocuments": [
      "ITR-V Acknowledgement for last 3 financial years",
      "CA-certified Balance Sheets and P&L statements",
      "Udyam MSME Registration or GST Certificate",
      "12-month business current account bank statement",
      "12-month personal savings account bank statement"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Mandates 2 years ITR for non-salaried individuals; business premises proof required."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Requires 2 years ITR, business license copy, and last 12 months current account operations."
      },
      {
        "bankName": "Union Bank of India",
        "condition": "Accepts CA-attested financial statements and Udyam certification for MSME traders."
      }
    ],
    "officialSource": {
      "value": "Credit Policy for Retail Lending / Education Loans",
      "source": "Reserve Bank of India (RBI)",
      "sourceUrl": "https://www.rbi.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/practical-help?tab=min-documents",
    "actionText": "Check Self-Employed Documents",
    "status": "verified",
    "id": "self_employed_parent"
  },
  {
    "scenarioCode": "NO_ITR_FILED",
    "title": "No Income Tax Return (ITR) Filed by Co-Applicant",
    "category": "income_and_salary",
    "summary": "Statutory pathways when family annual income is below taxable threshold and no ITR has ever been submitted.",
    "problemExplanation": "Under Section 139 of the Income Tax Act, filing an ITR is not mandatory if annual gross income is below the basic exemption threshold. Banks occasionally demand ITR by default, which can disadvantage low-income applicants.",
    "practicalGuidance": [
      "Obtain an official Income Certificate issued by the competent State Revenue Authority (Tahsildar, Revenue Divisional Officer, or Sub-Divisional Magistrate).",
      "Submit a notarized Income Declaration Affidavit on non-judicial stamp paper stating annual household income from all sources.",
      "Provide bank passbook statements for the last 12 months showing cash flows and transaction history.",
      "For agricultural families, submit revenue land ownership records (Khasra/Khatauni/Pattadar passbook) and local agricultural assessment proofs."
    ],
    "relevantDocuments": [
      "Revenue Authority Income Certificate (Tahsildar/SDM/MRO)",
      "Notarized Family Income Affidavit on stamp paper",
      "12-month bank passbook or statement",
      "Agricultural land ownership passbook (if applicable)",
      "Ration Card or BPL/EWS Certificate"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Accepts Tahsildar-certified income certificate for rural/agricultural applicants in lieu of ITR."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Requires income certificate from Revenue Authority not below the rank of Tahsildar."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Income certificate valid for Central Sector Interest Subsidy (CSIS) eligibility is accepted as primary income proof."
      }
    ],
    "officialSource": {
      "value": "Central Sector Interest Subsidy (CSIS) Guidelines / MoE",
      "source": "Ministry of Education, Government of India",
      "sourceUrl": "https://www.education.gov.in",
      "lastVerified": "2026-08-25",
      "status": "verified"
    },
    "officialActionLink": "/schemes",
    "actionText": "Check CSIS Subsidy Guidelines",
    "status": "verified",
    "id": "no_itr_filed"
  },
  {
    "scenarioCode": "NO_COLLATERAL",
    "title": "No Tangible Collateral (Property or Land) to Pledge",
    "category": "collateral_and_security",
    "summary": "Statutory rights under RBI and CGFSEL guidelines for collateral-free education loans up to INR 7.5 Lakhs.",
    "problemExplanation": "Students often believe that securing an education loan always requires mortgaging residential property or agricultural land. Branch managers sometimes unlawfully demand collateral for loans under INR 7.5 Lakhs.",
    "practicalGuidance": [
      "Under Reserve Bank of India (RBI) Priority Sector Lending guidelines and CGFSEL norms, loans up to INR 7.5 Lakhs require ZERO tangible collateral and ZERO third-party guarantee.",
      "Parent co-obligation is mandatory as joint borrowers, but no physical property deed can be insisted upon for loans <= INR 7.5L.",
      "For loans between INR 7.5L and INR 15L at premier institutes (or under PM-Vidyalaxmi 2024), credit guarantee coverage extends up to 75% without property mortgage.",
      "If a branch insists on collateral for <= INR 7.5 Lakhs, respectfully cite the RBI Master Direction on Education Loans and request the Lead District Manager (LDM) or Nodal Desk details."
    ],
    "relevantDocuments": [
      "Admission confirmation letter with fee structure",
      "Student academic mark sheets",
      "Co-borrower KYC and income proof (ITR / Form 16 / Bank statement)",
      "CGFSEL guarantee declaration format provided by bank"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Strictly follows RBI guidelines: Nil collateral up to INR 7.5 Lakhs under Student Loan Scheme; CGFSEL cover applicable."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Canara Vidya Turan offers collateral-free loans up to INR 20 Lakhs for approved Category-A/B premier institutions."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Nil collateral up to INR 7.5 Lakhs. Third-party guarantee acceptable between INR 4L and INR 7.5L if non-CGFSEL."
      }
    ],
    "officialSource": {
      "value": "Credit Guarantee Fund Scheme for Education Loans (CGFSEL) / NCGTC",
      "source": "National Credit Guarantee Trustee Company (NCGTC)",
      "sourceUrl": "https://www.ncgtc.in",
      "lastVerified": "2026-08-25",
      "status": "verified"
    },
    "officialActionLink": "/calculator",
    "actionText": "Check Collateral Threshold Calculator",
    "status": "verified",
    "id": "no_collateral"
  },
  {
    "scenarioCode": "PROPERTY_DOCUMENTS_INCOMPLETE",
    "title": "Property Exists But Documentation Is Incomplete",
    "category": "collateral_and_security",
    "summary": "Overcoming missing title deeds, chain documents, or mutation records during bank legal search.",
    "problemExplanation": "When applying for loans above INR 7.5 Lakhs, banks mandate a 13 to 30-year title search by an empanelled advocate. Missing prior deeds, unmutated inheritances, or absent non-encumbrance certificates result in adverse legal search reports.",
    "practicalGuidance": [
      "Request the specific observation note from the bank empanelled advocate to pinpoint exact missing instruments.",
      "Obtain certified copies of past registered deeds from the local Sub-Registrar Office (SRO) if intermediate title deeds are misplaced.",
      "Offer alternative liquid financial collateral instead of real estate: Bank Fixed Deposits, National Savings Certificates (NSC), or surrender value of LIC policies.",
      "Restructure loan request to INR 7.5 Lakhs to qualify under the collateral-free CGFSEL framework, financing the remainder via margin money or scholarships."
    ],
    "relevantDocuments": [
      "Latest Registered Sale / Gift / Partition Deed",
      "Mutation register extract and latest property tax receipts",
      "Non-Encumbrance Certificate (NEC) for past 13 to 30 years",
      "Approved building plan or layout regularization order",
      "Fixed Deposit receipts or NSC certificates (for liquid collateral fallback)"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Empanelled advocate Title Investigation Report (TIR) and approved valuer report mandatory for all immovable property."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Accepts 100% liquid security (Bank FD/NSC/KVP) with immediate waiver of advocate title search charges."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Property must have clear, marketable, and unencumbered title; agricultural land restrictions apply per state laws."
      }
    ],
    "officialSource": {
      "value": "Master Circular on Housing & Retail Security Creation",
      "source": "Reserve Bank of India (RBI)",
      "sourceUrl": "https://www.rbi.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/calculator",
    "actionText": "Explore Collateral Explainer",
    "status": "verified",
    "id": "property_documents_incomplete"
  },
  {
    "scenarioCode": "PARENT_EXISTING_LOAN_FOIR",
    "title": "Parent Already Has Another Existing Loan (High FOIR)",
    "category": "credit_history",
    "summary": "Mitigating high Fixed Obligation to Income Ratio (FOIR) when parents are servicing existing home or personal loans.",
    "problemExplanation": "Banks assess the co-borrower Fixed Obligation to Income Ratio (FOIR). When total monthly debt servicing exceeds 50% to 60% of net monthly earnings, credit appraisal systems may reject or restrict loan sanctioning.",
    "practicalGuidance": [
      "Add an earning second co-applicant (such as an employed elder brother, sister, or mother) to increase total household debt servicing headroom.",
      "Highlight the statutory moratorium: because principal EMI repayment is deferred until after graduation, immediate monthly cash outflows will not increase.",
      "Provide evidence of impending closure of small personal or vehicle loans within 3 to 6 months to reduce computed obligations.",
      "Target public sector banks where student future employability at accredited universities is given primary appraisal weight over strict parent FOIR."
    ],
    "relevantDocuments": [
      "Existing loan sanction letters and latest 6-month repayment statements",
      "Proof of prospective loan closure (no-objection certificates or final installments)",
      "Second co-borrower salary slips and ITR-V",
      "Student academic scorecards and university NIRF accreditation details"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Standard FOIR cap is 50-60%; can consider higher FOIR when future student earning potential is documented."
      },
      {
        "bankName": "Union Bank of India",
        "condition": "Permits addition of joint co-borrowers from immediate family to satisfy net disposable income norms."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Evaluates combined household surplus after deducting all existing retail loan obligations."
      }
    ],
    "officialSource": {
      "value": "Retail Loan Underwriting Norms & FOIR Standards",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/calculator",
    "actionText": "Simulate Moratorium & EMI",
    "status": "verified",
    "id": "parent_existing_loan_foir"
  },
  {
    "scenarioCode": "LOW_PARENTAL_INCOME",
    "title": "Parent Has Low Annual Income (EWS / BPL / Low Income)",
    "category": "income_and_salary",
    "summary": "Leveraging central government interest subsidies and statutory priority sector mandates for low-income families.",
    "problemExplanation": "Families with low annual earnings often believe they cannot qualify for higher education financing. Under national guidelines, education loans are student-centric, and low family income unlocks major central interest subsidies.",
    "practicalGuidance": [
      "Apply for the Central Sector Interest Subsidy (CSIS) scheme if annual family income is up to INR 4.5 Lakhs: 100% of interest accrued during study + moratorium is paid by the Government of India.",
      "Explore PM-Vidyalaxmi (2024) if annual family income is up to INR 8.0 Lakhs: provides a 3% interest subvention during the moratorium period.",
      "Remind the branch that under IBA Model Scheme directives, loans are sanctioned primarily on the academic merit and future earning capacity of the student.",
      "Obtain an authorized State Government Income Certificate to attach with the loan application on the Vidya Lakshmi portal."
    ],
    "relevantDocuments": [
      "State Revenue Authority Income Certificate (duly signed by authorized officer)",
      "EWS / BPL / Community certificate where applicable",
      "Admission confirmation and university fee structure on letterhead",
      "10th and 12th marksheets demonstrating academic eligibility"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Mandatory implementation of CSIS 100% interest waiver for eligible income <= INR 4.5L."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Disburses interest subsidy claims directly via Canara Bank nodal portal under MoE guidelines."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Nodal bank for Government of India CSIS subsidy; seamless interest subsidy tagging at branch level."
      }
    ],
    "officialSource": {
      "value": "Central Sector Interest Subsidy (CSIS) Scheme / Ministry of Education",
      "source": "Department of Higher Education, MoE",
      "sourceUrl": "https://www.education.gov.in",
      "lastVerified": "2026-08-25",
      "status": "verified"
    },
    "officialActionLink": "/schemes",
    "actionText": "View CSIS & PM-Vidyalaxmi Schemes",
    "status": "verified",
    "id": "low_parental_income"
  },
  {
    "scenarioCode": "COAPPLICANT_NO_INCOME_PROOF",
    "title": "Co-Applicant Cannot Provide Formal Income Proof",
    "category": "income_and_salary",
    "summary": "Alternative administrative steps when the co-borrower has unorganized income with zero receipts or tax records.",
    "problemExplanation": "When co-applicants operate in the informal economy, cash earnings cannot be substantiated with salary slips or ITRs. Credit appraisal engines flag absent income documentation as high risk.",
    "practicalGuidance": [
      "Obtain an official Income Certificate issued by the local Tahsildar, Mandal Revenue Officer, or Block Development Officer (BDO).",
      "Add a tax-paying or formally employed family member (e.g. working elder sibling or close relative) as a joint co-applicant.",
      "Apply for loans up to INR 7.5 Lakhs under CGFSEL credit-guarantee coverage, where the student admission to an accredited university is the core underwriting anchor.",
      "Submit a notarized self-declaration affidavit accompanied by 12 months savings passbook showing family cash turnover."
    ],
    "relevantDocuments": [
      "Tahsildar / Revenue Authority Income Certificate",
      "Notarized Income Affidavit on Stamp Paper",
      "12-month savings account bank passbook",
      "KYC documents (Aadhaar, PAN card, Voter ID) of co-applicant",
      "Secondary co-borrower income documents (if added)"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Accepts Revenue Authority certificate in absence of formal commercial income proof."
      },
      {
        "bankName": "Bank of Baroda",
        "condition": "Branch manager discretionary assessment permitted for rural informal income up to INR 4 Lakhs."
      },
      {
        "bankName": "Union Bank of India",
        "condition": "Mandates parent co-borrower; permits adding earning relative to satisfy income documentation."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme & Credit Appraisal Directions",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/practical-help?tab=salary-slip",
    "actionText": "Check Informal Income Alternatives",
    "status": "verified",
    "id": "coapplicant_no_income_proof"
  },
  {
    "scenarioCode": "FIRST_YEAR_STUDENT",
    "title": "No College Identity Card Issued Yet (Newly Admitted Student)",
    "category": "course_and_institution",
    "summary": "Applying for an education loan before semester commencement and before official student ID issuance.",
    "problemExplanation": "Students often believe they must possess an official physical student ID card to apply for a bank loan. This creates a catch-22, as colleges demand fee payment prior to enrollment and ID issuance.",
    "practicalGuidance": [
      "Banks do NOT require a physical student identity card to process or sanction an education loan.",
      "Submit the formal Admission Letter / Provisional Allotment Memo issued through entrance counseling (e.g. VITEEE).",
      "Provide the official Bonafide Certificate and 4-Year Fee Structure printed on university letterhead.",
      "Attach the counseling registration fee receipt and entrance examination scorecard."
    ],
    "relevantDocuments": [
      "Provisional Admission Offer / Seat Allotment Memo",
      "Entrance examination rank scorecard (e.g., VITEEE / JEE)",
      "Official Institutional Fee Structure on University Letterhead",
      "Counseling fee or initial seat acceptance deposit receipt",
      "Student 10th and 12th original marksheets and passing certificates"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Processes and issues In-Principle Sanction on admission letter; disbursement executed upon fee demand note."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Accepts seat allotment order and entrance scorecard as sufficient proof of student admission."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Allotment letter issued by university entrance authority accepted in lieu of student identity card."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme - Section 4 Eligibility",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/practical-help?tab=verification",
    "actionText": "View Student Verification Guide",
    "status": "verified",
    "id": "first_year_student"
  },
  {
    "scenarioCode": "PROVISIONAL_ADMISSION_OFFER",
    "title": "Admission is Provisional Pending Final Verification",
    "category": "course_and_institution",
    "summary": "Securing an In-Principle Sanction Letter when college admission is provisional.",
    "problemExplanation": "Universities routinely issue provisional admission letters during early seat counseling rounds pending final board marks verification or migration submissions. Students wonder if banks can sanction loans on provisional offers.",
    "practicalGuidance": [
      "Commercial banks routinely issue an In-Principle Sanction Letter based on provisional admission offers.",
      "The In-Principle Sanction confirms loan eligibility and quantum, allowing students to present it to universities for fee payment extension.",
      "Final fund disbursement is released once the student submits the final enrollment slip, confirmed admission memo, and university fee demand notice.",
      "Ensure all provisional conditions (such as minimum 60% board aggregate) are met prior to disbursement."
    ],
    "relevantDocuments": [
      "Provisional Admission Offer Letter / Seat Allotment Letter",
      "Entrance exam scorecard (VITEEE / JEE)",
      "Undertaking of provisional admission terms from student",
      "Complete 4-year fee estimate structure on letterhead",
      "Parent KYC and income documents"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Issues In-Principle Sanction based on provisional seat allotment; disbursement against confirmed fee notice."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Sanction valid for 6 months; final disbursement upon submission of confirmed admission receipt."
      },
      {
        "bankName": "Bank of Baroda",
        "condition": "Accepts provisional offer for appraisal; disbursement conditional on final marks verification."
      }
    ],
    "officialSource": {
      "value": "Operational Guidelines for Education Loan Sanctions",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/journey",
    "actionText": "Start Student Journey",
    "status": "verified",
    "id": "provisional_admission_offer"
  },
  {
    "scenarioCode": "STUDY_GAP_YEAR_AFFIDAVIT",
    "title": "Academic Break or Study Gap Year (Drop Year)",
    "category": "course_and_institution",
    "summary": "Standard affidavit and verification procedure for students with 1 to 2 gap years between schooling and college.",
    "problemExplanation": "Taking a gap year after Class 12 to prepare for competitive exams (JEE, NEET, VITEEE) is common in India. Students worry that an academic gap will cause loan rejection.",
    "practicalGuidance": [
      "A gap year does NOT disqualify an applicant from securing an education loan under IBA guidelines.",
      "Submit a notarized Gap Year Affidavit on non-judicial stamp paper stating the legitimate reasons for the study break.",
      "Valid reasons include: coaching for competitive engineering entrances, medical recuperation, or family circumstances.",
      "The bank verifies that the student was not involved in disciplinary actions or criminal proceedings during the gap period."
    ],
    "relevantDocuments": [
      "Notarized Gap Year Affidavit on Non-Judicial Stamp Paper (INR 100)",
      "Coaching institute admission receipt or study attendance proof (if applicable)",
      "Medical fitness certificate (if gap was due to health reasons)",
      "Passing certificate of 12th board and current year entrance scorecard"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Accepts up to 2-3 years gap with notarized affidavit explaining competitive exam preparation."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Gap certificate required on stamp paper; merits evaluated on current entrance exam rank."
      },
      {
        "bankName": "Union Bank of India",
        "condition": "Standard affidavit accepted without penalty or rate increment."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme - Academic Continuity Norms",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/practical-help?tab=what-if",
    "actionText": "View Academic Edge-Cases",
    "status": "verified",
    "id": "study_gap_year_affidavit"
  },
  {
    "scenarioCode": "LOW_ACADEMIC_MARKS_ENTRANCE",
    "title": "Low Academic Marks in 10+2 / Qualifying Exam",
    "category": "course_and_institution",
    "summary": "Appraisal criteria when qualifying board marks are around 50% to 60% but student cleared entrance exam.",
    "problemExplanation": "Public sector banks often specify minimum academic marks (50-60%) for education loans. Students who secured admission through entrance tests with modest board scores worry about underwriting rejection.",
    "practicalGuidance": [
      "Most public banks require 50% to 60% aggregate in 10+2 (with 5% relaxation for SC/ST candidates).",
      "Admission secured through a recognized merit entrance exam (e.g. VITEEE rank list) establishes merit admission under IBA norms.",
      "If board marks are borderline, strengthen the application with a credit-worthy co-applicant and clean financial track record.",
      "Voluntarily offering to service simple interest monthly during the moratorium significantly improves branch confidence."
    ],
    "relevantDocuments": [
      "10th and 12th class marks sheets and passing certificates",
      "Entrance exam scorecard showing rank and qualification status (VITEEE)",
      "University merit admission confirmation letter",
      "Co-borrower credit profile and CIBIL report"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Requires minimum 50% in qualifying examination; entrance rank confirms merit quota status."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Minimum 50% marks for General category and 45% for SC/ST/OBC in qualifying exam."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Pass marks in qualifying exam sufficient when admission is through recognized national/state entrance test."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme - Section 4 (Student Eligibility)",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/practical-help?tab=approval-factors",
    "actionText": "Review Approval Factors",
    "status": "verified",
    "id": "low_academic_marks_entrance"
  },
  {
    "scenarioCode": "SCHOLARSHIP_MARGIN_MONEY_OFFSET",
    "title": "Student Holds a Scholarship (Margin Money Adjustment)",
    "category": "expenses_and_fees",
    "summary": "Crediting scholarships and fee waivers directly against required parent margin money contribution.",
    "problemExplanation": "For loans exceeding INR 4.0 Lakhs in India, banks stipulate a mandatory 5% Margin Money. Students receiving scholarships often do not realize that these funds can legally substitute family cash contributions.",
    "practicalGuidance": [
      "Under Reserve Bank of India and IBA directives, any scholarship, fee waiver, or fellowship can be adjusted against margin money.",
      "Example: If total course cost is INR 10 Lakhs, the 5% margin money is INR 50,000. A scholarship of INR 50,000 completely satisfies the margin requirement.",
      "The bank computes net loan requirement as: Total Eligible Course Cost minus Scholarship minus Margin.",
      "Submit the official scholarship award letter from the government or university to claim the adjustment."
    ],
    "relevantDocuments": [
      "Official Scholarship Award Letter / Merit Fellowship Certificate",
      "Fee concession receipt issued by university finance office",
      "Total 4-year fee structure indicating gross and net payable amounts",
      "Bank account statement showing scholarship credit (if disbursed directly)"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Scholarship amount credited towards student margin money on pro-rata basis per semester."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Scholarship reduces margin money requirement; surplus scholarship reduces bank loan quantum."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Full scholarship adjustment allowed against mandatory 5% margin for domestic courses."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme - Section 6 Margin Money",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/compare",
    "actionText": "Compare Margin Money Terms",
    "status": "verified",
    "id": "scholarship_margin_money_offset"
  },
  {
    "scenarioCode": "HOSTEL_EXPENSES_INCLUSION",
    "title": "Inclusion of Hostel, Mess, and Living Expenses in Loan",
    "category": "expenses_and_fees",
    "summary": "Procedures and limits for covering on-campus and private hostel boarding expenses.",
    "problemExplanation": "Students living away from home assume education loans only cover academic tuition fees. At residential campuses like VIT Bhopal, hostel and mess charges represent a substantial portion of total expenses.",
    "practicalGuidance": [
      "Hostel and mess boarding expenses are 100% eligible course expenses under IBA Model Scheme directives.",
      "For on-campus hostels, banks disburse the allocated hostel and mess fees directly to the university account against the official fee demand notice.",
      "For off-campus or private accommodation, banks require certified hostel rent agreements and disburse reasonable living costs.",
      "Ensure hostel fees are listed in the institutional Bonafide Certificate before submitting to the bank."
    ],
    "relevantDocuments": [
      "Official university hostel and mess fee schedule on letterhead",
      "Hostel allotment slip / room booking receipt from university hostel office",
      "Comprehensive 4-year fee structure including residential charges",
      "Rent agreement and landlord receipt (for off-campus living)"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Hostel and boarding fees reimbursed/disbursed in full as per university fee circular."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Permits actual hostel charges or reasonable off-campus living expenses verified by branch."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Boarding and lodging charges covered up to reasonable ceiling as certified by college."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme - Section 5 Eligible Expenses",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/practical-help?tab=min-documents",
    "actionText": "Check Document Requirements",
    "status": "verified",
    "id": "hostel_expenses_inclusion"
  },
  {
    "scenarioCode": "LAPTOP_COMPUTER_EQUIPMENT_EXPENSE",
    "title": "Financing a Laptop, Computer, or Equipment",
    "category": "expenses_and_fees",
    "summary": "Reimbursement and direct disbursement rules for purchasing essential engineering laptops and equipment.",
    "problemExplanation": "Engineering students require capable laptops for coding, simulations, and lab projects. Many do not know that computer hardware can be bundled into their education loan.",
    "practicalGuidance": [
      "Computers and laptops necessary for coursework are explicitly classified as eligible expenses under the IBA Model Scheme.",
      "Banks typically fund laptop purchases up to a reasonable cap (e.g. 20% of total tuition or actual market invoice cost).",
      "Submit a proforma invoice or vendor quotation from an authorized computer retailer with GST details.",
      "The bank disburses the amount directly to the computer vendor via demand draft/RTGS or reimburses the student upon invoice submission."
    ],
    "relevantDocuments": [
      "Proforma Invoice / Quotation from authorized computer dealer (with GSTIN)",
      "University syllabus or department circular indicating computer requirement",
      "Final retail tax invoice and payment receipt (for post-purchase reimbursement)"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Covers computer purchase up to reasonable limit if essential for course completion."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Funds laptop/computer against vendor quotation; original receipt to be deposited with branch."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Eligible under equipment costs; direct payment made to vendor upon invoice."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme - Section 5 (Eligible Expenses)",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/calculator",
    "actionText": "Calculate Total Loan Costs",
    "status": "verified",
    "id": "laptop_computer_equipment_expense"
  },
  {
    "scenarioCode": "FIFTEEN_LAKH_REQUIREMENT",
    "title": "Loan Amount Exceeds Standard Limits (Above INR 7.5L / 15L)",
    "category": "expenses_and_fees",
    "summary": "Collateral structures, CGFSEL limits, and scholar loan schemes for higher financing requirements.",
    "problemExplanation": "Private university engineering programs (including tuition, hostel, and laptop) often total INR 10 Lakhs to 18 Lakhs. Standard collateral-free caps frequently fall short of total degree expenses.",
    "practicalGuidance": [
      "Loans between INR 7.5 Lakhs and INR 15 Lakhs require tangible collateral security with 100% value coverage plus interest buffer, unless covered under specific credit guarantee circulars.",
      "Eligible collateral includes residential property, commercial plots, fixed deposits, or surrender value of life insurance policies.",
      "Premier institute schemes (e.g. SBI Scholar Loan list or Canara Vidya Turan Category-B) provide elevated limits with relaxed collateral norms.",
      "If collateral is unavailable, apply for the maximum collateral-free limit (INR 7.5 Lakhs) and fund the balance via margin money or education scholarships."
    ],
    "relevantDocuments": [
      "Complete 4-year institutional fee structure",
      "Collateral property title deeds, mutation records, and non-encumbrance certificate",
      "Valuation report by bank empanelled engineer",
      "Title search report by bank empanelled advocate",
      "FD receipts / NSC certificates (for liquid collateral)"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Requires 100% tangible collateral security for loans exceeding INR 7.5 Lakhs under Student Loan Scheme."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Canara Vidya Turan sanctions up to INR 20 Lakhs collateral-free for approved premier institutions."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Loans above INR 7.5 Lakhs require tangible collateral covering 100% loan amount plus co-obligation."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme - Section 7 Security",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/compare",
    "actionText": "Compare Bank Quantum Limits",
    "status": "verified",
    "id": "fifteen_lakh_requirement"
  },
  {
    "scenarioCode": "FLOATING_INTEREST_RATE_CHANGES",
    "title": "What Happens When the Interest Rate Changes (Repo / EBLR)",
    "category": "repayment_and_interest",
    "summary": "Understanding floating benchmark rate resets and their impact on moratorium interest and repayment EMI.",
    "problemExplanation": "All commercial education loans in India operate on floating rates linked to the RBI Repo Rate (EBLR/RLLR). When the central bank updates monetary policy, students wonder how rate resets impact their monthly burden.",
    "practicalGuidance": [
      "Education loan interest rates are structured as: External Benchmark Rate (Repo/EBLR) + Bank Spread.",
      "When the RBI Monetary Policy Committee raises or lowers the Repo Rate, your loan interest rate adjusts on the bank scheduled reset date (usually quarterly).",
      "During the study moratorium, accrued simple interest is calculated at the revised floating rate.",
      "During the repayment phase, banks usually adjust the repayment tenure (shortening or extending the number of months) rather than changing monthly EMI, within the 15-year ceiling."
    ],
    "relevantDocuments": [
      "Bank Loan Sanction Letter showing EBLR benchmark and locked spread",
      "Bank rate reset notification letters or interest rate circulars",
      "Latest loan account statement showing current applied interest rate"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Tied to EBLR (Repo Linked); resets on the 1st of the month following RBI policy revision."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Tied to RLLR (Repo Linked Lending Rate); quarterly reset cycle."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Tied to RLLR + spread; changes communicated via online net banking statement."
      }
    ],
    "officialSource": {
      "value": "Master Direction on External Benchmark Based Lending (EBLR)",
      "source": "Reserve Bank of India (RBI)",
      "sourceUrl": "https://www.rbi.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/calculator",
    "actionText": "Simulate Interest Accrual",
    "status": "verified",
    "id": "floating_interest_rate_changes"
  },
  {
    "scenarioCode": "MORATORIUM_REPAYMENT_HOLIDAY",
    "title": "Cannot Start Monthly EMI Immediately (Moratorium Holiday)",
    "category": "repayment_and_interest",
    "summary": "Statutory repayment holiday rules during course duration and 12-month post-study grace period.",
    "problemExplanation": "Families worry about immediate financial strain, believing they must begin servicing monthly EMIs while the student is still in college.",
    "practicalGuidance": [
      "Under national banking norms, education loans feature a statutory Moratorium (repayment holiday): Course Duration + 12 Months (or 6 months after starting employment, whichever is earlier).",
      "No principal repayment or mandatory EMI is required during the moratorium window.",
      "Simple interest accrues during the study period. If unpaid, accrued interest is capitalized (added to principal) at the end of the moratorium to fix your post-study monthly EMI.",
      "Voluntary servicing of simple interest monthly during the moratorium earns a 1% interest concession at several public banks."
    ],
    "relevantDocuments": [
      "Loan Agreement confirming Moratorium Period clauses",
      "Course completion certificate / provisional degree (to mark moratorium expiry)",
      "Bank loan account statement reflecting monthly simple interest accruals"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Moratorium = Course period + 12 months. 1% interest concession if simple interest is serviced during study."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Moratorium = Course + 1 year. Repayment tenure up to 15 years post-moratorium."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Course duration + 12 months or 6 months post-employment; 1% rebate on prompt moratorium interest servicing."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme - Section 8 Moratorium & Repayment",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/calculator",
    "actionText": "Explore Moratorium Savings",
    "status": "verified",
    "id": "moratorium_repayment_holiday"
  },
  {
    "scenarioCode": "EARLY_PREPAYMENT_ZERO_PENALTY",
    "title": "Early Prepayment and Foreclosure Without Penalty Charges",
    "category": "repayment_and_interest",
    "summary": "Statutory rights under RBI directives prohibiting foreclosure penalties on floating-rate education loans.",
    "problemExplanation": "Borrowers fear that repaying lump sums from job bonuses or clearing the loan early will incur hefty 2% to 4% bank prepayment penalties.",
    "practicalGuidance": [
      "The Reserve Bank of India strictly prohibits commercial banks from levying any prepayment penalty or foreclosure fee on floating-rate retail loans.",
      "You can make partial prepayments of any amount at any time, directly reducing the outstanding principal balance.",
      "Prepaying principal early cuts the compounding interest base, shortening the total loan tenure significantly.",
      "Ensure the branch credits prepayments towards Principal Reduction rather than setting them aside as advance future EMIs."
    ],
    "relevantDocuments": [
      "Bank deposit slip or net banking transaction reference for prepayment",
      "Updated amortization schedule issued by branch reflecting reduced tenure",
      "No Dues Certificate (NOC) and returned property deeds upon final foreclosure"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Zero prepayment penalty; prepayments can be made online via YONO or net banking."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Nil foreclosure charges; principal reduces on same day of credit."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Nil prepayment penalty across all floating rate education loan variants."
      }
    ],
    "officialSource": {
      "value": "RBI Master Direction on Customer Service - Prepayment of Retail Loans",
      "source": "Reserve Bank of India (RBI)",
      "sourceUrl": "https://www.rbi.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/calculator",
    "actionText": "Simulate Early Prepayment",
    "status": "verified",
    "id": "early_prepayment_zero_penalty"
  },
  {
    "scenarioCode": "IDENTICAL_INTEREST_RATES_SELECTION",
    "title": "Choosing Between Two Banks With Identical Interest Rates",
    "category": "decision_and_guidance",
    "summary": "Objective criteria beyond headline interest rates to compare commercial and operational value.",
    "problemExplanation": "When two public banks offer the exact same interest rate (e.g. 9.15%), students struggle to decide which institution offers superior financial and practical terms.",
    "practicalGuidance": [
      "Examine the Permanent Spread: What is the contractual spread above Repo Rate, and how transparent is the reset mechanism?",
      "Check Special Concessions: Does the bank provide a 0.50% interest concession for female students or a 1.00% rebate for servicing interest during moratorium?",
      "Review Incidental Costs: Compare one-time processing charges, advocate legal title vetting fees, and engineer valuation fees.",
      "Evaluate Campus Presence: Does the bank operate an on-campus branch or designated tie-up desk at VIT Bhopal for seamless semester disbursements?"
    ],
    "relevantDocuments": [
      "Sanction terms and condition sheets from both prospective lenders",
      "Schedule of processing fees, documentation charges, and out-of-pocket expenses",
      "Campus branch contact directory and service-level commitments"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "0.50% concession for girl students; 1.00% concession for servicing interest during moratorium."
      },
      {
        "bankName": "Canara Bank",
        "condition": "0.50% concession for girl students; fast-track disbursement for approved engineering institutions."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "0.50% concession for girl students; zero processing fee for inland studies up to INR 7.5L."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme - Concessions & Incentives",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/compare",
    "actionText": "Compare 20+ Bank Parameters",
    "status": "verified",
    "id": "identical_interest_rates_selection"
  },
  {
    "scenarioCode": "LOWER_RATE_HIGHER_FEES_APR",
    "title": "Lower Interest Rate vs Higher Upfront Processing Fees",
    "category": "decision_and_guidance",
    "summary": "Calculating the total cost of borrowing (APR) when evaluating fee versus rate trade-offs.",
    "problemExplanation": "Bank A offers an interest rate of 8.85% with an INR 10,000 processing fee, while Bank B offers 9.10% with zero processing fee. Borrowers frequently make suboptimal choices based on upfront fees alone.",
    "practicalGuidance": [
      "Calculate the Total Cost of Borrowing over the full 10 to 15-year repayment horizon.",
      "A 0.25% lower interest rate on an INR 10 Lakh loan saves approximately INR 18,000 to 25,000 in compounding interest over 10 years.",
      "The one-time INR 10,000 fee is easily recovered within the first 3 to 4 years of repayment through interest savings.",
      "Verify whether the lower rate is a permanent spread or a temporary introductory teaser that rises after 1 year."
    ],
    "relevantDocuments": [
      "Key Fact Statement (KFS) from both banks displaying Annual Percentage Rate (APR)",
      "Processing fee schedule and tax invoice (with GST breakdown)",
      "Loan repayment amortization schedule for both interest rate options"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Nil processing fee for inland studies up to INR 20 Lakhs under Student Loan Scheme."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Nil processing fee up to INR 7.5 Lakhs; nominal upfront documentation charges."
      },
      {
        "bankName": "Private Commercial Banks",
        "condition": "Processing fee typically 1% to 1.5% + GST; mandatory to inspect Key Fact Statement (KFS)."
      }
    ],
    "officialSource": {
      "value": "RBI Guidelines on Digital Lending & Key Fact Statement (KFS)",
      "source": "Reserve Bank of India (RBI)",
      "sourceUrl": "https://www.rbi.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/calculator",
    "actionText": "Simulate Total Repayment Cost",
    "status": "verified",
    "id": "lower_rate_higher_fees_apr"
  },
  {
    "scenarioCode": "ADDITIONAL_DOCUMENTS_REQUESTED",
    "title": "Bank Branch Requests Additional Documents During Processing",
    "category": "application_and_portal",
    "summary": "Managing bank queries, branch legal requests, and supplementary underwriting requisitions.",
    "problemExplanation": "After initial application submission on Vidya Lakshmi, branch managers frequently pause processing, requesting supplementary papers not on the standard checklist.",
    "practicalGuidance": [
      "Request a formal written or portal-generated requisition list specifying the exact reasons for the extra documentation.",
      "Common supplementary requests include: 13-year non-encumbrance certificate, revised university fee breakup letter, Form 26AS, or student semester marksheets.",
      "Submit the documents under a formal submission covering letter and obtain an acknowledged, signed, and stamped receiving copy.",
      "If arbitrary or prohibited documents are demanded (e.g. collateral for <= INR 7.5L), respectfully cite RBI circular guidelines."
    ],
    "relevantDocuments": [
      "Official Document Requisition Letter from branch",
      "Formal Document Submission Covering Letter (with student signature)",
      "Acknowledged Receiving Copy stamped by bank officer",
      "Supplementary records requested (e.g., Form 26AS, NEC, University Bonafide)"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Branch must communicate document deficiencies within 7 working days of receipt."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Requests can be tracked and fulfilled online through the Retail Loan portal."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Branch manager requires verified KYC originals for in-person document scrutiny."
      }
    ],
    "officialSource": {
      "value": "Charter of Customer Rights - Right to Transparent Pricing & Fair Treatment",
      "source": "Reserve Bank of India (RBI)",
      "sourceUrl": "https://www.rbi.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/practical-help?tab=min-documents",
    "actionText": "Verify Required Document List",
    "status": "verified",
    "id": "additional_documents_requested"
  },
  {
    "scenarioCode": "APPLICATION_RETURNED_CORRECTION",
    "title": "Application Status Marked 'Returned' on Vidya Lakshmi",
    "category": "application_and_portal",
    "summary": "Resolving portal return remarks and rectifying document defects without starting over.",
    "problemExplanation": "Students panic when their Vidya Lakshmi portal status changes to 'Returned', believing their loan has been permanently denied. 'Returned' means document deficiency, not rejection.",
    "practicalGuidance": [
      "Log into your Vidya Lakshmi Portal dashboard and navigate to the 'Application Status' tab to view specific return remarks.",
      "Common return causes: blurred PDF scan, mismatch in co-applicant name between PAN and Aadhaar, or outdated fee structure.",
      "Correct the identified defect, upload clear high-resolution scanned PDFs, and resubmit through the portal.",
      "A returned application preserves your original Common Educational Loan Application Form (CELAF) and CELFS registration number."
    ],
    "relevantDocuments": [
      "Vidya Lakshmi CELFS Application ID and Login Credentials",
      "Official Return Remarks / Defect Notice from portal dashboard",
      "Corrected high-resolution PDF documents (under 2MB)",
      "University fee circular with matching applicant details"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Branches enter return remarks directly on CELFS; applicants have 15 days to resubmit."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Provides SMS alert when application is returned with rectification instructions."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Resubmission triggers automatic reassignment to branch credit appraisal officer."
      }
    ],
    "officialSource": {
      "value": "Vidya Lakshmi Portal Operating Manual & FAQs",
      "source": "Protean eGov Technologies Limited",
      "sourceUrl": "https://www.vidyalakshmi.co.in",
      "lastVerified": "2026-08-25",
      "status": "verified"
    },
    "officialActionLink": "/schemes",
    "actionText": "View Portal Guide",
    "status": "verified",
    "id": "application_returned_correction"
  },
  {
    "scenarioCode": "APPLICATION_REJECTED_REMEDIES",
    "title": "Application Rejected by Bank: Statutory Rights and Recourse",
    "category": "application_and_portal",
    "summary": "Understanding formal rejection reasons, switching co-applicants, and multi-bank application rights.",
    "problemExplanation": "When a bank issues a formal rejection letter, students feel hopeless. In reality, banking regulations provide specific remedies, alternate co-borrower options, and multi-bank rights.",
    "practicalGuidance": [
      "Under the RBI Charter of Customer Rights, the bank must provide a specific written reason for rejection.",
      "If rejected for co-applicant credit score (CIBIL < 650), replace or add an eligible co-borrower with clean credit history.",
      "If rejected for loan quantum or collateral, scale down the loan request to INR 7.5 Lakhs under CGFSEL credit guarantee.",
      "You are legally permitted to apply to up to three banks simultaneously on the Vidya Lakshmi Portal; rejection by one lender does not affect another."
    ],
    "relevantDocuments": [
      "Formal Rejection Letter issued by bank branch stating specific grounds",
      "Credit Bureau Report (CIBIL/Experian) of primary co-applicant",
      "Alternative co-borrower KYC and income documentation",
      "Vidya Lakshmi second/third bank application submission receipts"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Rejections must be approved by Controller / Assistant General Manager (AGM) level."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Written communication required; applicant can appeal to Regional Nodal Grievance Officer."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Re-application allowed immediately with alternate co-borrower or restructured security."
      }
    ],
    "officialSource": {
      "value": "RBI Master Direction on Priority Sector Lending & Customer Rights",
      "source": "Reserve Bank of India (RBI)",
      "sourceUrl": "https://www.rbi.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/practical-help?tab=approval-factors",
    "actionText": "Review Approval Factors",
    "status": "verified",
    "id": "application_rejected_remedies"
  },
  {
    "scenarioCode": "DIFFERENT_TERMS_RISK_PRICING",
    "title": "Bank Offers Different Terms Than Advertised (Risk Pricing)",
    "category": "decision_and_guidance",
    "summary": "Addressing higher interest spreads, unexpected fees, or collateral demands in the formal sanction letter.",
    "problemExplanation": "Students often receive a Sanction Letter specifying an interest rate 0.50% to 1.00% higher than advertised on the bank website, leading to confusion and mistrust.",
    "practicalGuidance": [
      "Final interest rates reflect risk-based pricing: banks evaluate co-applicant CIBIL score band, institution accreditation, and security strength.",
      "Compare the sanctioned spread against the bank active Master Circular for Education Loans.",
      "Verify that all mandatory statutory concessions (e.g. 0.50% girl student concession or 1.00% prompt servicing concession) have been credited.",
      "If unauthorized charges or collateral demands appear, request written clarification citing published circular rules before signing."
    ],
    "relevantDocuments": [
      "Formal Loan Sanction Letter with detailed terms and conditions",
      "Bank official Master Circular for Education Loans (downloaded from website)",
      "Co-borrower CIBIL score report showing credit band",
      "Girl student identity proof / scholarship eligibility certificate"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Rate spread tied strictly to credit score band (CIBIL >= 750 receives lowest spread)."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Institutional category (Tier A/B) determines base rate spread."
      },
      {
        "bankName": "Union Bank of India",
        "condition": "Full disclosure of spread components required in Sanction Letter."
      }
    ],
    "officialSource": {
      "value": "RBI Guidelines on Fair Practices Code & Risk-Based Loan Pricing",
      "source": "Reserve Bank of India (RBI)",
      "sourceUrl": "https://www.rbi.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/compare",
    "actionText": "Compare Master Circular Terms",
    "status": "verified",
    "id": "different_terms_risk_pricing"
  },
  {
    "scenarioCode": "SCHEME_NOT_ON_VIDYA_LAKSHMI",
    "title": "Desired Bank Scheme Is Not Listed on Vidya Lakshmi",
    "category": "application_and_portal",
    "summary": "How to register and apply when campus-specific or specialized variants are missing from the dropdown.",
    "problemExplanation": "Certain specialized schemes (such as SBI Scholar Loan for specific engineering institutes or private bank tie-ups) do not appear in the Vidya Lakshmi portal dropdown menus.",
    "practicalGuidance": [
      "Apply under the bank flagship general education loan scheme (e.g. select 'SBI Student Loan Scheme' or 'Canara Vidya Turan') on Vidya Lakshmi to secure your CELFS ID.",
      "Submit the application to the branch mapped to your campus (e.g. SBI Kothri / VIT Bhopal campus desk).",
      "Present your CELFS registration acknowledgement at the branch desk and request the officer to map your file to the specific campus circular.",
      "Alternatively, check if the bank operates a dedicated institutional portal alongside Vidya Lakshmi."
    ],
    "relevantDocuments": [
      "Vidya Lakshmi CELFS Application ID and Acknowledgement Slip",
      "Admission confirmation letter indicating VIT Bhopal University campus",
      "Bank circular copy of the campus-specific scheme (if available)"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "SBI Student Loan on Vidya Lakshmi can be re-mapped to Scholar Loan circular at campus branch."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Canara Vidya Turan application maps automatically based on university selection."
      },
      {
        "bankName": "Bank of Baroda",
        "condition": "Flagship Baroda Scholar/Education loan can be tagged with premier institution circular at branch."
      }
    ],
    "officialSource": {
      "value": "Vidya Lakshmi Portal Guidelines - Scheme Mapping Directions",
      "source": "Protean eGov Technologies Limited",
      "sourceUrl": "https://www.vidyalakshmi.co.in",
      "lastVerified": "2026-08-25",
      "status": "verified"
    },
    "officialActionLink": "/schemes",
    "actionText": "View Portal Mapping Guide",
    "status": "verified",
    "id": "scheme_not_on_vidya_lakshmi"
  },
  {
    "scenarioCode": "VIDYA_LAKSHMI_APPLICATION_STALLED",
    "title": "Vidya Lakshmi Application Is Stalled or Showing No Progress",
    "category": "application_and_portal",
    "summary": "Escalation procedures, branch tracking, and banking ombudsman timelines for delayed applications.",
    "problemExplanation": "Students often wait weeks with zero status updates on Vidya Lakshmi after submitting online, leading to missed semester fee deadlines.",
    "practicalGuidance": [
      "Under Department of Financial Services (DFS) mandates, public banks must process applications within 15 to 30 working days.",
      "Visit the mapped processing branch in person with your CELFS application number and complete physical document pack.",
      "Check whether your application was routed to a Centralized Processing Centre (RACPC / SMECCC) rather than the local branch.",
      "Log a formal grievance on the Vidya Lakshmi Portal 'Grievance Redressal' tab and escalate to the Bank Zonal Banking Ombudsman if delays exceed 30 days."
    ],
    "relevantDocuments": [
      "Vidya Lakshmi Application Summary (CELFS registration printout)",
      "Complete physical document dossier with student submission copy",
      "Email correspondence / SMS trail with processing branch",
      "Formal grievance tracking ticket number from portal"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Track status via SBI Loan Tracking portal using CELFS number; branch visits recommended after 10 days."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Nodal officer contacts published on PNB corporate portal for stalled retail loans."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Regional retail loan hub oversees Vidya Lakshmi SLA compliance; branch manager can escalate."
      }
    ],
    "officialSource": {
      "value": "DFS Guidelines on Timely Disposal of Education Loans / MoF",
      "source": "Department of Financial Services, Ministry of Finance",
      "sourceUrl": "https://financialservices.gov.in",
      "lastVerified": "2026-08-25",
      "status": "verified"
    },
    "officialActionLink": "/tracker",
    "actionText": "Use Application Pipeline Tracker",
    "status": "verified",
    "id": "vidya_lakshmi_application_stalled"
  },
  {
    "scenarioCode": "INFORMATION_DIFFERENCE_BANK_WEBSITE",
    "title": "Edu4Loan Information Differs From the Bank Current Website",
    "category": "decision_and_guidance",
    "summary": "How to interpret floating interest rate updates, circular cycles, and authoritative primary sources.",
    "problemExplanation": "Commercial bank interest rates and external benchmark lending rates update frequently when RBI adjusts the Repo Rate. Users wonder which data point takes precedence.",
    "practicalGuidance": [
      "Edu4Loan indexes verified primary circulars with exact recorded verification timestamps.",
      "In any situation involving differing figures, the bank official published circular, formal sanction letter, and regulatory web disclosure supersede third-party portals.",
      "Always click the 'View Official Source' link on Edu4Loan to inspect the underlying master circular.",
      "Verify whether the rate on the bank website reflects an introductory teaser or specific credit score band."
    ],
    "relevantDocuments": [
      "Bank official Master Circular downloaded from primary website",
      "Edu4Loan source verification timestamp and reference link",
      "Sanction letter issued by the branch manager with formal terms"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Corporate website reflects standard rates; individual sanction terms depend on branch appraisal."
      },
      {
        "bankName": "All Scheduled Commercial Banks",
        "condition": "Sanction letter issued to applicant is legally binding over all public web summaries."
      }
    ],
    "officialSource": {
      "value": "IBA Guidelines on Transparency in Retail Lending Disclosures",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/statistics",
    "actionText": "Inspect Verified Spreads & SLAs",
    "status": "verified",
    "id": "information_difference_bank_website"
  },
  {
    "scenarioCode": "FEE_DEADLINE_APPROACHING_URGENCY",
    "title": "University Fee Payment Deadline is Fast Approaching",
    "category": "course_and_institution",
    "summary": "Immediate steps to prevent admission cancellation while loan underwriting is underway.",
    "problemExplanation": "Bank processing typically takes 15 to 25 working days, while college seat confirmation deadlines are often set within 7 to 10 days.",
    "practicalGuidance": [
      "Submit a formal 'Fee Payment Extension Request' to the VIT Bhopal Admissions/Finance Office with your loan application acknowledgement or Vidya Lakshmi CELFS ID.",
      "Request the branch manager to issue an expedited In-Principle Sanction Letter to submit to the university.",
      "If family savings allow, pay the initial installment or seat acceptance fee directly and request the bank for retroactive reimbursement in the first disbursement.",
      "Under IBA guidelines, fees paid directly by parents for the current academic session can be reimbursed by the bank upon formal loan sanction."
    ],
    "relevantDocuments": [
      "College Admission Offer showing fee payment deadline",
      "Vidya Lakshmi CELFS Application Submission Acknowledgement",
      "Written Fee Extension Request Letter addressed to Registrar/Admissions",
      "Original fee payment receipt (if advance payment was made for reimbursement)"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Reimbursement of fees paid within the last 6 months allowed upon submission of original university receipts."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Permits reimbursement of current semester fees paid prior to loan sanction."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Expedited sanction letters provided upon proof of imminent admission cancellation."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme - Section 5.3 Reimbursement Norms",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/practical-help?tab=timeline",
    "actionText": "View 9-Stage Processing Timeline",
    "status": "verified",
    "id": "fee_deadline_approaching_urgency"
  },
  {
    "scenarioCode": "PARENT_DOESNT_UNDERSTAND_AGREEMENT",
    "title": "Parent Does Not Understand Complex Banking Agreement",
    "category": "decision_and_guidance",
    "summary": "Accessing simplified plain-language explanations in regional languages before signing contracts.",
    "problemExplanation": "Loan agreements are dense legal documents filled with terminology like 'joint and several liability', 'hypothecation', and 'continuing guarantee' that intimidate non-English speaking parents.",
    "practicalGuidance": [
      "Switch to Parent Mode on Edu4Loan for simplified, jargon-free explanations in Hindi, Gujarati, or Bengali.",
      "Review the bilingual term breakdown on the platform comparing complex legal text with everyday definitions.",
      "Request the bank loan officer to verbally explain repayment schedules, interest capitalization, and co-obligation responsibilities in the parent preferred language before signing.",
      "Never sign blank promissory notes or undefined NACH mandate forms without verifying repayment ceilings."
    ],
    "relevantDocuments": [
      "Loan Agreement copy provided by branch before signing",
      "Edu4Loan Parent Mode bilingual reference cards",
      "Repayment amortization schedule showing post-moratorium monthly commitments"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "All Scheduled Commercial Banks",
        "condition": "Mandated under RBI Charter of Customer Rights to explain loan terms in the customer preferred vernacular language."
      }
    ],
    "officialSource": {
      "value": "Charter of Customer Rights - Right to Transparent & Easily Understandable Information",
      "source": "Reserve Bank of India (RBI)",
      "sourceUrl": "https://www.rbi.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/parent-mode",
    "actionText": "Switch to Parent Mode",
    "status": "verified",
    "id": "parent_doesnt_understand_agreement"
  },
  {
    "scenarioCode": "WHAT_IS_COLLATERAL_EXPLAINER",
    "title": "What is Collateral and What Happens If Pledged?",
    "category": "collateral_and_security",
    "summary": "Clear legal explanation of collateral, mortgage rights, and statutory protections for students.",
    "problemExplanation": "Students and parents fear that pledging property means the bank immediately owns their house or can seize it during minor payment delays.",
    "practicalGuidance": [
      "Collateral is a tangible financial or real estate asset (house, land, fixed deposit) pledged as security for loans above INR 7.5 Lakhs.",
      "The borrower retains ownership and possession of the property throughout the loan tenure.",
      "The bank only holds an equitable or registered mortgage; legal recovery under the SARFAESI Act occurs only after total, chronic default.",
      "Loans up to INR 4 Lakhs are legally barred from requiring collateral, and loans up to INR 7.5 Lakhs are protected under the CGFSEL credit guarantee scheme."
    ],
    "relevantDocuments": [
      "Original Title Deed / Sale Deed (deposited with bank for registered mortgage)",
      "Non-Encumbrance Certificate (NEC) for past 13 to 30 years",
      "Bank Memorandum of Entry for Equitable Mortgage",
      "Safe custody receipt issued by bank for original property documents"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Equitable mortgage created by deposit of title deeds; original documents kept in secure bank vault."
      },
      {
        "bankName": "All Public Sector Banks",
        "condition": "Zero collateral demanded up to INR 7.5 Lakhs under CGFSEL guidelines."
      }
    ],
    "officialSource": {
      "value": "SARFAESI Act 2002 & RBI Master Direction on Educational Loans",
      "source": "Reserve Bank of India (RBI)",
      "sourceUrl": "https://www.rbi.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/calculator",
    "actionText": "Check Collateral Rules",
    "status": "verified",
    "id": "what_is_collateral_explainer"
  },
  {
    "scenarioCode": "WHAT_IS_MORATORIUM_EXPLAINER",
    "title": "What is a Moratorium and How Does Interest Work?",
    "category": "repayment_and_interest",
    "summary": "Detailed financial mechanics of simple interest accrual, capitalization, and monthly repayment timing.",
    "problemExplanation": "Many students confuse moratorium with interest waiver, assuming no interest accumulates during college. This leads to shock when post-study EMIs turn out higher than expected.",
    "practicalGuidance": [
      "A moratorium is a repayment holiday: you are not required to pay principal EMIs during your 4 years of study plus 1 year grace.",
      "However, simple interest continues to accumulate every month unless covered by the Central Sector Interest Subsidy (CSIS).",
      "At the end of the moratorium, total accrued simple interest is added to the principal (capitalized) to calculate your final monthly EMI.",
      "Use the Edu4Loan Moratorium Calculator to simulate the exact impact of interest capitalization on your post-college repayments."
    ],
    "relevantDocuments": [
      "Bank sanction letter specifying moratorium buffer months",
      "Loan account interest accrual statement during study period",
      "Post-moratorium revised EMI amortization schedule"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Moratorium buffer is 12 months; interest capitalized only at the end of the moratorium."
      },
      {
        "bankName": "Canara Bank",
        "condition": "Moratorium interest treated as simple interest until repayment commencement."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Moratorium = Course duration + 1 year or 6 months post-job."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme - Section 8 Moratorium Guidelines",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/calculator",
    "actionText": "Launch Moratorium Calculator",
    "status": "verified",
    "id": "what_is_moratorium_explainer"
  },
  {
    "scenarioCode": "DONT_KNOW_WHICH_DOCUMENTS_NEEDED",
    "title": "Don't Know Which Documents Are Needed for Application",
    "category": "application_and_portal",
    "summary": "Organizing the standard 4-part document dossier for swift branch verification.",
    "problemExplanation": "Document checklists across various bank portals can appear overwhelming, causing students to delay applications.",
    "practicalGuidance": [
      "Assemble your dossier into 4 neat sets: Student Academic & KYC, Co-Borrower KYC, Income Proof, and University Receipts.",
      "Student: 10th/12th marksheets, entrance exam scorecard (VITEEE), admission offer letter, fee structure on letterhead, Aadhaar, PAN card, and photos.",
      "Co-Borrower: Aadhaar, PAN card, address proof, photos, and last 6-12 months bank statements.",
      "Generate an itemized, personalized checklist tailored to your bank and loan quantum using Edu4Loan Document Checklist Generator."
    ],
    "relevantDocuments": [
      "Self-attested photocopies of all 10th/12th marksheets and entrance rank card",
      "KYC documents for student and co-applicant (Aadhaar & PAN)",
      "University fee structure on official letterhead",
      "Income proof (ITR-V / Salary Slip / Tahsildar Certificate)"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "All Scheduled Commercial Banks",
        "condition": "Requires self-attested photocopies along with original documents for in-person branch verification."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme - Annexure Checklist",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/documents",
    "actionText": "Generate Personalized Checklist",
    "status": "verified",
    "id": "dont_know_which_documents_needed"
  },
  {
    "scenarioCode": "DONT_KNOW_WHICH_SCHEME_APPLIES",
    "title": "Don't Know Which Education Loan Scheme Applies to Me",
    "category": "decision_and_guidance",
    "summary": "Step-by-step decision framework matching loan amount and family income to verified schemes.",
    "problemExplanation": "With multiple bank schemes (SBI Student Loan, Scholar Loan, Canara Vidya Turan) and central portals (Vidya Lakshmi, PM-Vidyalaxmi, CSIS), applicants feel confused about which path to take.",
    "practicalGuidance": [
      "Step 1: Check Loan Quantum - Up to INR 7.5 Lakhs: prioritize standard public bank schemes to utilize collateral-free CGFSEL protection.",
      "Step 2: Check Family Income - Income <= INR 4.5 Lakhs qualifies for CSIS 100% interest waiver. Income <= INR 8.0 Lakhs qualifies for PM-Vidyalaxmi 3% subvention.",
      "Step 3: Loans above INR 7.5 Lakhs require tangible collateral or checking specific premier institute lists.",
      "Launch the interactive Student Journey tool on Edu4Loan to enter your specific parameters and instantly filter matching schemes."
    ],
    "relevantDocuments": [
      "Total 4-year fee estimate structure",
      "Family annual income certificate or ITR-V",
      "Student entrance exam scorecard (VITEEE)",
      "Collateral property details (if loan > INR 7.5L)"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "All Scheduled Commercial Banks",
        "condition": "Schemes can be compared side-by-side on Vidya Lakshmi and Edu4Loan."
      }
    ],
    "officialSource": {
      "value": "IBA Model Educational Loan Scheme & National Credit Framework",
      "source": "Indian Banks Association (IBA)",
      "sourceUrl": "https://www.iba.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/journey",
    "actionText": "Start Guided Student Journey",
    "status": "verified",
    "id": "dont_know_which_scheme_applies"
  },
  {
    "scenarioCode": "NO_CREDIT_HISTORY",
    "title": "Co-Applicant Has No Prior CIBIL Credit History (Score -1 / NH)",
    "category": "credit_history",
    "summary": "Handling first-time borrowers with zero credit history without receiving loan rejections.",
    "problemExplanation": "In semi-urban and rural areas, parents who have never taken a bank loan or credit card have a CIBIL score of -1 or No History (NH). Some automated appraisal software misinterprets this as poor credit.",
    "practicalGuidance": [
      "Under Reserve Bank of India retail lending guidelines, having No History (NH) is NOT a negative or default credit rating.",
      "Banks verify that there are no write-offs, suits filed, or wilful default records registered with CIBIL, Equifax, or Experian.",
      "Provide proof of banking discipline: 12 months savings account statements showing steady transactions and healthy average monthly balance.",
      "If the branch hesitates, provide utility bills or property tax receipts proving long-term residence and financial stability."
    ],
    "relevantDocuments": [
      "CIBIL Credit Information Report showing -1 or NH status",
      "12-month savings bank account passbook/statement",
      "Utility bills (electricity, water, telephone) for past 6 months",
      "Property tax receipt or voter identity card"
    ],
    "bankSpecificConditions": [
      {
        "bankName": "State Bank of India",
        "condition": "Accepts NH/-1 score without penalty if account conduct and KYC records are clean."
      },
      {
        "bankName": "Canara Bank",
        "condition": "First-time borrowers appraised via internal scoring model without penal interest spread."
      },
      {
        "bankName": "Punjab National Bank",
        "condition": "Absence of prior credit history is not a ground for rejection under education loan policy."
      }
    ],
    "officialSource": {
      "value": "Credit Information Companies (Regulation) Act & RBI Guidelines",
      "source": "Reserve Bank of India (RBI)",
      "sourceUrl": "https://www.rbi.org.in",
      "lastVerified": "2026-08-20",
      "status": "verified"
    },
    "officialActionLink": "/practical-help?tab=approval-factors",
    "actionText": "Understand Credit Underwriting",
    "status": "verified",
    "id": "no_credit_history"
  }
];
