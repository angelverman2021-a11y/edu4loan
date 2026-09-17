import React from 'react';
import {
  GraduationCap,
  Building,
  FileCheck2,
  Calendar,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Shield,
  CreditCard,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const VitBhopalDocGuide: React.FC = () => {
  const steps = [
    {
      stepNumber: 1,
      title: 'Provisional Admission Allotment Letter & VITEEE Rank Card',
      office: 'Director of Admissions / Online Admissions Portal',
      description:
        'Download the official seat allotment letter and VITEEE rank card from the VIT admissions portal. Banks require this to prove merit-based admission, which is a statutory prerequisite for premier loan interest rates and the Central Sector Interest Subsidy (CSIS) scheme.',
      instructions: [
        'Log in to the official VIT Admissions portal with your registered application number.',
        'Download the color PDF of the Provisional Admission Letter showing allotted B.Tech branch and campus (VIT Bhopal).',
        'Download the VITEEE Rank Card showing your overall merit rank.',
      ],
      tip: 'Ensure the candidate name matches letter-by-letter with your Class 10 marksheet and Aadhaar card.',
    },
    {
      stepNumber: 2,
      title: 'Year-Wise Fee Structure & Bonafide Certificate',
      office: 'Finance & Accounts Office / Student Helpdesk, VIT Bhopal',
      description:
        'Banks cannot disburse funds based on general prospectus numbers; they mandate an official stamped fee structure certificate detailing the total expenditure over 4 years.',
      instructions: [
        'Request the "Education Loan Bonafide & Fee Estimate Letter" from the VIT Bhopal Finance Office or administrative desk.',
        'The document itemizes tuition fee category (Category 1 to 5), registration fee, caution deposit, lab charges, and exam fees for each academic year.',
        'Verify that the letter carries the official round seal of VIT Bhopal University and registrar or finance officer signature.',
      ],
      tip: 'Caution deposit (refundable) is funded by most banks, but bank disbursement policy varies.',
    },
    {
      stepNumber: 3,
      title: 'Hostel Allotment Letter & Mess Fee Schedule',
      office: 'Hostel Wardens Office / Office of Student Welfare',
      description:
        'Under RBI Model Educational Loan guidelines, 100% of hostel boarding, lodging, and mess charges are eligible for inclusion in your education loan quantum.',
      instructions: [
        'Select your preferred room type (AC/Non-AC, 2-bed, 3-bed, or 4-bed) during online hostel counseling.',
        'Download the hostel fee receipt or provisional allotment voucher.',
        'Submit this alongside your academic fee structure so the bank sanctions tuition + hostel in a single consolidated credit limit.',
      ],
      tip: 'If you switch room categories in later years, the bank will adjust annual disbursements up to the total sanctioned ceiling.',
    },
    {
      stepNumber: 4,
      title: 'Semester Tranche Disbursement & Beneficiary Payment',
      office: 'Accounts Department, VIT Bhopal & Lending Bank Branch',
      description:
        'Banks never credit education loan amounts to the student personal savings account. All payments are disbursed semester-by-semester directly to VIT Bhopal.',
      instructions: [
        'Obtain VIT Bhopal official bank account details (Account Name, Bank Name, Branch, Account Number, IFSC Code) from the Finance Office.',
        'Before every semester fee deadline, submit the semester marksheet / grade card and fee demand notice to your bank manager.',
        'The bank issues a Demand Draft (DD) payable to "VIT Bhopal University" or executes an RTGS/NEFT transfer directly to the university account.',
        'Collect the bank UTR / DD receipt and upload it to the VTOP student portal for fee reconciliation.',
      ],
      tip: 'Initiate each semester disbursement request at least 20 working days before the university fee deadline.',
    },
  ];

  return (
    <div className="space-y-6 text-xs">
      {/* Banner */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-800 text-white rounded-xl p-6 shadow-md space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-700/60 text-xs font-semibold text-brand-100 border border-brand-600/40">
          <GraduationCap className="h-3.5 w-3.5" />
          Campus Document SOP
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Securing Official VIT Bhopal University Documents
        </h2>
        <p className="text-xs sm:text-sm text-brand-100/90 max-w-3xl leading-relaxed">
          Step-by-step guidance on obtaining bonafide certificates, fee estimates, entrance rank cards, and hostel receipts required for bank underwriting.
        </p>
      </div>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {steps.map((s) => (
          <Card key={s.stepNumber} className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center">
                    {s.stepNumber}
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900">{s.title}</CardTitle>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {s.office}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <p className="text-slate-600 leading-relaxed text-xs">{s.description}</p>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Procedure:</span>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {s.instructions.map((inst, i) => (
                    <li key={i} className="leading-relaxed">
                      {inst}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded bg-blue-50/70 border border-blue-200 text-blue-900 text-[11px] flex items-start gap-2">
                <Shield className="h-3.5 w-3.5 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Advisory:</strong> {s.tip}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Critical Caution on Timelines */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <span className="font-bold">Avoid Semester Payment Deadline Penalties</span>
          <p className="text-amber-900/90">
            Public sector banks take 15 to 30 working days from application submission to final loan sanction. Students must obtain their fee structure and apply for the loan well ahead of the university semester registration deadline to prevent late fee charges or course registration holds.
          </p>
        </div>
      </div>
    </div>
  );
};
