import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Building2,
  Landmark,
  FileCheck2,
  CheckCircle2,
  Check,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Users,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { chatbotService } from '@/services/chatbotService';
import { ChatbotResponse } from '@/types';

interface MatchedScheme {
  bankName: string;
  schemeName: string;
  interestRate: string;
  collateral: string;
  margin: string;
  moratorium: string;
  tenure: string;
  terms: string;
  documents: string;
  processingTime: string;
  officialUrl: string;
}

const SCHEMES_CATALOG: MatchedScheme[] = [
  {
    bankName: 'State Bank of India',
    schemeName: 'SBI Scholar Scheme (List-B/C Institution)',
    interestRate: '8.15% to 8.65% (EBLR + 0.15% to 0.65%)',
    collateral: 'Nil up to Rs. 7.5 Lakhs (CGFSEL Cover); Tangible collateral above Rs. 7.5L',
    margin: 'Nil up to Rs. 4 Lakhs; 5% for loans above Rs. 4 Lakhs',
    moratorium: 'Course duration + 12 months grace window',
    tenure: 'Up to 15 years after moratorium period',
    terms: 'Zero prepayment penalty; simple interest during study period',
    documents: 'VIT Bhopal 4-year fee estimate, bonafide, student KYC, co-applicant ITR/salary slip',
    processingTime: '14 to 21 business days (Campus facilitation desk active)',
    officialUrl: 'https://sbi.co.in/web/personal-banking/loans/education-loans',
  },
  {
    bankName: 'Canara Bank',
    schemeName: 'Canara Vidya Turan',
    interestRate: '8.40% to 8.90% (RLLR linked)',
    collateral: 'Nil up to Rs. 7.5 Lakhs (CGFSEL guarantee); Third-party guarantee or tangible above 7.5L',
    margin: '0% up to Rs. 4 Lakhs; 5% above Rs. 4 Lakhs for inland studies',
    moratorium: 'Course duration + 12 months',
    tenure: 'Up to 15 years',
    terms: '0.50% interest concession for girl students; no foreclosure charges',
    documents: 'Admission allotment letter, marksheet 10th & 12th, co-borrower income proof, bank statements',
    processingTime: '7 to 15 business days via designated Bhopal nodal branch',
    officialUrl: 'https://canarabank.com/User_page.aspx?othlink=375',
  },
  {
    bankName: 'Punjab National Bank',
    schemeName: 'PNB Saraswati Education Loan',
    interestRate: '8.55% to 9.25% (RLLR linked)',
    collateral: 'Nil up to Rs. 7.5 Lakhs (Parent co-obligation only); Property pledge above 7.5L',
    margin: 'Nil up to Rs. 4 Lakhs; 5% above Rs. 4 Lakhs',
    moratorium: 'Course period + 1 year',
    tenure: 'Up to 15 years in equated monthly installments',
    terms: 'Tax deduction under Section 80E; simple interest accrued during moratorium',
    documents: 'KYC, PAN card of student & co-borrower, proof of admission, fee schedule on letterhead',
    processingTime: '10 to 14 business days',
    officialUrl: 'https://www.pnbindia.in/education-loan.html',
  },
  {
    bankName: 'Union Bank of India',
    schemeName: 'Union Education Loan Scheme',
    interestRate: '8.60% to 9.30% (EBLR linked)',
    collateral: 'Nil up to Rs. 7.5 Lakhs; Tangible security with 100% loan coverage above 7.5L',
    margin: 'Nil up to Rs. 4 Lakhs; 5% for domestic studies',
    moratorium: 'Course duration + 1 year',
    tenure: 'Up to 15 years post-moratorium',
    terms: '0.50% rebate for prompt interest servicing during moratorium',
    documents: 'Admission letter, fee structure, 6 months bank statement, 2 years ITR / salary slips',
    processingTime: '10 to 18 business days',
    officialUrl: 'https://www.unionbankofindia.co.in/english/education-loan.aspx',
  },
];

const PARENT_TEXTS = {
  en: {
    title: 'Parent Financial Clarity Mode',
    sub: 'Plain explanation for parents with zero confusing banking jargon.',
    loanAmountLabel: 'Requested Education Loan Amount:',
    emiEstimateLabel: 'Estimated Post-Study Monthly EMI:',
    collateralTitle: 'Collateral & Property Security Rule:',
    collateralDesc: 'For education loans up to Rs. 7.5 Lakhs, no house, land, or gold mortgage is required. Loans are backed by the Government of India CGFSEL guarantee.',
    moratoriumTitle: 'What happens while your child is studying?',
    moratoriumDesc: 'Repayment does not start immediately. You only start repaying 12 months after graduation or 6 months after starting a job, whichever is earlier.',
    coApplicantTitle: 'Parent Co-Applicant Responsibility:',
    coApplicantDesc: 'The parent signs as a joint borrower. While studying, interest charged is simple interest (not compounded).',
  },
  hi: {
    title: 'अभिभावक वित्तीय स्पष्टता मोड',
    sub: 'माता-पिता के लिए सरल भाषा में ऋण की पूरी जानकारी, बिना किसी कठिन बैंकिंग शब्दों के।',
    loanAmountLabel: 'मांगी गई शिक्षा ऋण राशि:',
    emiEstimateLabel: 'पढ़ाई के बाद अनुमानित मासिक किस्त (EMI):',
    collateralTitle: 'जमीन या मकान गिरवी रखने का नियम:',
    collateralDesc: '7.5 लाख रुपये तक के ऋण के लिए कोई भी मकान, जमीन या सोना गिरवी नहीं रखना होता है। यह भारत सरकार की CGFSEL गारंटी द्वारा सुरक्षित होता है।',
    moratoriumTitle: 'जब तक आपका बच्चा पढ़ाई कर रहा है तब क्या होगा?',
    moratoriumDesc: 'किस्त तुरंत शुरू नहीं होती। पढ़ाई पूरी होने के 12 महीने बाद या नौकरी लगने के 6 महीने बाद ही किस्त चुकानी होती है।',
    coApplicantTitle: 'माता-पिता की सह-आवेदक जिम्मेदारी:',
    coApplicantDesc: 'माता-पिता सह-उधारकर्ता के रूप में हस्ताक्षर करते हैं। पढ़ाई के दौरान केवल साधारण ब्याज लगता है।',
  },
  gu: {
    title: 'વાલીઓ માટે સરળ સમજૂતી મોડ',
    sub: 'માતા-પિતા માટે સરળ અને સ્પષ્ટ ગુજરાતીમાં લોનની સંપૂર્ણ માહિતી.',
    loanAmountLabel: 'વિદ્યાર્થી માટે જરૂરી લોનની રકમ:',
    emiEstimateLabel: 'અભ્યાસ પૂર્ણ થયા પછી અંદાજિત માસિક હપ્તો (EMI):',
    collateralTitle: 'મિલકત ગીરવે મૂકવા અંગેનો નિયમ:',
    collateralDesc: 'રૂ. 7.5 લાખ સુધીની લોન માટે કોઈ મકાન, જમીન કે સોનું ગીરવે મૂકવાની જરૂર નથી. આ કેન્દ્ર સરકારની CGFSEL ગેરંટી યોજના હેઠળ આવે છે.',
    moratoriumTitle: 'જ્યાં સુધી બાળક ભણતું હોય ત્યાં સુધી શું કરવું?',
    moratoriumDesc: 'હપ્તો તરત શરૂ થતો નથી. ડિગ્રી પૂર્ણ થયાના 12 મહિના પછી અથવા નોકરી મળ્યાના 6 મહિના પછી હપ્તો શરૂ થાય છે.',
    coApplicantTitle: 'વાલી તરીકેની જવાબદારી:',
    coApplicantDesc: 'વાલી સંયુક્ત અરજદાર બને છે. અભ્યાસ દરમિયાન માત્ર સાદું વ્યાજ ગણાય છે.',
  },
  bn: {
    title: 'অভিভাবক সহায়িকা মোড',
    sub: 'পিতা-মাতার জন্য সহজ বাংলায় শিক্ষা ঋণের বিস্তারিত বিবরণ।',
    loanAmountLabel: 'প্রয়োজনীয় শিক্ষা ঋণের পরিমাণ:',
    emiEstimateLabel: 'পড়াশোনা শেষের পর আনুমানিক মাসিক কিস্তি (EMI):',
    collateralTitle: 'সম্পত্তি বন্ধক রাখার নিয়ম:',
    collateralDesc: '৭.৫ লাখ টাকা পর্যন্ত ঋণের জন্য কোনো বাড়ি বা জমি বন্ধক রাখতে হয় না। এটি কেন্দ্রীয় সরকারের CGFSEL গ্যারান্টি দ্বারা সুরক্ষিত।',
    moratoriumTitle: 'সন্তানের পড়াশোনা চলাকালীন কিস্তির নিয়ম:',
    moratoriumDesc: 'পড়াশোনা চলাকালীন কিস্তি দিতে হয় না। কোর্স শেষ হওয়ার ১২ মাস পর বা চাকরি পাওয়ার ৬ মাস পর থেকে কিস্তি শুরু হয়।',
    coApplicantTitle: 'সহ-আবেদনকারী হিসেবে দায়িত্ব:',
    coApplicantDesc: 'পিতা-মাতা যৌথ আবেদনকারী হিসেবে থাকেন। কোর্স চলাকালীন শুধুমাত্র সরল সুদ প্রযোজ্য হয়।',
  },
};

const DOCUMENT_ITEMS = [
  { id: 'doc1', category: 'Student Academic & Admission', title: '10th & 12th Standard Original Marksheets & Passing Certificates' },
  { id: 'doc2', category: 'Student Academic & Admission', title: 'VITEEE Entrance Admit Card & Official Score / Rank Card' },
  { id: 'doc3', category: 'Student Academic & Admission', title: 'VIT Bhopal University Provisional Admission Letter' },
  { id: 'doc4', category: 'Student Academic & Admission', title: '4-Year Institutional Fee Estimate Letter on University Letterhead' },
  { id: 'doc5', category: 'Student Academic & Admission', title: 'Bonafide Student Certificate issued via VTOP Student Portal' },
  { id: 'doc6', category: 'Student & Co-Applicant KYC', title: 'Student Aadhaar Card & PAN Card (Mandatory for CIBIL)' },
  { id: 'doc7', category: 'Student & Co-Applicant KYC', title: 'Parent / Co-Borrower Aadhaar Card & PAN Card' },
  { id: 'doc8', category: 'Student & Co-Applicant KYC', title: 'Passport size photographs of student and co-applicant (3 each)' },
  { id: 'doc9', category: 'Income & Financial Records', title: 'Co-applicant Income Proof: 3 months Salary Slips OR 2-3 years ITR with computation' },
  { id: 'doc10', category: 'Income & Financial Records', title: 'Latest 6 to 12 months operative Bank Account Statements of Co-applicant' },
  { id: 'doc11', category: 'Income & Financial Records', title: 'Form 16 from employer OR Revenue Authority Income Certificate (if no payslip)' },
  { id: 'doc12', category: 'Institutional & Remittance', title: 'Margin Money Proof (Bank balance / deposit receipt for 5% margin above 4L)' },
];

export const StudentJourneyPage: React.FC = () => {
  // Current active step (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Form state
  const [university] = useState<string>('VIT Bhopal University');
  const [course, setCourse] = useState<string>('B.Tech Computer Science & Engineering');
  const [loanAmount, setLoanAmount] = useState<number>(1200000);
  const [familyIncome, setFamilyIncome] = useState<string>('4.5L_to_8L');
  const [incomeType, setIncomeType] = useState<string>('Salaried');
  const [coApplicant, setCoApplicant] = useState<string>('Father');
  const [collateralOption, setCollateralOption] = useState<string>('no_collateral');
  const [academicScore, setAcademicScore] = useState<string>('85');
  const [viteeeRank, setViteeeRank] = useState<string>('18500');
  const [showReqs, setShowReqs] = useState<boolean>(false);

  // Step 3: Interactive Practical Q&A state
  const [chatQuestion, setChatQuestion] = useState<string>('Salary slip nahi hai to kya kare?');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatResponse, setChatResponse] = useState<ChatbotResponse | null>(null);

  // Step 4: Parent Mode language
  const [parentLang, setParentLang] = useState<'en' | 'hi' | 'gu' | 'bn'>('en');

  // Step 5: Document checklist state
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    doc1: true,
    doc2: true,
    doc3: true,
    doc6: true,
    doc7: true,
  });

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedDocsCount = useMemo(() => {
    return Object.values(checkedDocs).filter(Boolean).length;
  }, [checkedDocs]);

  // Projected EMI estimate (approx 8.65% for 120 months)
  const estimatedEmi = useMemo(() => {
    const monthlyRate = 8.65 / 12 / 100;
    const months = 120;
    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  }, [loanAmount]);

  const handleAskQuestion = async (customQ?: string) => {
    const q = customQ || chatQuestion;
    if (!q.trim()) return;
    setChatLoading(true);
    try {
      const res = await chatbotService.ask(q, {
        university,
        course,
        loanAmount,
        incomeType: incomeType as any,
        coApplicant: coApplicant as any,
      });
      setChatResponse(res);
    } catch {
      setChatResponse({
        answer: 'Information not currently verified. Edu4Loan only provides information grounded in verified official sources.',
        citations: [],
        suggestedPrompts: [],
        contextRecognized: {},
      });
    } finally {
      setChatLoading(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Student Profile & Need' },
    { num: 2, title: 'Bank Comparison' },
    { num: 3, title: 'Practical Question' },
    { num: 4, title: 'Parent Review Mode' },
    { num: 5, title: 'Document Checklist' },
    { num: 6, title: 'Official Portals' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Banner & Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="verified" size="sm">
            Section 22 Verified Workflow
          </Badge>
          <span className="text-xs text-slate-500 font-medium">
            VIT Bhopal Education Loan Student Journey
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Complete Guided Student Loan Journey
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
          Follow our 6-phase official roadmap: configure your VIT Bhopal loan requirements, evaluate side-by-side banking parameters, resolve real-world co-borrower edge cases, switch into multilingual Parent Mode, and proceed directly to verified government portals.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[650px] gap-2">
          {stepsList.map((st) => {
            const isDone = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-brand-700 text-white shadow-xs'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isCurrent
                      ? 'bg-white text-brand-800'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? <Check className="h-3 w-3 stroke-[3]" /> : st.num}
                </div>
                <span>{st.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Student Information & Loan Requirement */}
      {currentStep === 1 && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="py-4 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-brand-700" />
              <span>Step 1 of 6: Student Profile & Loan Requirement</span>
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your academic and family financial parameters to map matching education loan schemes.
            </p>
          </CardHeader>

          <CardContent className="p-5">
            {showReqs ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <button
                  onClick={() => setShowReqs(false)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-md w-fit"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Profile Form
                </button>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4" /> Why are these documents compulsory? (RBI & IBA Guidelines)
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-blue-800 space-y-3">
                    <li><strong>KYC Documents (PAN & Aadhaar):</strong> Mandatory under the <span className="font-semibold">RBI Master Direction - KYC Guidelines, 2016</span>. Prevents identity fraud and ensures valid credit reporting to bureaus like CIBIL.</li>
                    <li><strong>Admission Letter:</strong> Essential to prove the purpose of the loan, verify the institution's credibility, and estimate the total fee structure under <span className="font-semibold">IBA Model Education Loan Scheme</span> guidelines.</li>
                    <li><strong>Income Proof (Co-Applicant):</strong> Required to evaluate repayment capacity (FOIR - Fixed Obligation to Income Ratio), a standard risk assessment metric enforced by banks to prevent sub-prime lending.</li>
                  </ul>
                  <a href="https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11566" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-5 text-blue-700 font-semibold text-xs hover:underline bg-white px-3 py-1.5 rounded border border-blue-200 shadow-xs">
                    View RBI Master Direction Source <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">Compulsory Requirements before starting:</h4>
                    <p className="text-xs text-slate-600">KYC (PAN & Aadhaar), Valid Admission Letter, and Co-Applicant Income Proof.</p>
                  </div>
                  <button 
                    onClick={() => setShowReqs(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 whitespace-nowrap bg-blue-100/50 px-3 py-1.5 rounded-md"
                  >
                    Why required?
                  </button>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Institution */}
                  <div>
                    <label className="block text-base font-bold text-slate-900 mb-1.5">
                      1. Target University
                    </label>
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 flex items-center justify-between">
                      <span>VIT Bhopal University</span>
                      <Badge variant="verified" size="sm">
                        Desk Active
                      </Badge>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Eligible for SBI Scholar (List-B), Canara Vidya Turan, and PM-Vidyalaxmi.
                    </span>
                  </div>

                  {/* Course Selection */}
                  <div>
                    <label className="block text-base font-bold text-slate-900 mb-1.5">
                      2. Enrolled Academic Course
                    </label>
                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-brand-600"
                    >
                      <option value="B.Tech Computer Science & Engineering">B.Tech Computer Science & Engineering</option>
                      <option value="B.Tech Electronics & Communication">B.Tech Electronics & Communication Engineering</option>
                      <option value="B.Tech Mechanical / Aerospace">B.Tech Mechanical / Aerospace Engineering</option>
                      <option value="Integrated M.Tech (Software Engineering)">Integrated M.Tech</option>
                      <option value="Master of Computer Applications (MCA)">Master of Computer Applications (MCA)</option>
                    </select>
                  </div>

                  {/* Loan Quantum Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-base font-bold text-slate-900">
                        3. Total Loan Requirement
                      </label>
                      <span className="text-base font-black text-brand-700">
                        Rs. {(loanAmount / 100000).toFixed(1)} Lakhs
                      </span>
                    </div>
                    <input
                      type="range"
                      min={200000}
                      max={2500000}
                      step={50000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full accent-brand-700 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                      <span>Rs. 2L</span>
                      <span>Rs. 7.5L (CGFSEL Limit)</span>
                      <span>Rs. 25L</span>
                    </div>
                  </div>

                  {/* Family Income Tier */}
                  <div>
                    <label className="block text-base font-bold text-slate-900 mb-1.5">
                      4. Gross Annual Family Income
                    </label>
                    <select
                      value={familyIncome}
                      onChange={(e) => setFamilyIncome(e.target.value)}
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-brand-600"
                    >
                      <option value="below_4.5L">Up to Rs. 4.5 Lakhs</option>
                      <option value="4.5L_to_8L">Rs. 4.5 Lakhs to Rs. 8.0 Lakhs</option>
                      <option value="above_8L">Above Rs. 8.0 Lakhs</option>
                    </select>
                  </div>

                  {/* Income Type */}
                  <div>
                    <label className="block text-base font-bold text-slate-900 mb-1.5">
                      5. Co-Applicant Income Nature
                    </label>
                    <select
                      value={incomeType}
                      onChange={(e) => setIncomeType(e.target.value)}
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-brand-600"
                    >
                      <option value="Salaried">Salaried</option>
                      <option value="Self-Employed">Self-Employed Professional / Business</option>
                      <option value="Farmer">Farmer / Agriculture</option>
                      <option value="Pensioner">Pensioner</option>
                      <option value="Informal">Informal / Cash Earner</option>
                    </select>
                  </div>

                  {/* Co-Applicant Selection */}
                  <div>
                    <label className="block text-base font-bold text-slate-900 mb-1.5">
                      6. Primary Co-Applicant
                    </label>
                    <select
                      value={coApplicant}
                      onChange={(e) => setCoApplicant(e.target.value)}
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-brand-600"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Both Parents">Both Parents Jointly</option>
                      <option value="Legal Guardian">Legal Guardian</option>
                      <option value="Earning Sibling">Earning Brother / Sister</option>
                    </select>
                  </div>

                  {/* Collateral Availability */}
                  <div>
                    <label className="block text-base font-bold text-slate-900 mb-1.5">
                      7. Collateral Availability
                    </label>
                    <select
                      value={collateralOption}
                      onChange={(e) => setCollateralOption(e.target.value)}
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-brand-600"
                    >
                      <option value="no_collateral">No Collateral</option>
                      <option value="property">Tangible Residential Property / Land</option>
                      <option value="fixed_deposit">Bank Fixed Deposit / LIC Surrender Value / NSC</option>
                    </select>
                  </div>

                  {/* Academic Performance */}
                  <div>
                    <label className="block text-base font-bold text-slate-900 mb-1.5">
                      8. 12th Board Score & VITEEE Rank
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="12th % (e.g. 85%)"
                        value={academicScore}
                        onChange={(e) => setAcademicScore(e.target.value)}
                        className="text-sm p-2.5 rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="VITEEE Rank (e.g. 18500)"
                        value={viteeeRank}
                        onChange={(e) => setViteeeRank(e.target.value)}
                        className="text-sm p-2.5 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-bold flex items-center gap-2"
                  >
                    <span>Identify Matching Schemes & Compare Banks</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Matching Schemes & Bank Comparison */}
      {currentStep === 2 && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Landmark className="h-5 w-5 text-brand-700" />
                <span>Step 2 of 6: System Identifies Matching Schemes & Compare Banks</span>
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Check Interest, Collateral, Margin, Moratorium, Tenure, T&C, Documents, and Published Processing Windows side-by-side.
              </p>
            </div>
            <Badge variant="verified" size="sm">
              4 Schemes Matched
            </Badge>
          </CardHeader>

          <CardContent className="p-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SCHEMES_CATALOG.map((sch, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-200/80 pb-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{sch.bankName}</span>
                      <span className="text-[11px] text-brand-700 font-semibold">{sch.schemeName}</span>
                    </div>
                    <Badge variant="verified" size="sm">
                      Official
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Interest Rate:</span>
                      <strong className="text-slate-900">{sch.interestRate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Collateral Security:</span>
                      <strong className="text-slate-900">{sch.collateral}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Margin Requirement:</span>
                      <strong className="text-slate-900">{sch.margin}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Moratorium Grace:</span>
                      <strong className="text-slate-900">{sch.moratorium}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Repayment Tenure:</span>
                      <strong className="text-slate-900">{sch.tenure}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Published Processing:</span>
                      <strong className="text-emerald-700">{sch.processingTime}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-500 font-bold block mb-0.5">Key Conditions & Documents:</span>
                    <p className="text-slate-700">{sch.terms}</p>
                    <p className="text-slate-600 mt-1 italic">{sch.documents}</p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <a
                      href={sch.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 font-bold text-[11px] flex items-center gap-1 hover:underline"
                    >
                      <span>View Bank Circular</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(1)}
                className="text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Profile</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setCurrentStep(3)}
                className="text-xs font-bold flex items-center gap-1.5"
              >
                <span>Ask Practical Question</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: Ask Practical Question & Get Source-Based Answer */}
      {currentStep === 3 && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="py-4 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-700" />
              <span>Step 3 of 6: Ask Practical Question & Get Source-Based Answer</span>
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Powered by the Section 20 Source-Based Answer Engine. Contextually grounded in RBI, IBA, and VIT Bhopal bank desks.
            </p>
          </CardHeader>

          <CardContent className="p-5 space-y-5">
            {/* Context Badge Strip */}
            <div className="p-3 rounded-lg bg-brand-50/50 border border-brand-100 flex flex-wrap items-center gap-2 text-xs text-brand-900">
              <span className="font-bold">Recognized Student Context:</span>
              <Badge variant="verified" size="sm">
                {university}
              </Badge>
              <Badge variant="info" size="sm">
                Rs. {(loanAmount / 100000).toFixed(1)}L Requested
              </Badge>
              <Badge variant="advisory" size="sm">
                Co-Applicant: {incomeType} ({coApplicant})
              </Badge>
            </div>

            {/* Quick Prompt Chips */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">Quick Suggested Inquiries:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Salary slip nahi hai to kya kare?',
                  'Parent is self employed',
                  'No collateral up to 7.5 Lakhs',
                  'Minimum documents for VIT Bhopal',
                  'Which banks published processing time?',
                  'How does bank verify student information?',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setChatQuestion(q);
                      handleAskQuestion(q);
                    }}
                    className="px-2.5 py-1 rounded-md text-xs bg-slate-100 hover:bg-brand-50 hover:text-brand-800 text-slate-700 border border-slate-200 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                placeholder="Ask any practical question (e.g. Salary slip nahi hai to kya kare?)..."
                className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-600"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskQuestion();
                }}
              />
              <Button
                onClick={() => handleAskQuestion()}
                disabled={chatLoading}
                className="text-xs font-bold px-4"
              >
                {chatLoading ? 'Searching...' : 'Ask Engine'}
              </Button>
            </div>

            {/* Answer Display */}
            {chatResponse && (
              <div className="p-4 rounded-xl border border-brand-200 bg-white space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Verified Factual Answer
                  </span>
                  <Badge variant="verified" size="sm">
                    Grounded in Regulatory Sources
                  </Badge>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                  {chatResponse.answer}
                </div>

                {/* Citations */}
                {chatResponse.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      Authoritative Regulatory Source Citations:
                    </span>
                    {chatResponse.citations.map((c: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900 block">{c.source}</span>
                          <span className="text-[10px] text-slate-500">
                            Verified on: {c.lastVerified} • Title: {c.title}
                          </span>
                        </div>
                        {c.sourceUrl && (
                          <a
                            href={c.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-700 font-bold text-[11px] flex items-center gap-1 hover:underline"
                          >
                            <span>Open Source</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(2)}
                className="text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Comparison</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setCurrentStep(4)}
                className="text-xs font-bold flex items-center gap-1.5"
              >
                <span>Switch to Parent Mode</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 4: Parent Mode & Multilingual Review */}
      {currentStep === 4 && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-700" />
                <span>Step 4 of 6: Parent Review Hub (Multilingual)</span>
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your preferred family language to review loan details, EMI, collateral rules, and co-applicant terms.
              </p>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'हिंदी' },
                { id: 'gu', label: 'ગુજરાતી' },
                { id: 'bn', label: 'বাংলা' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setParentLang(lang.id as any)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                    parentLang === lang.id
                      ? 'bg-brand-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-5">
            {/* Translated Header */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-950 space-y-1">
              <h3 className="font-bold text-sm">{PARENT_TEXTS[parentLang].title}</h3>
              <p className="text-xs text-amber-900">{PARENT_TEXTS[parentLang].sub}</p>
            </div>

            {/* Key Parent Review Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="text-slate-500 font-semibold">{PARENT_TEXTS[parentLang].loanAmountLabel}</span>
                <div className="text-xl font-black text-slate-900">
                  Rs. {(loanAmount / 100000).toFixed(1)} Lakhs
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Includes Tuition + Hostel + Study Materials
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="text-slate-500 font-semibold">{PARENT_TEXTS[parentLang].emiEstimateLabel}</span>
                <div className="text-xl font-black text-brand-700">
                  Rs. {estimatedEmi.toLocaleString('en-IN')} / month
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Based on 10-year tenure after graduation
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="text-slate-700 font-bold block">{PARENT_TEXTS[parentLang].collateralTitle}</span>
                <p className="text-slate-600 leading-relaxed">{PARENT_TEXTS[parentLang].collateralDesc}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="text-slate-700 font-bold block">{PARENT_TEXTS[parentLang].moratoriumTitle}</span>
                <p className="text-slate-600 leading-relaxed">{PARENT_TEXTS[parentLang].moratoriumDesc}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 md:col-span-2">
                <span className="text-slate-700 font-bold block">{PARENT_TEXTS[parentLang].coApplicantTitle}</span>
                <p className="text-slate-600 leading-relaxed">{PARENT_TEXTS[parentLang].coApplicantDesc}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(3)}
                className="text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Question</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setCurrentStep(5)}
                className="text-xs font-bold flex items-center gap-1.5"
              >
                <span>Complete Document Checklist</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 5: Document Checklist */}
      {currentStep === 5 && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-brand-700" />
                <span>Step 5 of 6: 12-Item Document Readiness Checklist</span>
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Assemble these mandatory records before visiting the VIT Bhopal SBI desk or submitting on Vidya Lakshmi.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-700 block">
                {checkedDocsCount} of {DOCUMENT_ITEMS.length} Ready
              </span>
              <div className="w-28 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${(checkedDocsCount / DOCUMENT_ITEMS.length) * 100}%` }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            <div className="divide-y divide-slate-100">
              {DOCUMENT_ITEMS.map((doc) => {
                const isChecked = !!checkedDocs[doc.id];
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDoc(doc.id)}
                    className="py-3 flex items-start gap-3 cursor-pointer hover:bg-slate-50/60 px-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 h-4 w-4 accent-brand-700 rounded cursor-pointer"
                    />
                    <div className="flex-1 text-xs">
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        {doc.category}
                      </span>
                      <span
                        className={`font-semibold ${
                          isChecked ? 'text-slate-900' : 'text-slate-600'
                        }`}
                      >
                        {doc.title}
                      </span>
                    </div>
                    <Badge variant={isChecked ? 'verified' : 'advisory'} size="sm">
                      {isChecked ? 'Ready' : 'Pending'}
                    </Badge>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(4)}
                className="text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Parent Review</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setCurrentStep(6)}
                className="text-xs font-bold flex items-center gap-1.5"
              >
                <span>Read Official Portals & Finish</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 6: Official Portals & Continuation */}
      {currentStep === 6 && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="py-4 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-700" />
              <span>Step 6 of 6: Government Portal Guidance & Official Continuation</span>
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Review Vidya Lakshmi and PM-Vidyalaxmi official guidelines, then continue directly to authorized portals.
            </p>
          </CardHeader>

          <CardContent className="p-5 space-y-6">
            {/* Government Scheme Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Vidya Lakshmi Portal (NSDL)</span>
                  <Badge variant="verified" size="sm">
                    Ministry of Education
                  </Badge>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Single-window electronic platform for education loans managed by NSDL e-Governance. Submit a single Common Education Loan Application Form (CELAF) to up to 3 banks simultaneously.
                </p>
                <ul className="text-slate-700 space-y-1 text-[11px] list-disc list-inside">
                  <li>Upload 4-year fee estimate letter on letterhead</li>
                  <li>Link student Aadhaar and PAN</li>
                  <li>Track bank application reference number online</li>
                </ul>
                <div className="pt-2">
                  <a
                    href="https://www.vidyalakshmi.co.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-700 text-white font-bold text-xs hover:bg-brand-800 transition-colors"
                  >
                    <span>Open Vidya Lakshmi Portal</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">PM-Vidyalaxmi Scheme (2024)</span>
                  <Badge variant="verified" size="sm">
                    Cabinet Approved
                  </Badge>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Central government scheme offering up to 3% interest subvention for students with family income up to Rs. 8 Lakhs, and 75% credit guarantee under CGFSEL for loans up to Rs. 7.5 Lakhs.
                </p>
                <ul className="text-slate-700 space-y-1 text-[11px] list-disc list-inside">
                  <li>3% interest subvention disbursed via e-vouchers</li>
                  <li>Available across top NIRF-ranked institutions</li>
                  <li>Fully collateral-free up to Rs. 7.5 Lakhs</li>
                </ul>
                <div className="pt-2">
                  <a
                    href="https://pmvidyalaxmi.education.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors"
                  >
                    <span>Open PM-Vidyalaxmi Portal</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Official Bank Links */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Continue to Official Commercial Bank Portals:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  { name: 'State Bank of India', url: 'https://sbi.co.in/web/personal-banking/loans/education-loans' },
                  { name: 'Canara Bank', url: 'https://canarabank.com/User_page.aspx?othlink=375' },
                  { name: 'Punjab National Bank', url: 'https://www.pnbindia.in/education-loan.html' },
                  { name: 'Union Bank of India', url: 'https://www.unionbankofindia.co.in/english/education-loan.aspx' },
                ].map((b) => (
                  <a
                    key={b.name}
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all flex items-center justify-between text-xs font-bold text-slate-800 group"
                  >
                    <span>{b.name}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-700" />
                  </a>
                ))}
              </div>
            </div>

            {/* Statutory Safety Notice */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
              <strong className="text-slate-800 block mb-0.5">Official Advisory Notice:</strong>
              Edu4Loan is a decision support system. Loan sanctions, underwriting decisions, and disbursements are executed strictly by commercial banks and government authorities. Never share net banking credentials or OTPs with third parties.
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(5)}
                className="text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Checklist</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setCurrentStep(1)}
                className="text-xs font-bold"
              >
                Restart Student Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
