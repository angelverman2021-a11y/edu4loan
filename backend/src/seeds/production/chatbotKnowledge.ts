/**
 * Authoritative Production Chatbot Domain Knowledge for Ask EDU4LOAN
 * Grounded strictly in official circulars, bank guidelines, and VIT Bhopal procedures.
 */

export const productionChatbotKnowledge = [
  {
    topicKey: "SALARY_SLIP_UNAVAILABLE",
    questionCanonical: "What if my parent does not have a salary slip?",
    questionAliases: [
      "salary slip nahi hai to kya kare",
      "parent has no salary slip",
      "no pay slip",
      "parent is self employed income proof",
      "father does not have payslip",
      "salary certificate alternative",
      "salary slip nathi to shu karvu",
      "স্যালারি স্লিপ নেই কি করব"
    ],
    answerSummary: "If your parent or co-borrower does not have a monthly corporate salary slip, banks in India accept multiple verified alternative proofs of income depending on their occupation.",
    detailedPoints: [
      "For Self-Employed or Business: Submit last 2 to 3 years of Income Tax Returns (ITR-V) with computation of income, balance sheet, and Profit & Loss statement.",
      "For Agricultural Families: Submit land revenue records (Khasra/Khatauni), J-Forms, or an official Income Certificate issued by the Tahsildar / Revenue Department.",
      "Bank Account Statements: Provide 12 months savings or current account statements showing steady cash inflows.",
      "GST / Business Registration: Submit Udyam MSME certificate, Shop & Establishment Act license, or GSTR-3B filings if applicable.",
      "Important: Acceptance depends on individual bank policy. Always verify acceptable non-salaried proofs with your specific branch."
    ],
    category: "income_and_documents",
    relatedBanks: ["State Bank of India", "Punjab National Bank", "Bank of Baroda"],
    relatedSchemes: ["SBI_STUDENT_LOAN", "PNB_SARASWATI"],
    relatedDocuments: ["Income Tax Returns (ITR)", "Bank Statement (12 Months)", "Tahsildar Income Certificate"],
    sourceTitle: "IBA Model Educational Loan Scheme & SBI Credit Policy for Non-Salaried Borrowers",
    sourceUrl: "https://sbi.co.in/web/student-platform/student-loan-scheme",
    lastVerified: "2026-08-20",
    verificationStatus: "verified",
    suggestedFollowUps: [
      "What if co-applicant has not filed ITR?",
      "Can agricultural income be considered?",
      "What documents are needed for self-employed parent?"
    ]
  },
  {
    topicKey: "COLLATERAL_RULES_7POINT5_LAKH",
    questionCanonical: "Is collateral required for an education loan?",
    questionAliases: [
      "what is collateral",
      "do i need collateral",
      "no collateral loan",
      "property girvi rakhni padegi kya",
      "collateral requirement up to 7.5 lakh",
      "zero collateral threshold",
      "કોલેટરલ શું છે",
      "જમાનત કી પ્રયોજન"
    ],
    answerSummary: "Under RBI regulations and the Central Government CGFSEL scheme, education loans up to INR 7.5 Lakhs are 100% COLLATERAL-FREE with zero third-party guarantee requirement.",
    detailedPoints: [
      "Up to INR 4 Lakhs: Zero collateral, zero third-party guarantee, zero margin money.",
      "From INR 4 Lakhs to INR 7.5 Lakhs: Zero tangible collateral. Covered under CGFSEL credit guarantee scheme or third-party guarantee.",
      "Above INR 7.5 Lakhs: Banks are legally permitted to request tangible security (residential house, commercial property, fixed deposit) of matching value along with future income assignment.",
      "Premier Institute Exception: Schemes like SBI Scholar Scheme or Canara Vidya Turan offer collateral-free limits up to INR 20 Lakhs to INR 40 Lakhs for approved institutions.",
      "Warning: If a branch insists on property documents for a loan <= INR 7.5 Lakhs, respectfully request them to review RBI Master Direction Priority Sector Lending norms."
    ],
    category: "collateral_and_security",
    relatedBanks: ["State Bank of India", "Canara Bank", "Bank of Baroda"],
    relatedSchemes: ["SBI_STUDENT_LOAN", "CANARA_VIDYA_TURAN"],
    relatedDocuments: ["Property Title Deed (if >7.5L)", "CGFSEL Declaration"],
    sourceTitle: "Reserve Bank of India Priority Sector Lending Master Direction & CGFSEL Guidelines",
    sourceUrl: "https://www.rbi.org.in",
    lastVerified: "2026-08-20",
    verificationStatus: "verified",
    suggestedFollowUps: [
      "What if I need INR 15 Lakhs for VIT Bhopal?",
      "What types of collateral are acceptable?",
      "How is property valuation done by banks?"
    ]
  },
  {
    topicKey: "MORATORIUM_PERIOD_EXPLAINED",
    questionCanonical: "What is the moratorium period and does interest accrue?",
    questionAliases: [
      "what is moratorium",
      "moratorium period meaning",
      "padhai ke time emi deni hoti hai kya",
      "does interest accrue during college",
      "simple vs compound interest in moratorium",
      "repayment holiday",
      "મોરેટોરિયમ સમયગાળો શું છે"
    ],
    answerSummary: "The moratorium period (repayment holiday) is the time during which you are not required to pay full monthly EMIs. For education loans in India, it is Course Duration + 1 Year (or 6 months after securing employment, whichever is earlier).",
    detailedPoints: [
      "Interest Accrual Reality: Interest begins accumulating from the very day the bank disburses the first semester fee to the university.",
      "Simple Interest Option: If the family chooses to pay simple interest every month during college, banks like SBI offer a 1.00% interest rate concession.",
      "Unpaid Interest Capitalization: If interest is not serviced during college, the accumulated interest is added to your principal when moratorium ends, causing post-moratorium EMIs to increase.",
      "Repayment Tenure: Repayment begins once the moratorium expires, with tenures extending up to 15 years."
    ],
    category: "repayment_and_interest",
    relatedBanks: ["State Bank of India", "Punjab National Bank", "Bank of Baroda"],
    relatedSchemes: ["SBI_STUDENT_LOAN", "BOB_BARODA_GYAN"],
    relatedDocuments: ["Moratorium Simple Interest Mandate Format"],
    sourceTitle: "Indian Banks Association Model Educational Loan Scheme (Section 6 - Repayment)",
    sourceUrl: "https://www.iba.org.in",
    lastVerified: "2026-08-20",
    verificationStatus: "verified",
    suggestedFollowUps: [
      "How much interest accumulates on INR 10 Lakhs during 4 years?",
      "What is the Central Sector Interest Subsidy (CSIS)?",
      "How is post-moratorium EMI calculated?"
    ]
  },
  {
    topicKey: "VIT_BHOPAL_CAMPUS_LOAN_PROCESS",
    questionCanonical: "How do I get an education loan for VIT Bhopal University?",
    questionAliases: [
      "vit bhopal education loan process",
      "sbi ashta branch contact",
      "vit bhopal fee structure letter for bank",
      "how to get bonafide certificate vit bhopal",
      "which bank has branch in vit bhopal",
      "vit bhopal education loan desk",
      "વિટ ભોપાલ લોન પ્રક્રિયા"
    ],
    answerSummary: "VIT Bhopal University students can apply either at their hometown bank branch or through designated nodal campus desks. The SBI Ashta Branch (Branch Code: 030018) is the primary nodal branch supporting the Kothri Kalan campus.",
    detailedPoints: [
      "Required University Documents: You must obtain the official Cost of Study Estimate Letter and Bonafide Student Certificate from the VIT Bhopal Admissions/Finance office.",
      "Hostel Inclusions: Ensure the university fee estimate specifies your exact hostel room tier (AC/Non-AC, 2/3/4/6 bedded) and annual mess charges.",
      "Where to Apply: It is recommended to apply at the branch nearest to your parents permanent residence (since parents are co-borrowers), or at the SBI Ashta nodal branch in Sehore district.",
      "Online Lead: You can apply on the Vidya Lakshmi Portal (CELFS) and submit the printed acknowledgement along with documents to the bank."
    ],
    category: "institution_vit_bhopal",
    relatedBanks: ["State Bank of India"],
    relatedSchemes: ["SBI_STUDENT_LOAN"],
    relatedDocuments: ["VIT Bhopal Bonafide Certificate", "Official Fee Structure Estimate Letter"],
    sourceTitle: "VIT Bhopal University Finance Section & SBI Bhopal Circle Guidance",
    sourceUrl: "https://vitbhopal.ac.in/fees-structure/",
    lastVerified: "2026-08-25",
    verificationStatus: "verified",
    suggestedFollowUps: [
      "What are the Category 1 to 5 tuition fees at VIT Bhopal?",
      "Can hostel and mess charges be included?",
      "What is the contact number of SBI Ashta branch?"
    ]
  },
  {
    topicKey: "PM_VIDYALAXMI_SCHEME_2024",
    questionCanonical: "What is the PM-Vidyalaxmi Scheme approved in 2024?",
    questionAliases: [
      "what is pm vidyalaxmi",
      "pm vidyalaxmi 2024 guidelines",
      "pm vidyalaxmi eligibility",
      "3 percent interest subvention pm vidyalaxmi",
      "nirf top 100 education loan",
      "પીએમ વિદ્યાલક્ષ્મી યોજના"
    ],
    answerSummary: "Approved by the Union Cabinet in November 2024, PM-Vidyalaxmi is a central sector initiative providing collateral-free, guarantor-free education loans for students admitted to the top 860 NIRF-ranked institutions in India.",
    detailedPoints: [
      "Credit Guarantee: Provides a 75% credit guarantee by NCGTC on loans up to INR 7.5 Lakhs.",
      "3% Interest Subvention: For students with gross annual family income up to INR 8 Lakhs (who are not availing any other government scholarship/subvention), the government provides 3% annual interest subsidy on loans up to INR 10 Lakhs during the moratorium period.",
      "Digital e-Voucher: Interest subvention is transferred directly through digital e-vouchers into loan accounts via Central Bank Digital Currency (CBDC) / PFMS payment gateways.",
      "Single Digital Window: Application is processed completely digitally through the dedicated PM-Vidyalaxmi portal (pmvidyalaxmi.education.gov.in)."
    ],
    category: "government_schemes",
    relatedBanks: ["All Scheduled Commercial Banks"],
    relatedSchemes: ["PM_VIDYALAXMI"],
    relatedDocuments: ["Income Certificate (Annual <= 8L)", "NIRF Admission Proof"],
    sourceTitle: "Cabinet Committee on Economic Affairs (CCEA) Press Communique & Ministry of Education Guidelines",
    sourceUrl: "https://pmvidyalaxmi.education.gov.in",
    lastVerified: "2026-09-01",
    verificationStatus: "verified",
    suggestedFollowUps: [
      "How to check if my family qualifies for 3% subvention?",
      "What is the difference between Vidya Lakshmi and PM-Vidyalaxmi?",
      "Is VIT Bhopal eligible under PM-Vidyalaxmi?"
    ]
  },
  {
    topicKey: "MARGIN_MONEY_RULES",
    questionCanonical: "What is margin money and how much do parents have to pay?",
    questionAliases: [
      "what is margin money",
      "margin requirement education loan",
      "do i have to pay down payment for education loan",
      "how much does bank fund",
      "margin money kitna lagta hai",
      "માર્જિન મની શું છે"
    ],
    answerSummary: "Margin money is the portion of total educational expenses that the student and parent must bear from their own sources. The bank finances the remaining amount.",
    detailedPoints: [
      "Up to INR 4 Lakhs (Studies in India): 0% Margin. The bank finances 100% of approved expenses.",
      "Above INR 4 Lakhs (Studies in India): Standard 5% Margin across most public sector banks.",
      "Studies Abroad: Standard 15% Margin.",
      "Scholarship Adjustment: Any scholarship, assistantship, or fee waiver granted to the student can be counted towards the family margin requirement.",
      "Disbursement Rule: The margin is typically required to be paid pro-rata across each semester before the bank issues the disbursement cheque."
    ],
    category: "fees_and_costs",
    relatedBanks: ["State Bank of India", "Punjab National Bank", "Bank of Baroda"],
    relatedSchemes: ["SBI_STUDENT_LOAN", "PNB_SARASWATI"],
    relatedDocuments: ["Receipts of self-paid initial seat acceptance fee"],
    sourceTitle: "IBA Model Educational Loan Scheme (Section 5 - Margin)",
    sourceUrl: "https://www.iba.org.in",
    lastVerified: "2026-08-20",
    verificationStatus: "verified",
    suggestedFollowUps: [
      "Can initial VIT counseling fee be counted as margin?",
      "What expenses are covered under the loan?",
      "How to calculate net out-of-pocket margin on INR 15 Lakhs?"
    ]
  },
  {
    topicKey: "STUDENT_CIBIL_SCORE_TRAP",
    questionCanonical: "Does a student need a CIBIL score to get an education loan?",
    questionAliases: [
      "cibil score for student loan",
      "student has no credit score",
      "cibil score minus 1",
      "parent cibil score requirement",
      "cibil score kharab hai to kya kare",
      "સિબિલ સ્કોર જરૂરી છે"
    ],
    answerSummary: "Full-time students are NOT required to have a prior credit history (a score of -1 or No History is standard). The credit appraisal is evaluated based on the co-borrowers (parents) CIBIL score.",
    detailedPoints: [
      "Co-Borrower CIBIL Cut-off: Public banks generally expect the parent/co-borrower to have a CIBIL score of 685 to 700 or higher.",
      "Default Traps to Avoid: Even minor unpaid credit card balances, settled consumer loans, or telecom disputes in the parents profile can trigger automated underwriting rejections.",
      "Fixing Co-Borrower Score: Before submitting formal loan applications, check the parents CIBIL report and clear any outstanding overdue notices or update credit bureau dispute rectifications.",
      "Secondary Co-Borrower: If a parents CIBIL is compromised, adding an earning family member (employed sibling or close relative) as a joint co-borrower can strengthen approval."
    ],
    category: "credit_and_eligibility",
    relatedBanks: ["State Bank of India", "Bank of Baroda", "Punjab National Bank"],
    relatedSchemes: ["SBI_STUDENT_LOAN"],
    relatedDocuments: ["Parent CIBIL Credit Information Report (CIR)"],
    sourceTitle: "TransUnion CIBIL & RBI Fair Practices Underwriting Guidelines",
    sourceUrl: "https://www.cibil.com",
    lastVerified: "2026-08-15",
    verificationStatus: "verified",
    suggestedFollowUps: [
      "What if co-borrower CIBIL score is below 650?",
      "Who can be added as a co-applicant?",
      "How fast can CIBIL disputes be rectified?"
    ]
  },
  {
    topicKey: "APPLICATION_WORKFLOW_STEPS",
    questionCanonical: "What are the 9 stages in the education loan application process?",
    questionAliases: [
      "how to apply for education loan",
      "steps in education loan approval",
      "application timeline",
      "bank kitna time lagati hai loan sanction karne me",
      "loan sanction se disbursement tak ka process",
      "લોન અરજીના તબક્કા"
    ],
    answerSummary: "The education loan process follows 9 documented stages from initial portal filing to semester-wise fee disbursement directly into the university account.",
    detailedPoints: [
      "Stage 1: Application Submission (Online via Vidya Lakshmi or direct bank portal).",
      "Stage 2: Document Submission (KYC, mark sheets, admission letter, fee estimate, income proofs).",
      "Stage 3: Initial Scrutiny & In-Principle Approval (Basic checklist and eligibility validation).",
      "Stage 4: Admission & Institutional Verification (Validation of university recognition and bonafide status).",
      "Stage 5: Financial Appraisal & Income Vetting (Evaluation of parent ITR/salary and margin capability).",
      "Stage 6: Credit & Security Vetting (CIBIL score check; title search and valuation if collateral is pledged).",
      "Stage 7: Credit Committee Decision (Formal sanction or conditional sanction letter issuance).",
      "Stage 8: Execution of Loan Agreement (Stamp paper agreements, promissory notes, and co-obligation signing).",
      "Stage 9: Disbursement (Payment issued directly to university tuition/hostel account via RTGS/NEFT)."
    ],
    category: "application_process",
    relatedBanks: ["All Scheduled Commercial Banks"],
    relatedSchemes: ["SBI_STUDENT_LOAN", "PNB_SARASWATI"],
    relatedDocuments: ["Loan Sanction Letter", "Disbursement Request Form (DRF)"],
    sourceTitle: "Citizens Charter on Educational Loans & IBA Processing Standards",
    sourceUrl: "https://www.iba.org.in",
    lastVerified: "2026-08-20",
    verificationStatus: "verified",
    suggestedFollowUps: [
      "What is the difference between sanction and disbursement?",
      "How long does the bank take to disburse after sanction?",
      "Can the bank reject after in-principle sanction?"
    ]
  }
];
