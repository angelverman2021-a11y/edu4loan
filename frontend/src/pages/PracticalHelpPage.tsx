import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  HelpCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ShieldCheck,
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  Layers,
  Sparkles,
  ArrowRight,
  FileCheck2,
  GraduationCap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { whatIfService } from '@/services/whatIfService';
import { WhatIfScenario } from '@/types';

type TabKey =
  | 'verification'
  | 'salary-slip'
  | 'min-documents'
  | 'approval-factors'
  | 'terms'
  | 'timeline'
  | 'what-if';

export const PracticalHelpPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'verification';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as TabKey;
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="verified">100% Practical Student Assistance</Badge>
          <Badge variant="neutral">VIT Bhopal Centric & RBI Aligned</Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <HelpCircle className="h-8 w-8 text-brand-700 shrink-0" />
          <span>Practical Loan Help Hub</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Factual solutions for real-world student loan challenges: institutional verification, co-borrower income alternatives, minimum documentation engines, and official terms decoders.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-2 no-scrollbar">
        <TabButton
          active={activeTab === 'verification'}
          onClick={() => handleTabChange('verification')}
          label="1. Student Verification"
          icon={<GraduationCap className="h-4 w-4" />}
        />
        <TabButton
          active={activeTab === 'salary-slip'}
          onClick={() => handleTabChange('salary-slip')}
          label="2. Salary Slip Alternatives"
          icon={<FileText className="h-4 w-4" />}
        />
        <TabButton
          active={activeTab === 'min-documents'}
          onClick={() => handleTabChange('min-documents')}
          label="3. Minimum Documents Engine"
          icon={<FileCheck2 className="h-4 w-4" />}
        />
        <TabButton
          active={activeTab === 'approval-factors'}
          onClick={() => handleTabChange('approval-factors')}
          label="4. Approval Factors"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <TabButton
          active={activeTab === 'terms'}
          onClick={() => handleTabChange('terms')}
          label="5. Terms & Conditions Decoder"
          icon={<BookOpen className="h-4 w-4" />}
        />
        <TabButton
          active={activeTab === 'timeline'}
          onClick={() => handleTabChange('timeline')}
          label="6. Application Timeline"
          icon={<Clock className="h-4 w-4" />}
        />
        <TabButton
          active={activeTab === 'what-if'}
          onClick={() => handleTabChange('what-if')}
          label="7. What-If Scenarios"
          icon={<Sparkles className="h-4 w-4" />}
        />
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'verification' && <StudentVerificationTab />}
      {activeTab === 'salary-slip' && <SalarySlipAlternativesTab />}
      {activeTab === 'min-documents' && <MinimumDocumentsTab />}
      {activeTab === 'approval-factors' && <ApprovalFactorsTab />}
      {activeTab === 'terms' && <TermsDecoderTab />}
      {activeTab === 'timeline' && <TimelineTab />}
      {activeTab === 'what-if' && <WhatIfScenariosTab />}
    </div>
  );
};

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
      active
        ? 'bg-brand-900 text-white shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

/* =========================================================================
   TAB 1: STUDENT VERIFICATION EXPLAINER (VIT BHOPAL)
   ========================================================================= */
const StudentVerificationTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
        <GraduationCap className="h-5 w-5 text-brand-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-900">
            VIT Bhopal University Institutional Verification Procedure
          </p>
          <p className="text-slate-700 leading-relaxed">
            Banks mandate official proof of admission, fee structure, and bonafide student status before sanctioning and disbursing loan tranches directly to the university account.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/80 border-b border-slate-100">
            <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">Step 1</span>
            <CardTitle className="text-base font-bold text-slate-900 mt-1">
              Fee Estimate & Structure Letter
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs text-slate-600">
            <p>
              Banks require an official fee estimate letter on university letterhead with institutional seal and authorized signature.
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
              <span className="font-semibold text-slate-800 block">Must explicitly itemize:</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Tuition fee per academic year / semester</li>
                <li>Caution deposit (refundable)</li>
                <li>Hostel & Mess accommodation charges</li>
                <li>Exam and development charges</li>
              </ul>
            </div>
            <p className="text-[11px] text-slate-500">
              Where to obtain: VIT Bhopal Finance / Accounts Office or via official portal request.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/80 border-b border-slate-100">
            <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">Step 2</span>
            <CardTitle className="text-base font-bold text-slate-900 mt-1">
              Bonafide & Admission Certificate
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs text-slate-600">
            <p>
              Confirms your active enrollment, program duration, roll number, and degree discipline (e.g. B.Tech Computer Science & Engineering).
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
              <span className="font-semibold text-slate-800 block">Required inclusions:</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Student Registration Number / Application Number</li>
                <li>Course start year and scheduled graduation year</li>
                <li>Statement of bona fide student status</li>
              </ul>
            </div>
            <p className="text-[11px] text-slate-500">
              Where to obtain: VTOP Student Portal &gt; Bonafide Certificate Request or Academic Office.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/80 border-b border-slate-100">
            <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">Step 3</span>
            <CardTitle className="text-base font-bold text-slate-900 mt-1">
              University Bank Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs text-slate-600">
            <p>
              Under RBI and bank regulations, loan proceeds for tuition and hostel are <strong>never disbursed in cash or to personal student accounts</strong>.
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
              <span className="font-semibold text-slate-800 block">Remittance Mandate:</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Bank issues DD or NEFT/RTGS directly in favor of &quot;VIT Bhopal University&quot;</li>
                <li>Official beneficiary account name, bank name, branch IFSC, and student reference note</li>
              </ul>
            </div>
            <p className="text-[11px] text-slate-500">
              Where to obtain: Official Admission Notification or Accounts Desk.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Proactive Guidance */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-700" />
            <span>Important Campus Timeline Warnings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2 text-xs text-slate-600">
          <p>
            • <strong>Request fee estimates at least 3-4 weeks prior</strong> to semester fee deadlines. Bank underwriting takes 15 to 25 business days.
          </p>
          <p>
            • <strong>Subsequent Year Disbursements:</strong> For semester 2, 3, etc., banks require previous semester grade sheets/transcripts and the updated semester demand note before releasing the next tranche.
          </p>
          <p>
            • <strong>Hostel Fee Reimbursement:</strong> If you paid hostel or admission advance fees from personal savings to meet a strict deadline, banks allow reimbursement against official university payment receipts if submitted within the stipulated retrospective window.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

/* =========================================================================
   TAB 2: SALARY SLIP ALTERNATIVES (INTERACTIVE DECISION TREE)
   ========================================================================= */
const SalarySlipAlternativesTab: React.FC = () => {
  const [hasSlip, setHasSlip] = useState<'yes' | 'no'>('no');
  const [coBorrowerType, setCoBorrowerType] = useState<
    'self-employed' | 'business' | 'agri' | 'pensioner' | 'informal'
  >('self-employed');

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-900">
            Interactive Decision Guide: Co-Borrower Income Without Salary Slips
          </p>
          <p className="text-amber-800 leading-relaxed">
            Having no formal monthly corporate salary slip is extremely common among Indian families. Commercial banks have documented alternative income assessment pathways.
          </p>
        </div>
      </div>

      {/* Interactive Toggle */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">
            Does your co-borrower (parent/guardian) receive a regular monthly salary slip?
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => setHasSlip('yes')}
              className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center ${
                hasSlip === 'yes'
                  ? 'bg-blue-50 border-brand-700 text-brand-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              YES — Salaried with monthly payslips
            </button>
            <button
              onClick={() => setHasSlip('no')}
              className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center ${
                hasSlip === 'no'
                  ? 'bg-blue-50 border-brand-700 text-brand-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              NO — Business, Agriculture, Self-Employed, or Informal
            </button>
          </div>

          {hasSlip === 'yes' ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <p className="font-bold text-slate-900">Standard Salaried Verification Checklist:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Last 3 months computerized payslips with company seal and signature</li>
                <li>Form 16 (Part A & Part B) for the latest assessment year</li>
                <li>Last 6 months salary bank account statement showing direct credit narration</li>
                <li>Official corporate employer ID card / employment certificate</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Select your co-borrower&apos;s primary occupation type:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'self-employed', label: 'Professional / CA / Doctor' },
                  { id: 'business', label: 'Trader / Small Business' },
                  { id: 'agri', label: 'Farmer / Agriculture' },
                  { id: 'pensioner', label: 'Retired / Pensioner' },
                  { id: 'informal', label: 'Informal / Cash Income' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCoBorrowerType(item.id as any)}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors text-center ${
                      coBorrowerType === item.id
                        ? 'bg-brand-900 text-white border-brand-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Alternative Documentation Plan */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Documented Alternative Verification Plan
                  </span>
                  <Badge variant="verified">Bank Verified Alternate</Badge>
                </div>

                {coBorrowerType === 'self-employed' && (
                  <div className="space-y-2 text-slate-600">
                    <p className="font-semibold text-slate-800">
                      Required for Self-Employed Professionals (Doctors, Advocates, CAs, Architects):
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Income Tax Returns (ITR-V) with computation of income for past 2–3 financial years</li>
                      <li>Audited Balance Sheet and Profit & Loss statement signed by a Chartered Accountant</li>
                      <li>Bank statements of professional current account and savings account (past 12 months)</li>
                      <li>Certificate of Practice / Professional Registration certificate / Degree</li>
                    </ul>
                  </div>
                )}

                {coBorrowerType === 'business' && (
                  <div className="space-y-2 text-slate-600">
                    <p className="font-semibold text-slate-800">
                      Required for Traders, MSME Operators, and Proprietorships:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>ITR-V with computation of income for past 2–3 assessment years</li>
                      <li>GST returns (GSTR-3B and GSTR-1) for past 12 months (or GST exemption certificate)</li>
                      <li>Udyam Aadhar / Shop & Establishment License / Trade Registration</li>
                      <li>Past 12 months operational business bank account statements</li>
                    </ul>
                  </div>
                )}

                {coBorrowerType === 'agri' && (
                  <div className="space-y-2 text-slate-600">
                    <p className="font-semibold text-slate-800">
                      Required for Agricultural Households & Farming Families:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Land revenue records (7/12 extract, 8A, Khasra/Khatauni) verifying land holding</li>
                      <li>Income certificate issued by Tahsildar / Mandal Revenue Officer (MRO) / Revenue Authority</li>
                      <li>Kisan Credit Card (KCC) passbook / 12 months agricultural bank statement</li>
                      <li>Crop sales receipts (Mandi / APMC receipts) or co-operative society records</li>
                    </ul>
                  </div>
                )}

                {coBorrowerType === 'pensioner' && (
                  <div className="space-y-2 text-slate-600">
                    <p className="font-semibold text-slate-800">
                      Required for Retired Parents / Pensioners:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Pension Payment Order (PPO) copy</li>
                      <li>Past 12 months pension credit account bank statement / passbook</li>
                      <li>Form 16 or TDS certificate issued by Pension Disbursing Authority</li>
                    </ul>
                  </div>
                )}

                {coBorrowerType === 'informal' && (
                  <div className="space-y-2 text-slate-600">
                    <p className="font-semibold text-slate-800">
                      Required for Informal or Cash Income Households:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Government Income Certificate issued by Tahsildar / SDM / District Magistrate</li>
                      <li>Notarized affidavit stating annual household income and sources</li>
                      <li>Past 12 months savings bank account passbook showing periodic deposits and transactions</li>
                      <li>Electricity bills / municipal tax receipts establishing residential vintage</li>
                      <li>Recommendation: Leverage schemes up to Rs 7.5 Lakhs covered under CGFSEL guarantee</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

/* =========================================================================
   TAB 3: MINIMUM DOCUMENTS ENGINE
   ========================================================================= */
const MinimumDocumentsTab: React.FC = () => {
  const [bank, setBank] = useState<string>('any');
  const [amount, setAmount] = useState<string>('under7_5');
  const [coBorrower, setCoBorrower] = useState<string>('salaried');

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
        <FileCheck2 className="h-5 w-5 text-brand-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-900">Minimum Documents Engine</p>
          <p className="text-slate-700 leading-relaxed">
            Select your specific loan parameters to generate the exact, categorized minimum document checklist mandated by public and private bank circulars.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Target Bank</label>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
          >
            <option value="any">Standard IBA Framework (All Banks)</option>
            <option value="sbi">State Bank of India (SBI)</option>
            <option value="bob">Bank of Baroda (BoB)</option>
            <option value="pnb">Punjab National Bank (PNB)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Loan Quantum</label>
          <select
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
          >
            <option value="under4">Up to Rs 4.0 Lakhs (No Collateral, No Margin)</option>
            <option value="under7_5">Rs 4.0L to Rs 7.5 Lakhs (CGFSEL Guarantee)</option>
            <option value="above7_5">Above Rs 7.5 Lakhs (Tangible Collateral Mandatory)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Co-Borrower Category</label>
          <select
            value={coBorrower}
            onChange={(e) => setCoBorrower(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
          >
            <option value="salaried">Salaried (Private or Public Sector)</option>
            <option value="business">Self-Employed / Business Owner</option>
            <option value="farmer">Agriculturist / Farmer</option>
            <option value="pensioner">Pensioner / Retired</option>
          </select>
        </div>
      </div>

      {/* Categorized Document Checklist Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category A: Student Documents */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100">
            <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>A. Student KYC & Academic Dossier</span>
              <Badge variant="verified">Mandatory</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs text-slate-700">
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>PAN Card of student</li>
              <li>Aadhaar Card (with updated mobile linkage)</li>
              <li>10th and 12th Standard mark sheets and passing certificates</li>
              <li>Undergraduate semester grade sheets (if applying for PG/Master&apos;s)</li>
              <li>Entrance examination score card (VITEEE / JEE / GATE)</li>
              <li>VIT Bhopal Admission Offer Letter & Seat Allotment Letter</li>
              <li>Official Fee Estimate Schedule on university letterhead</li>
              <li>2 passport-sized photographs</li>
            </ul>
          </CardContent>
        </Card>

        {/* Category B: Co-Applicant Documents */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100">
            <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>B. Co-Applicant KYC & Relationship</span>
              <Badge variant="verified">Mandatory</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs text-slate-700">
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>PAN Card of parent / legal guardian</li>
              <li>Aadhaar Card / Passport / Voter ID of co-applicant</li>
              <li>Proof of residence (Electricity bill, water bill, or ration card under 3 months old)</li>
              <li>Relationship proof (Student&apos;s 10th marksheet or birth certificate citing parent name)</li>
              <li>2 passport-sized photographs of co-applicant</li>
            </ul>
          </CardContent>
        </Card>

        {/* Category C: Income & Financial Documents */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100">
            <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>C. Co-Applicant Income Verification</span>
              <Badge variant="neutral">{coBorrower.toUpperCase()}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs text-slate-700">
            {coBorrower === 'salaried' && (
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Last 3 months computerised salary slips with company stamp</li>
                <li>Form 16 (Part A & Part B) for past 2 assessment years</li>
                <li>Last 6 months salary bank account statement</li>
              </ul>
            )}
            {coBorrower === 'business' && (
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>ITR-V and computation of income for past 2–3 assessment years</li>
                <li>CA certified Balance Sheet and Profit & Loss Statement</li>
                <li>Last 12 months business current/savings bank statements</li>
                <li>GST registration and past 12 months GSTR-3B filings</li>
              </ul>
            )}
            {coBorrower === 'farmer' && (
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Tahsildar / MRO certified Annual Income Certificate</li>
                <li>Land ownership records: 7/12 extract, 8A, Khasra/Khatauni</li>
                <li>Last 12 months agricultural bank statement or KCC passbook</li>
              </ul>
            )}
            {coBorrower === 'pensioner' && (
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Pension Payment Order (PPO) copy</li>
                <li>Past 12 months pension account passbook or bank statement</li>
                <li>Form 16 / TDS certificate issued by bank or treasury</li>
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Category D: Collateral Security Documents */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100">
            <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>D. Collateral & Security Dossier</span>
              {amount === 'above7_5' ? (
                <Badge variant="advisory">Mandatory for &gt; Rs 7.5L</Badge>
              ) : (
                <Badge variant="verified">Exempt (&le; Rs 7.5L)</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs text-slate-700">
            {amount === 'above7_5' ? (
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Registered Title Deed / Sale Deed in original</li>
                <li>Chain documents of title tracing ownership for minimum 13–30 years</li>
                <li>Non-Encumbrance Certificate (NEC) for 13 to 30 years</li>
                <li>Municipal tax receipts & paid property tax challan for current year</li>
                <li>Sanctioned building plan and layout approval map</li>
                <li>Bank-empanelled lawyer Title Search Report (TSR) - arranged by bank</li>
                <li>Bank-empanelled engineer Valuation Report - arranged by bank</li>
              </ul>
            ) : (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                <p className="font-semibold">No Tangible Collateral Required:</p>
                <p className="mt-1 text-[11px] leading-relaxed">
                  Under the IBA Model Education Loan Scheme and PM-Vidyalaxmi guidelines, loans up to Rs 7.5 Lakhs are sanctioned without collateral, secured solely by co-obligation of parents and government credit guarantee.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/* =========================================================================
   TAB 4: APPROVAL CONSIDERATION FACTORS
   ========================================================================= */
const ApprovalFactorsTab: React.FC = () => {
  const factors = [
    {
      title: '1. Co-Applicant Credit Score (CIBIL / Experian)',
      importance: 'Critical',
      description:
        'Lenders examine the credit score of the parent/co-borrower. A CIBIL score of 650+ is widely standard, with 700+ ensuring smoother processing. Clean repayment history on past loans is crucial.',
      mitigation: 'If score is low due to past delays, obtain an NOC from past lenders or add a second earning co-applicant.',
    },
    {
      title: '2. Fixed Obligation to Income Ratio (FOIR)',
      importance: 'High',
      description:
        'Banks verify whether existing monthly EMIs and living costs consume more than 50%–60% of co-applicant net income. If existing EMIs are high, co-borrower capacity is restricted.',
      mitigation: 'Pre-close small personal loans or consumer credit cards before loan appraisal.',
    },
    {
      title: '3. Accreditation & Tier of Institution (VIT Bhopal)',
      importance: 'Favorable',
      description:
        'VIT Bhopal University is UGC-recognized and part of the VIT group of institutions. Lenders view technical degrees (B.Tech, M.Tech) from accredited universities as high employability assets.',
      mitigation: 'Attach institutional UGC approval and NIRF category certificates if applying at a distant branch.',
    },
    {
      title: '4. Employability Potential of the Course',
      importance: 'Medium',
      description:
        'Lenders prioritize professional and STEM disciplines (Computer Science, Artificial Intelligence, Electronics) due to strong campus placement histories that guarantee post-study repayment.',
      mitigation: 'Provide placement statistics or past campus recruiter lists from VIT Bhopal placement office.',
    },
    {
      title: '5. Academic Continuity & Past Performance',
      importance: 'Medium',
      description:
        'Underwriters look for minimum 50%–60% marks in 10th, 12th, and entrance tests. Unexplained multi-year study gaps may trigger queries.',
      mitigation: 'Provide a genuine medical certificate or competitive exam preparation affidavit for any gap years.',
    },
    {
      title: '6. Tangible Collateral Enforceability (Above Rs 7.5L)',
      importance: 'Critical for >7.5L',
      description:
        'For amounts exceeding Rs 7.5 Lakhs, the property must possess a clean, unencumbered, marketable title without agricultural zoning restrictions.',
      mitigation: 'Ensure property tax is cleared and 30-year chain title deeds are assembled in advance.',
    },
    {
      title: '7. KYC and Residential Stability',
      importance: 'Medium',
      description:
        'Lenders require minimum 1–2 years stability at the current residential address. Frequent address hops without rental agreements cause field verification rejections.',
      mitigation: 'Provide valid registered lease agreements or electricity bills spanning multiple billing cycles.',
    },
    {
      title: '8. Margin Money Verification',
      importance: 'High for >4L',
      description:
        'For inland loans above Rs 4 Lakhs, the borrower must demonstrate capability to fund the 5% margin money from personal savings.',
      mitigation: 'Maintain the required 5% balance in the co-borrower account prior to final sanction.',
    },
    {
      title: '9. Absence of Active Default / Write-Offs',
      importance: 'Critical',
      description:
        'Any active non-performing asset (NPA), willful default, or settled credit card on the co-applicant credit report will lead to an immediate system rejection.',
      mitigation: 'Settled accounts must be converted to "Closed in Full" by paying the residual waived amount.',
    },
    {
      title: '10. Direct Disbursement Compliance',
      importance: 'Mandatory',
      description:
        'Student loans must be paid directly to the verified educational institution. Any request for direct student cash disbursement is rejected by policy.',
      mitigation: 'Always submit the official VIT Bhopal beneficiary account details upfront.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-brand-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-900">
            Why Edu4Loan Does Not Provide A Synthetic Approval Calculator:
          </p>
          <p className="text-slate-600 leading-relaxed">
            Many financial comparison websites generate deceptive &ldquo;98% Approval Chance&rdquo; percentages based on superficial inputs to harvest user data. Commercial bank sanctioning involves rigorous underwriting, field verification, and credit risk assessment. Below are the 10 factual underwriting parameters documented in bank lending manuals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {factors.map((factor, idx) => (
          <Card key={idx} className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900">
                  {factor.title}
                </CardTitle>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    factor.importance.includes('Critical')
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : factor.importance.includes('High')
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-blue-50 text-brand-800 border border-blue-200'
                  }`}
                >
                  {factor.importance}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              <p className="text-slate-600 leading-relaxed">{factor.description}</p>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                <span className="font-semibold text-brand-900">How to Address: </span>
                {factor.mitigation}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   TAB 5: TERMS & CONDITIONS DEEP-DIVE
   ========================================================================= */
const TermsDecoderTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const termsList = [
    {
      term: 'EBLR (External Benchmark Lending Rate)',
      simple:
        'The base interest rate set by banks, tied directly to an external benchmark (almost always the RBI Repo Rate). When RBI raises or cuts rates, your loan interest rate adjusts automatically.',
      whyItMatters:
        'Your EMI or tenure is not permanently fixed; it will fluctuate whenever RBI announces monetary policy adjustments.',
      official:
        'As per RBI master circular dated September 04, 2019, all new floating rate personal or retail loans shall be linked to external benchmarks (Repo Rate, 3-Month T-Bill, or 6-Month T-Bill) with fixed spread.',
    },
    {
      term: 'Spread',
      simple:
        'The extra profit and risk margin percentage that a bank adds on top of the benchmark rate. For instance, if Repo is 6.50% and Spread is 2.00%, your total rate is 8.50%.',
      whyItMatters:
        'The spread is generally locked in at sanction time, but banks can modify it if credit rating or underwriting risk changes.',
      official:
        'The spread is determined by the bank based on credit risk assessment, operating costs, and business strategy, and remains constant through the loan tenor unless credit assessment triggers review.',
    },
    {
      term: 'Moratorium Period (Repayment Holiday)',
      simple:
        'The period during your college studies plus an extra grace window (usually 6 to 12 months after graduation) during which you are not legally required to pay principal EMIs.',
      whyItMatters:
        'You do not have to worry about monthly principal repayments while attending university classes or searching for campus placement.',
      official:
        'Repayment holiday/moratorium is granted for the course duration plus 1 year, or 6 months after securing a job, whichever is earlier.',
    },
    {
      term: 'Capitalization of Interest',
      simple:
        'During college, interest keeps accruing. If you do not pay simple interest monthly during college, the unpaid interest gets added to your total loan balance at the end of the moratorium.',
      whyItMatters:
        'Your starting loan amount for EMI calculation will be higher than what was actually borrowed. Paying simple interest during college saves significant total money.',
      official:
        'Unpaid interest during the moratorium shall be capitalized and added to the principal for the purpose of computing monthly equated installments (EMIs).',
    },
    {
      term: 'Margin Money',
      simple:
        'The percentage of the total educational expenditure that must be paid from the family&apos;s own pocket. For loans up to Rs 4 Lakhs in India, margin is 0%. Above Rs 4 Lakhs, it is typically 5%.',
      whyItMatters:
        'If your four-year total fee is Rs 10 Lakhs, the bank lends Rs 9.5 Lakhs (95%) and your family must deposit Rs 50,000 (5%). Scholarships can count towards this margin.',
      official:
        'Margin requirement: Up to Rs 4.00 Lakhs - Nil; Above Rs 4.00 Lakhs for studies in India - 5%; Studies Abroad - 15%. Scholarship/assistantship may be included in margin.',
    },
    {
      term: 'Co-Applicant / Co-Obligant Mandate',
      simple:
        'Since students have no existing employment or income history while studying, banks legally require a parent or legal guardian to sign as joint borrower, making them jointly liable for repayment.',
      whyItMatters:
        'If the graduate cannot repay after college, the bank has full legal authority to recover dues from the parent&apos;s salary, savings, or assets.',
      official:
        'Parents/guardians are to be made co-obligants in all education loan accounts irrespective of the quantum of the loan.',
    },
    {
      term: 'CGFSEL Credit Guarantee',
      simple:
        'A central government scheme (Credit Guarantee Fund Scheme for Education Loans) providing guarantee coverage for loans up to Rs 7.5 Lakhs without requiring private collateral or third-party guarantors.',
      whyItMatters:
        'Banks cannot demand property or land documents for loans under Rs 7.5 Lakhs if sanctioned under this model scheme.',
      official:
        'The National Credit Guarantee Trustee Company (NCGTC) provides guarantee coverage up to 75% of the default amount for education loans up to Rs 7.50 Lakhs sanctioned without collateral.',
    },
    {
      term: 'Section 80E Income Tax Deduction',
      simple:
        'Under the Indian Income Tax Act, the entire interest amount paid on an education loan can be deducted from taxable income for up to 8 continuous years. There is no upper rupee ceiling.',
      whyItMatters:
        'Substantially lowers the net tax liability for earning parents or graduates in the 20% or 30% tax brackets.',
      official:
        'Under Section 80E of Income Tax Act 1961, deduction is available for interest paid on loan taken for higher education of self, spouse, or children for maximum 8 assessment years.',
    },
    {
      term: 'Prepayment / Foreclosure Penalty',
      simple:
        'A fee that banks used to charge if a borrower paid off their loan earlier than the scheduled tenure.',
      whyItMatters:
        'For floating rate education loans, RBI strictly prohibits banks from charging any prepayment or foreclosure fee. You can pay extra anytime for free.',
      official:
        'As per RBI guidelines, banks shall not levy foreclosure charges/pre-payment penalties on any floating rate term loans sanctioned to individual borrowers.',
    },
    {
      term: 'Direct Disbursement to University',
      simple:
        'The bank pays college tuition and hostel charges directly to the university&apos;s bank account via demand draft or NEFT/RTGS. Money is not credited to student savings accounts.',
      whyItMatters:
        'Ensures financial audit compliance and eliminates the risk of loan funds being diverted for non-educational personal spending.',
      official:
        'Disbursement of loan amount towards tuition, library, examination, and hostel fees must be made directly to the educational institution.',
    },
  ];

  const filtered = termsList.filter(
    (t) =>
      t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.simple.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search banking terms (e.g. EBLR, Moratorium, Margin Money)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-600 bg-white"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filtered.length} documented terms
        </span>
      </div>

      <div className="space-y-3">
        {filtered.map((item, idx) => {
          const isOpen = expandedIndex === idx;
          return (
            <Card key={idx} className="border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedIndex(isOpen ? null : idx)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-blue-50 text-brand-700 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.term}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {isOpen && (
                <CardContent className="p-4 pt-0 border-t border-slate-100 bg-slate-50/30 space-y-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                      Plain English Explanation:
                    </span>
                    <p className="text-slate-700 leading-relaxed">{item.simple}</p>
                  </div>

                  <div className="space-y-1 bg-blue-50/70 p-3 rounded-lg border border-blue-100">
                    <span className="font-bold text-brand-900 text-[11px] uppercase tracking-wider block">
                      Why This Matters To The Student:
                    </span>
                    <p className="text-brand-950 leading-relaxed">{item.whyItMatters}</p>
                  </div>

                  <div className="space-y-1 bg-slate-100/70 p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-600 text-[11px] uppercase tracking-wider block">
                      Official Regulatory Wording (RBI / IBA):
                    </span>
                    <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                      &ldquo;{item.official}&rdquo;
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
   TAB 6: APPLICATION PROCESS TIMELINE
   ========================================================================= */
const TimelineTab: React.FC = () => {
  const stages = [
    {
      step: 'Stage 1',
      title: 'Document Assembly & Institutional Fee Letter',
      window: 'Days 1 – 3',
      action:
        'Obtain official fee structure letter and bonafide certificate from VIT Bhopal Finance Office. Assemble student and parent KYC, academic mark sheets, and co-borrower income documents.',
      caution: 'Ensure fee breakdown explicitly lists tuition, hostel, mess, and exam charges.',
    },
    {
      step: 'Stage 2',
      title: 'Vidya Lakshmi / PM-Vidyalaxmi Portal Application',
      window: 'Day 4',
      action:
        'Register on the central government portal (Vidya Lakshmi or PM-Vidyalaxmi). Fill the Common Education Loan Application Form (CELAF) and upload digital copies of primary documents.',
      caution: 'Select up to 3 preferred banks and designate the branch nearest to your permanent residence.',
    },
    {
      step: 'Stage 3',
      title: 'Branch Assignment & Preliminary Screening',
      window: 'Days 5 – 7',
      action:
        'The portal transmits your application to the designated bank branch. Branch loan officer reviews file completeness and contacts co-borrower for an in-person meeting.',
      caution: 'Carry all original documents for physical sighting and verification by the loan officer.',
    },
    {
      step: 'Stage 4',
      title: 'Field Verification & Residential Inspection',
      window: 'Days 8 – 11',
      action:
        'Bank-appointed field agency visits permanent residence to confirm physical occupancy, local standing, and KYC veracity.',
      caution: 'Ensure co-applicant or family member is present and neighbors can verify family residence.',
    },
    {
      step: 'Stage 5',
      title: 'Credit Bureau & Underwriting Assessment',
      window: 'Days 12 – 14',
      action:
        'Bank credit team pulls CIBIL/Experian credit reports of co-applicant, analyzes income stability, FOIR, and assesses course employability.',
      caution: 'Promptly furnish clarifications if any historical credit inquiries or resolved dues exist.',
    },
    {
      step: 'Stage 6',
      title: 'Legal & Valuation Search (Only if Loan > Rs 7.5L)',
      window: 'Days 15 – 20',
      action:
        'If tangible collateral is mandated, bank-empanelled advocate performs Title Search (TSR), and bank-empanelled engineer evaluates property value.',
      caution: 'Advocate and valuation fees are payable by the applicant even if loan is subsequently rejected.',
    },
    {
      step: 'Stage 7',
      title: 'Credit Committee Sanction & Sanction Letter',
      window: 'Days 21 – 22',
      action:
        'Branch manager / credit hub formally approves the loan quantum and issues the formal Sanction Letter detailing interest rate, spread, and conditions.',
      caution: 'Read terms carefully before signing duplicate copy of sanction letter.',
    },
    {
      step: 'Stage 8',
      title: 'Execution of Loan Agreement & Documentation',
      window: 'Days 23 – 24',
      action:
        'Student and co-applicant sign the loan agreement, promissory note, and NACH / e-Mandate auto-debit forms for future EMI servicing.',
      caution: 'Stamp duty on loan agreements varies by state jurisdiction.',
    },
    {
      step: 'Stage 9',
      title: 'Direct Disbursement to VIT Bhopal University',
      window: 'Day 25',
      action:
        'Bank issues Demand Draft or initiates RTGS direct remittance to the official bank account of VIT Bhopal University. Remittance receipt provided to student.',
      caution: 'Submit bank remittance challan to VIT Bhopal Accounts Desk to secure semester fee receipt.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
        <Clock className="h-5 w-5 text-brand-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-900">
            Factual 9-Stage Education Loan Application Lifecycle
          </p>
          <p className="text-slate-700 leading-relaxed">
            Standard processing across public and private banks takes between 15 and 25 working days. Plan your application well in advance of semester payment cutoffs.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((st, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors"
          >
            <div className="flex flex-col items-center shrink-0">
              <span className="h-8 w-8 rounded-full bg-brand-900 text-white font-bold text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              {idx < stages.length - 1 && <div className="w-0.5 h-16 bg-slate-200 mt-2" />}
            </div>

            <div className="flex-1 space-y-1 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-slate-900 text-sm">{st.title}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-brand-800 border border-blue-200 self-start sm:self-auto">
                  {st.window}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{st.action}</p>
              <div className="p-2 rounded bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-900 mt-1">
                <span className="font-semibold">Key Precaution: </span>
                {st.caution}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   TAB 7: WHAT-IF SCENARIOS HUB
   ========================================================================= */
const WhatIfScenariosTab: React.FC = () => {
  const [scenarios, setScenarios] = useState<WhatIfScenario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        setLoading(true);
        const data = await whatIfService.listScenarios(category, search);
        setScenarios(data);
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, [category, search]);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-brand-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-900">
            Interactive What-If Practical Scenarios
          </p>
          <p className="text-slate-700 leading-relaxed">
            Real answers for tricky situations: gap years, active backlogs, retired parents, low CIBIL scores, and multiple education loans in a single family.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search scenarios (e.g. salary slip, backlog, gap year, CIBIL)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-600 bg-white"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-700"
        >
          <option value="all">All Categories</option>
          <option value="income_and_salary">Income & Salary</option>
          <option value="collateral_and_security">Collateral & Security</option>
          <option value="credit_history">Credit History & CIBIL</option>
          <option value="course_and_institution">Course & Institution</option>
          <option value="application_and_portal">Application & Portal</option>
          <option value="expenses_and_fees">Expenses & Fees</option>
        </select>
      </div>

      {loading && (
        <div className="space-y-3">
          <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          {scenarios.map((sc) => {
            const isOpen = expandedCode === sc.scenarioCode;
            return (
              <Card key={sc.scenarioCode} className="border-slate-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedCode(isOpen ? null : sc.scenarioCode)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {sc.category.replace(/_/g, ' ')}
                      </span>
                      {sc.officialSource && (
                        <VerifiedBadge
                          status={sc.officialSource.status || 'verified'}
                          lastVerified={sc.officialSource.lastVerified || '2026-03-01'}
                          size="sm"
                        />
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-1">{sc.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{sc.summary}</p>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <CardContent className="p-4 pt-0 border-t border-slate-100 bg-slate-50/30 space-y-4 text-xs">
                    {/* Problem Definition */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                        The Challenge / Query:
                      </span>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {sc.problemExplanation || sc.summary}
                      </p>
                    </div>

                    {/* Practical Guidance */}
                    {sc.practicalGuidance && sc.practicalGuidance.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-100 space-y-1.5">
                        <span className="font-bold text-brand-900 uppercase tracking-wider text-[10px] block">
                          Verified Banking Resolution:
                        </span>
                        <ul className="list-disc pl-5 space-y-1 text-brand-950">
                          {sc.practicalGuidance.map((guide, idx) => (
                            <li key={idx}>{guide}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Alternative Documents */}
                    {sc.relevantDocuments && sc.relevantDocuments.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                          Accepted Alternative Documents:
                        </span>
                        <ul className="list-disc pl-5 space-y-1 text-slate-600">
                          {sc.relevantDocuments.map((doc, idx) => (
                            <li key={idx}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Bank Specific Conditions */}
                    {sc.bankSpecificConditions && sc.bankSpecificConditions.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                          Bank-Specific Circular Conditions:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {sc.bankSpecificConditions.map((cond, idx) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200">
                              <span className="font-bold text-brand-900 block text-[11px]">{cond.bankName}:</span>
                              <span className="text-slate-600 text-[11px]">{cond.condition}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Official Circular Reference */}
                    {sc.officialSource && (
                      <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-[11px] flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-800">Primary Authority: </span>
                          <span>{sc.officialSource.source} — {sc.officialSource.value}</span>
                        </div>
                        {sc.officialSource.sourceUrl && (
                          <a
                            href={sc.officialSource.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-brand-700 hover:underline font-semibold"
                          >
                            <span>Circular</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
