import { api } from './api';
import {
  DocumentModelItem,
  PersonalizedChecklistParams,
  PersonalizedChecklistData,
  DocumentReadinessScore,
  ApiResponse,
} from '@/types';

// Fallback seed catalog for offline and instant client-side calculation
const FALLBACK_DOCUMENTS: DocumentModelItem[] = [
  // 1. Student KYC
  {
    _id: 'doc_aadhaar',
    name: 'Student Aadhaar Card',
    category: 'student_kyc',
    description: 'Official UIDAI identity document containing 12-digit Aadhaar number with linked mobile for OTP e-KYC.',
    isRequired: true,
    applicableCondition: 'Mandatory for all students and all loan amounts.',
    issuingAuthority: 'Unique Identification Authority of India (UIDAI)',
    verificationTip: 'Ensure the mobile number linked to Aadhaar is active for Vidya Lakshmi portal e-signing.',
    source: {
      value: 'RBI KYC Master Directions',
      source: 'Reserve Bank of India',
      sourceUrl: 'https://www.rbi.org.in',
      lastVerified: '2026-08-10',
      status: 'verified',
    },
  },
  {
    _id: 'doc_pan',
    name: 'Student Permanent Account Number (PAN) Card',
    category: 'student_kyc',
    description: 'Laminated PAN card issued by the Income Tax Department bearing student name and signature.',
    isRequired: true,
    applicableCondition: 'Mandatory for credit bureau verification and banking regulations.',
    issuingAuthority: 'Income Tax Department, Government of India',
    verificationTip: 'Name on PAN must match Class 10 marksheet exactly.',
    source: {
      value: 'IBA Model Loan Scheme',
      source: 'Indian Banks Association',
      sourceUrl: 'https://sbi.co.in',
      lastVerified: '2026-08-15',
      status: 'verified',
    },
  },
  {
    _id: 'doc_photos',
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
      sourceUrl: 'https://sbi.co.in',
      lastVerified: '2026-08-20',
      status: 'verified',
    },
  },

  // 2. Academic Records
  {
    _id: 'doc_10th',
    name: 'Class 10 Marksheet and Passing Certificate',
    category: 'academic_records',
    description: 'Secondary school examination marksheet serving as official proof of age and date of birth.',
    isRequired: true,
    applicableCondition: 'Mandatory for all education loan applications.',
    issuingAuthority: 'CBSE / ICSE / State Examination Board',
    verificationTip: 'Date of birth on this marksheet is treated by banks as the primary benchmark for KYC.',
    source: {
      value: 'IBA Model Educational Loan Scheme',
      source: 'Indian Banks Association',
      sourceUrl: 'https://www.bankofbaroda.in',
      lastVerified: '2026-08-10',
      status: 'verified',
    },
  },
  {
    _id: 'doc_12th',
    name: 'Class 12 / Higher Secondary Marksheet',
    category: 'academic_records',
    description: 'Senior secondary (10+2) board examination statement of marks showing scores in Physics, Chemistry, and Mathematics.',
    isRequired: true,
    applicableCondition: 'Mandatory for undergraduate B.Tech loan applications.',
    issuingAuthority: 'CBSE / ICSE / Respective State Examination Board',
    verificationTip: 'Banks verify whether aggregate percentage meets university eligibility criteria.',
    source: {
      value: 'VIT Admissions Criteria & Bank Underwriting Norms',
      source: 'VIT Bhopal University',
      sourceUrl: 'https://vitbhopal.ac.in',
      lastVerified: '2026-08-05',
      status: 'verified',
    },
  },
  {
    _id: 'doc_degree_grad',
    name: 'Graduation Degree / Semester Marksheets (For PG)',
    category: 'academic_records',
    description: 'All semester marksheets and provisional/convocation degree certificate for postgraduate studies.',
    isRequired: false,
    applicableCondition: 'Required only for Postgraduate applicants (M.Tech, MCA, MBA).',
    issuingAuthority: 'Degree Awarding University / Autonomous College',
    verificationTip: 'Must include all previous semester grade sheets without active backlogs.',
    source: {
      value: 'Bank Credit Policy for PG Loans',
      source: 'Punjab National Bank',
      sourceUrl: 'https://www.pnbindia.in',
      lastVerified: '2026-08-12',
      status: 'verified',
    },
  },

  // 3. VIT Bhopal Admission
  {
    _id: 'doc_vit_rank',
    name: 'VITEEE / VITMEE Entrance Exam Admit Card & Rank Card',
    category: 'vit_bhopal_admission',
    description: 'Official scorecard showing VITEEE rank and candidate roll number.',
    isRequired: true,
    applicableCondition: 'Mandatory to prove admission secured through merit selection process.',
    issuingAuthority: 'VIT Admissions Office',
    verificationTip: 'Download the rank card PDF from the official VIT Admissions portal; banks check merit quotas.',
    source: {
      value: 'RBI Model Scheme Merit Admission Guidelines',
      source: 'Reserve Bank of India',
      sourceUrl: 'https://www.rbi.org.in',
      lastVerified: '2026-08-10',
      status: 'verified',
    },
  },
  {
    _id: 'doc_vit_admission_letter',
    name: 'VIT Bhopal Provisional Admission Allotment Letter',
    category: 'vit_bhopal_admission',
    description: 'Official seat allotment letter issued by VIT Bhopal stating student name, program allotted, and campus.',
    isRequired: true,
    applicableCondition: 'Mandatory proof of admission to sanctioned degree program.',
    issuingAuthority: 'Director of Admissions, VIT Bhopal University',
    verificationTip: 'Check that the student registration/application number matches all bank documents.',
    source: {
      value: 'Admissions Guidelines 2026',
      source: 'VIT Bhopal University',
      sourceUrl: 'https://vitbhopal.ac.in',
      lastVerified: '2026-08-05',
      status: 'verified',
    },
  },
  {
    _id: 'doc_vit_fee_structure',
    name: 'VIT Bhopal Official Fee Structure & Bonafide Certificate',
    category: 'vit_bhopal_admission',
    description: 'Year-wise and semester-wise breakdown of tuition, development fees, lab charges, and caution deposit signed by university authorities.',
    isRequired: true,
    applicableCondition: 'Mandatory benchmark to determine the maximum loan quantum sanctioned.',
    issuingAuthority: 'Finance & Accounts Office / Registrar, VIT Bhopal University',
    verificationTip: 'Obtain the stamped fee estimate letter directly from the VIT Bhopal Admissions / Helpdesk.',
    source: {
      value: 'Official Fee Schedule & Bank Loan Guidelines',
      source: 'VIT Bhopal University',
      sourceUrl: 'https://vitbhopal.ac.in/fees-structure/',
      lastVerified: '2026-08-15',
      status: 'verified',
    },
  },
  {
    _id: 'doc_vit_hostel',
    name: 'VIT Bhopal Hostel & Mess Fee Schedule',
    category: 'vit_bhopal_admission',
    description: 'Official room type and mess catering fee schedule (Single, Double, 3-bed, AC / Non-AC).',
    isRequired: false,
    applicableCondition: 'Required if hostel and boarding expenses are to be funded through the education loan.',
    issuingAuthority: 'Hostel Wardens Office / Student Welfare, VIT Bhopal',
    verificationTip: 'RBI Model Scheme allows 100% of hostel boarding expenses to be included in loan quantum.',
    source: {
      value: 'VIT Bhopal Hostel Rules & RBI Education Loan Norms',
      source: 'VIT Bhopal University',
      sourceUrl: 'https://vitbhopal.ac.in',
      lastVerified: '2026-08-05',
      status: 'verified',
    },
  },

  // 4. Co-Applicant KYC
  {
    _id: 'doc_coapp_kyc',
    name: 'Co-Applicant Aadhaar Card & PAN Card',
    category: 'coapplicant_kyc',
    description: 'Proof of identity and PAN for parent, legal guardian, or co-borrower.',
    isRequired: true,
    applicableCondition: 'Mandatory for all loans as parents are statutory co-borrowers.',
    issuingAuthority: 'UIDAI & Income Tax Department',
    verificationTip: 'Bank pulls CIBIL CIR score for the co-applicant using these details.',
    source: {
      value: 'RBI KYC Norms',
      source: 'Reserve Bank of India',
      sourceUrl: 'https://www.rbi.org.in',
      lastVerified: '2026-08-10',
      status: 'verified',
    },
  },
  {
    _id: 'doc_coapp_address',
    name: 'Co-Applicant Proof of Residence (Utility Bill / Passport)',
    category: 'coapplicant_kyc',
    description: 'Recent electricity bill, water bill, gas pipeline bill, or passport.',
    isRequired: true,
    applicableCondition: 'Mandatory for branch jurisdiction verification.',
    issuingAuthority: 'Municipal / Electricity Board / Passport Office',
    verificationTip: 'Utility bills must not be older than 2 months from the date of submission.',
    source: {
      value: 'RBI Customer Due Diligence',
      source: 'Reserve Bank of India',
      sourceUrl: 'https://www.rbi.org.in',
      lastVerified: '2026-08-10',
      status: 'verified',
    },
  },

  // 5. Co-Applicant Income: Salaried
  {
    _id: 'doc_salary_slips',
    name: 'Salary Slips for Last 3 Months',
    category: 'coapplicant_income_salaried',
    description: 'Official monthly payslips showing basic pay, allowances, PF, and professional tax deductions.',
    isRequired: true,
    applicableCondition: 'Mandatory for salaried co-applicants.',
    issuingAuthority: 'Employer / HR / Payroll Department',
    verificationTip: 'Must bear company seal or official digital verification signature.',
    source: {
      value: 'Bank Credit Underwriting Manuals',
      source: 'State Bank of India',
      sourceUrl: 'https://sbi.co.in',
      lastVerified: '2026-08-15',
      status: 'verified',
    },
  },
  {
    _id: 'doc_form_16',
    name: 'Form 16 / Income Tax Returns for Last 2 Years',
    category: 'coapplicant_income_salaried',
    description: 'Part A & B of Form 16 issued by employer showing TDS deductions and gross salary.',
    isRequired: true,
    applicableCondition: 'Mandatory for salaried co-applicants.',
    issuingAuthority: 'Employer / Income Tax Department TRACES Portal',
    verificationTip: 'Ensure Part A carries valid digital signature from TRACES portal.',
    source: {
      value: 'IBA Underwriting Standards',
      source: 'Indian Banks Association',
      sourceUrl: 'https://sbi.co.in',
      lastVerified: '2026-08-15',
      status: 'verified',
    },
  },
  {
    _id: 'doc_bank_stmt_salaried',
    name: 'Salary Account Bank Statement for Last 6 Months',
    category: 'coapplicant_income_salaried',
    description: 'Complete stamped statement of the account where monthly salary is credited.',
    isRequired: true,
    applicableCondition: 'Mandatory for salaried co-applicants.',
    issuingAuthority: 'Co-Applicant Salary Bank',
    verificationTip: 'Must be stamped by the home branch or generated via net banking with valid digital verification.',
    source: {
      value: 'Bank Underwriting Directives',
      source: 'Bank of Baroda',
      sourceUrl: 'https://www.bankofbaroda.in',
      lastVerified: '2026-08-10',
      status: 'verified',
    },
  },

  // 6. Co-Applicant Income: Self-Employed
  {
    _id: 'doc_itr_selfemployed',
    name: 'Income Tax Returns (ITR) with Computation for Last 2 to 3 Years',
    category: 'coapplicant_income_selfemployed',
    description: 'ITR-V acknowledgment with computation of income prepared by Chartered Accountant.',
    isRequired: true,
    applicableCondition: 'Mandatory for self-employed / business co-applicants.',
    issuingAuthority: 'Income Tax Department & Certified CA',
    verificationTip: 'Ensure ITR-V shows e-verification confirmation; unverified receipts are rejected.',
    source: {
      value: 'Credit Policy for Non-Salaried Borrowers',
      source: 'Punjab National Bank',
      sourceUrl: 'https://www.pnbindia.in',
      lastVerified: '2026-08-12',
      status: 'verified',
    },
  },
  {
    _id: 'doc_business_proof',
    name: 'Business Proof & GST Registration Certificate',
    category: 'coapplicant_income_selfemployed',
    description: 'GST registration certificate, Shop & Establishment license, or Udyam MSME certificate.',
    isRequired: true,
    applicableCondition: 'Mandatory for business owners and trade professionals.',
    issuingAuthority: 'GST Department / Ministry of MSME / Municipal Corporation',
    verificationTip: 'Verify that business address matches current office and GST status is active.',
    source: {
      value: 'MSME & Commercial Lending Norms',
      source: 'Indian Banks Association',
      sourceUrl: 'https://sbi.co.in',
      lastVerified: '2026-08-15',
      status: 'verified',
    },
  },
  {
    _id: 'doc_bank_stmt_business',
    name: 'Current / Operative Business Bank Statement for Last 12 Months',
    category: 'coapplicant_income_selfemployed',
    description: 'Bank account statement showing business turnover and cash flow continuity.',
    isRequired: true,
    applicableCondition: 'Mandatory for business co-applicants.',
    issuingAuthority: 'Co-Applicant Operating Bank',
    verificationTip: 'Turnover shown in bank statement must align with sales reported in GST filings.',
    source: {
      value: 'Bank Credit Policy Guidelines',
      source: 'State Bank of India',
      sourceUrl: 'https://sbi.co.in',
      lastVerified: '2026-08-15',
      status: 'verified',
    },
  },

  // 7. Collateral Property
  {
    _id: 'doc_title_deed',
    name: 'Original Registered Title Deed & Prior Parent Deeds (Chain of 13–30 Yrs)',
    category: 'collateral_property',
    description: 'Original registered sale deed, gift deed, or partition deed establishing ownership.',
    isRequired: true,
    applicableCondition: 'Mandatory only if loan quantum exceeds ₹7.5 Lakhs and property is pledged.',
    issuingAuthority: 'Office of Sub-Registrar / Land Revenue Department',
    verificationTip: 'Original deeds are held by the bank in safe custody; never submit without receiving written receipt.',
    source: {
      value: 'RBI Collateral Directives & SARFAESI Act',
      source: 'Reserve Bank of India',
      sourceUrl: 'https://www.rbi.org.in',
      lastVerified: '2026-08-10',
      status: 'verified',
    },
  },
  {
    _id: 'doc_encumbrance',
    name: 'Encumbrance Certificate (EC) for Last 13 to 30 Years',
    category: 'collateral_property',
    description: 'Form 15 or 16 issued by Sub-Registrar proving property is free from prior mortgages or court attachments.',
    isRequired: true,
    applicableCondition: 'Mandatory for immovable property collateral.',
    issuingAuthority: 'Registration and Stamps Department',
    verificationTip: 'Must cover the continuous timeline up to the current date of application.',
    source: {
      value: 'Bank Legal Search Manual',
      source: 'Indian Banks Association',
      sourceUrl: 'https://www.bankofbaroda.in',
      lastVerified: '2026-08-10',
      status: 'verified',
    },
  },

  // 8. Bank Specific Forms
  {
    _id: 'doc_celfs',
    name: 'Vidya Lakshmi Portal Common Educational Loan Application Form (CELFS)',
    category: 'bank_specific_forms',
    description: 'Standard application form generated upon completing submission on the Vidya Lakshmi Portal.',
    isRequired: true,
    applicableCondition: 'Mandatory when applying through Vidya Lakshmi / PM-Vidyalaxmi portal.',
    issuingAuthority: 'Vidya Lakshmi Portal / NSDL e-Governance',
    verificationTip: 'Download the finalized PDF with CELFS Application ID and print for branch submission.',
    source: {
      value: 'Vidya Lakshmi Standard Operating Procedure',
      source: 'Ministry of Education & NSDL',
      sourceUrl: 'https://www.vidyalakshmi.co.in',
      lastVerified: '2026-08-20',
      status: 'verified',
    },
  },
];

export const documentService = {
  /**
   * Fetch master document catalog with filters
   */
  fetchDocuments: async (params?: {
    category?: string;
    isRequired?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ documents: DocumentModelItem[]; total: number }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.isRequired !== undefined) queryParams.append('isRequired', String(params.isRequired));
      if (params?.search) queryParams.append('search', params.search);
      if (params?.page) queryParams.append('page', String(params.page));
      if (params?.limit) queryParams.append('limit', String(params.limit));

      const queryStr = queryParams.toString();
      const endpoint = queryStr ? `/documents?${queryStr}` : '/documents';
      const res = await api.get<DocumentModelItem[]>(endpoint);
      if (res.data && res.data.length > 0) {
        return {
          documents: res.data,
          total: res.meta?.total || res.data.length,
        };
      }
    } catch (err) {
      console.warn('Backend documents API unavailable, using local catalog:', err);
    }

    // Local filtering fallback
    let list = [...FALLBACK_DOCUMENTS];
    if (params?.category) {
      list = list.filter((d) => d.category === params.category);
    }
    if (params?.isRequired !== undefined) {
      list = list.filter((d) => d.isRequired === params.isRequired);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.issuingAuthority.toLowerCase().includes(q)
      );
    }

    return {
      documents: list,
      total: list.length,
    };
  },

  /**
   * Fetch or locally generate personalized checklist based on student loan parameters
   */
  fetchPersonalizedChecklist: async (
    params: PersonalizedChecklistParams
  ): Promise<PersonalizedChecklistData> => {
    try {
      const res = await api.post<PersonalizedChecklistData>('/documents/personalized', params);
      if (res.data && res.data.requiredDocuments) {
        return res.data;
      }
    } catch (err) {
      console.warn('Backend personalized checklist API unavailable, generating locally:', err);
    }

    // High-fidelity local partitioner
    const loanAmt = Number(params.estimatedLoanAmount) || 1200000;
    const coAppType = params.coApplicantType || 'salaried';
    const hasCollateral = params.hasCollateral;
    const isVidyaLakshmi = params.applyingThroughVidyaLakshmi;

    const requiredDocuments: DocumentModelItem[] = [];
    const optionalDocuments: DocumentModelItem[] = [];
    const notApplicableDocuments: DocumentModelItem[] = [];
    const verificationNotes: { documentName: string; tip: string; authority: string }[] = [];

    for (const doc of FALLBACK_DOCUMENTS) {
      let status: 'required' | 'optional' | 'not_applicable' = 'optional';

      if (
        doc.category === 'student_kyc' ||
        doc.category === 'academic_records' ||
        doc.category === 'vit_bhopal_admission'
      ) {
        if (doc._id === 'doc_degree_grad') {
          status = params.degreeLevel === 'Postgraduate' ? 'required' : 'not_applicable';
        } else if (doc._id === 'doc_vit_hostel') {
          status = 'optional';
        } else {
          status = 'required';
        }
      } else if (doc.category === 'coapplicant_kyc') {
        status = 'required';
      } else if (doc.category === 'coapplicant_income_salaried') {
        status = coAppType === 'salaried' ? 'required' : 'not_applicable';
      } else if (doc.category === 'coapplicant_income_selfemployed') {
        status = coAppType === 'self_employed' ? 'required' : 'not_applicable';
      } else if (doc.category === 'collateral_property') {
        if (loanAmt > 750000 && (hasCollateral || params.collateralType === 'property')) {
          status = 'required';
        } else if (loanAmt <= 750000 && !hasCollateral) {
          status = 'not_applicable';
        } else {
          status = 'optional';
        }
      } else if (doc.category === 'bank_specific_forms') {
        if (isVidyaLakshmi) {
          status = 'required';
        } else {
          status = 'optional';
        }
      }

      if (status === 'required') {
        requiredDocuments.push(doc);
        verificationNotes.push({
          documentName: doc.name,
          tip: doc.verificationTip,
          authority: doc.issuingAuthority,
        });
      } else if (status === 'optional') {
        optionalDocuments.push(doc);
      } else {
        notApplicableDocuments.push(doc);
      }
    }

    return {
      profileParameters: params,
      summary: {
        totalRequired: requiredDocuments.length,
        totalOptional: optionalDocuments.length,
        totalNotApplicable: notApplicableDocuments.length,
      },
      requiredDocuments,
      optionalDocuments,
      notApplicableDocuments,
      verificationNotes,
      disclaimer:
        'This personalized checklist is an educational guidance tool based on IBA model guidelines and VIT Bhopal admissions procedures. Final document requirements and formats are determined exclusively by the lending bank upon formal credit appraisal.',
    };
  },

  /**
   * Compute student's document readiness score
   */
  calculateReadinessScore: (
    requiredDocs: DocumentModelItem[],
    checkedDocIds: Record<string, boolean>
  ): DocumentReadinessScore => {
    const totalRequired = requiredDocs.length;
    if (totalRequired === 0) {
      return {
        totalRequired: 0,
        completedCount: 0,
        percentage: 100,
        isReady: true,
        pendingRequiredNames: [],
      };
    }

    const pendingRequiredNames: string[] = [];
    let completedCount = 0;

    for (const doc of requiredDocs) {
      if (checkedDocIds[doc._id]) {
        completedCount++;
      } else {
        pendingRequiredNames.push(doc.name);
      }
    }

    const percentage = Math.round((completedCount / totalRequired) * 100);

    return {
      totalRequired,
      completedCount,
      percentage,
      isReady: completedCount === totalRequired,
      pendingRequiredNames,
    };
  },

  /**
   * Local storage persistence for checked items
   */
  getSavedCheckedState: (): Record<string, boolean> => {
    try {
      const val = localStorage.getItem('edu4loan_checked_documents');
      if (val) {
        return JSON.parse(val);
      }
    } catch {
      // ignore
    }
    return {};
  },

  saveCheckedState: (state: Record<string, boolean>): void => {
    try {
      localStorage.setItem('edu4loan_checked_documents', JSON.stringify(state));
    } catch {
      // ignore
    }
  },

  /**
   * Export checklist to CSV file
   */
  exportChecklistToCsv: (
    checklist: PersonalizedChecklistData,
    checkedDocIds: Record<string, boolean>
  ): string => {
    const headers = [
      'Document Name',
      'Classification',
      'Readiness Status',
      'Category',
      'Issuing Authority',
      'Verification Instruction',
    ];

    const rows: string[] = [];
    rows.push(headers.join(','));

    const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;

    // Required
    for (const doc of checklist.requiredDocuments) {
      const isReady = Boolean(checkedDocIds[doc._id]);
      rows.push(
        [
          escapeCsv(doc.name),
          escapeCsv('MANDATORY REQUIRED'),
          escapeCsv(isReady ? 'READY / VERIFIED' : 'PENDING ACTION'),
          escapeCsv(doc.category),
          escapeCsv(doc.issuingAuthority),
          escapeCsv(doc.verificationTip),
        ].join(',')
      );
    }

    // Optional
    for (const doc of checklist.optionalDocuments) {
      const isReady = Boolean(checkedDocIds[doc._id]);
      rows.push(
        [
          escapeCsv(doc.name),
          escapeCsv('CONDITIONAL / OPTIONAL'),
          escapeCsv(isReady ? 'READY' : 'OPTIONAL'),
          escapeCsv(doc.category),
          escapeCsv(doc.issuingAuthority),
          escapeCsv(doc.verificationTip),
        ].join(',')
      );
    }

    // Not Applicable
    for (const doc of checklist.notApplicableDocuments) {
      rows.push(
        [
          escapeCsv(doc.name),
          escapeCsv('NOT APPLICABLE FOR YOUR PROFILE'),
          escapeCsv('EXEMPTED'),
          escapeCsv(doc.category),
          escapeCsv(doc.issuingAuthority),
          escapeCsv(doc.applicableCondition),
        ].join(',')
      );
    }

    return rows.join('\n');
  },
};
