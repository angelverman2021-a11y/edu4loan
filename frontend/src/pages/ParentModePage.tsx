import React, { useState } from 'react';
import {
  Users,
  Languages,
  CheckCircle2,
  ShieldCheck,
  Printer,
  HelpCircle,
  FileCheck2,
  Info,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useParentMode } from '@/context/ParentModeContext';
import { ParentModeLanguage } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const ParentModePage: React.FC = () => {
  const { language, setLanguage, dictionary, isParentMode, setIsParentMode } = useParentMode();

  // Preparation Tasks (12 tasks)
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: false,
    7: true,
    8: true,
    9: false,
    10: false,
    11: false,
    12: false,
  });

  const [termViewModes, setTermViewModes] = useState<Record<string, 'simple' | 'official'>>({
    collateral: 'simple',
    moratorium: 'simple',
    margin: 'simple',
    coApplicant: 'simple',
  });

  const tasksList = [
    {
      id: 1,
      title: 'Student Academic Dossier',
      desc: '10th, 12th marksheets and entrance examination score card copies.',
    },
    {
      id: 2,
      title: 'VIT Bhopal University Admission Offer',
      desc: 'Official admission seat allotment letter and registration number.',
    },
    {
      id: 3,
      title: 'Official University Fee Estimate Schedule',
      desc: 'Letterhead fee estimate signed by finance officer showing semester-wise breakdown.',
    },
    {
      id: 4,
      title: 'Student KYC Verification',
      desc: 'Student PAN Card and Aadhaar Card with updated mobile linkage.',
    },
    {
      id: 5,
      title: 'Parent / Co-Borrower KYC Documents',
      desc: 'Parent PAN Card, Aadhaar Card, and recent passport-sized photos.',
    },
    {
      id: 6,
      title: 'Proof of Permanent Residence',
      desc: 'Electricity bill, piped gas bill, or water bill under 3 months old.',
    },
    {
      id: 7,
      title: 'Income Verification Documents',
      desc: 'Past 3 years Form 16 / ITR-V with computation or Tahsildar income certificate.',
    },
    {
      id: 8,
      title: 'Past 6–12 Months Bank Statements',
      desc: 'Savings or salary bank account statements showing regular salary or business credits.',
    },
    {
      id: 9,
      title: 'Clean Credit History Verification',
      desc: 'Parent CIBIL score verified (no active non-performing assets, write-offs, or overdue card loans).',
    },
    {
      id: 10,
      title: 'Margin Money Allocation (5% for > Rs 4L)',
      desc: 'Required self-contribution verified in savings account or counseling receipt.',
    },
    {
      id: 11,
      title: 'Vidya Lakshmi / PM-Vidyalaxmi Registration',
      desc: 'Common application completed online with designated local branch selected.',
    },
    {
      id: 12,
      title: 'VIT Bhopal Direct University Beneficiary Details',
      desc: 'Official bank name, account number, and IFSC of VIT Bhopal for direct RTGS disbursement.',
    },
  ];

  const completedCount = Object.values(checkedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / tasksList.length) * 100);

  const toggleTask = (id: number) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const termKeys = Object.keys(dictionary.terms);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Top Banner & Language Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="verified">100% Parent Centric</Badge>
            <Badge variant="neutral">Jargon-Free Guidance</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-brand-700 shrink-0" />
            <span>{dictionary.labels.parentModeTitle}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            {dictionary.labels.parentModeSubtitle}
          </p>
        </div>

        {/* Language Selection Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-500">
            <Languages className="h-4 w-4 text-brand-700" />
            <span>{dictionary.labels.switchLanguage}:</span>
          </div>
          {(['en', 'hi', 'gu', 'bn'] as ParentModeLanguage[]).map((lang) => {
            const labels = {
              en: 'English',
              hi: 'हिंदी (Hindi)',
              gu: 'ગુજરાતી (Gujarati)',
              bn: 'বাংলা (Bengali)',
            };
            return (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  language === lang
                    ? 'bg-brand-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {labels[lang]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Disclaimers & Transparency Alert */}
      <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-brand-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-900">
            Parent Commitment Notice & Legal Co-Obligation:
          </p>
          <p className="text-slate-700 leading-relaxed">
            In India, education loans require a parent or legal guardian to sign as a joint co-borrower. While this makes parents legally co-responsible for repayment, central government rules guarantee that <strong>loans up to Rs 7.5 Lakhs require NO property, land, or gold collateral</strong>.
          </p>
        </div>
      </div>

      {/* PARENT PREPARATION DASHBOARD (PROGRESS BAR) */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-brand-700" />
                <span>{dictionary.labels.preparationProgress}</span>
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                {dictionary.labels.preparationNote}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-black text-brand-900">
                {completedCount} of {tasksList.length} Complete ({progressPercent}%)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                leftIcon={<Printer className="h-3.5 w-3.5" />}
              >
                Print Checklist
              </Button>
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-brand-700 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasksList.map((task) => {
              const isDone = !!checkedTasks[task.id];
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isDone
                      ? 'bg-blue-50/50 border-blue-200 text-slate-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => {}} // handled by parent onClick
                    className="mt-0.5 rounded text-brand-700 focus:ring-brand-600 h-4 w-4 shrink-0"
                  />
                  <div className="space-y-0.5">
                    <span className={`font-bold block ${isDone ? 'text-brand-900' : 'text-slate-800'}`}>
                      {task.id}. {task.title}
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-relaxed">
                      {task.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* CORE FINANCIAL CONCEPTS FOR PARENTS (MULTILINGUAL CARDS) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Key Financial Terms Explained for Parents
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch between Simple Everyday Language and Official Banking Wording to prepare for bank branch visits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {termKeys.map((key) => {
            const term = dictionary.terms[key];
            if (!term) return null;
            const currentMode = termViewModes[key] || 'simple';

            return (
              <Card key={key} className="border-slate-200 shadow-sm flex flex-col justify-between">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {term.canonicalEnglish}
                      </span>
                      <CardTitle className="text-base font-bold text-brand-950 mt-0.5">
                        {term.localizedTerm}
                      </CardTitle>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        onClick={() =>
                          setTermViewModes((prev) => ({ ...prev, [key]: 'simple' }))
                        }
                        className={`px-2.5 py-1 rounded-md transition-colors ${
                          currentMode === 'simple'
                            ? 'bg-white text-brand-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {dictionary.labels.simpleExplanation}
                      </button>
                      <button
                        onClick={() =>
                          setTermViewModes((prev) => ({ ...prev, [key]: 'official' }))
                        }
                        className={`px-2.5 py-1 rounded-md transition-colors ${
                          currentMode === 'official'
                            ? 'bg-white text-brand-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {dictionary.labels.officialWording}
                      </button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Explanation text */}
                    <div>
                      {currentMode === 'simple' ? (
                        <p className="text-slate-800 text-sm leading-relaxed font-medium">
                          {term.simpleExplanation}
                        </p>
                      ) : (
                        <div className="p-2.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] leading-relaxed border border-slate-200">
                          &ldquo;{term.officialWording}&rdquo;
                        </div>
                      )}
                    </div>

                    {/* Why this matters */}
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-950 space-y-1">
                      <span className="font-bold text-[10px] uppercase tracking-wider block text-brand-900">
                        {dictionary.labels.whyThisMatters}:
                      </span>
                      <p className="text-slate-700 leading-relaxed">{term.whyThisMatters}</p>
                    </div>
                  </div>

                  {/* Practical Tip */}
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-[11px] flex items-start gap-2 mt-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Practical Advice: </span>
                      <span>{term.practicalTip}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Section 80E Tax Deduction Explainer for Parents */}
      <Card className="border-slate-200 shadow-sm bg-gradient-to-r from-blue-50/50 to-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-700" />
            <span>Parent Tax Benefit: Section 80E of Income Tax Act</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2 text-xs text-slate-700 leading-relaxed">
          <p>
            If parents repay the loan interest on behalf of their child, the <strong>entire interest component paid during the financial year is 100% tax-deductible</strong> under Section 80E from their taxable income.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <span className="font-bold text-brand-900 block">No Upper Ceiling</span>
              <span className="text-[11px] text-slate-500">Unlike home loans, there is no maximum monetary limit on the interest deductible.</span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <span className="font-bold text-brand-900 block">8 Consecutive Years</span>
              <span className="text-[11px] text-slate-500">Tax deduction is claimable for up to 8 continuous assessment years starting from the first repayment year.</span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <span className="font-bold text-brand-900 block">Parent Must Pay Directly</span>
              <span className="text-[11px] text-slate-500">The deduction is allowable only to the individual out of whose taxable income the interest was remitted.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
