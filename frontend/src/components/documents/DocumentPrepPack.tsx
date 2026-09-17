import React from 'react';
import {
  Printer,
  FileCheck,
  FolderArchive,
  Layers,
  CheckCircle2,
  AlertOctagon,
  Shield,
  Download,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DossierSection } from '@/types';

export const DocumentPrepPack: React.FC = () => {
  const dossierSections: DossierSection[] = [
    {
      tabNumber: 1,
      tabTitle: 'Section 1: Application Forms & Identification',
      subtitle: 'Placed on top of the physical dossier',
      colorClass: 'border-l-brand-600',
      documents: [
        {
          name: 'Vidya Lakshmi CELFS Form / Bank Loan Application Form',
          originalMandatory: true,
          copiesNeeded: 2,
          tip: 'Signed by both student and co-borrower in all designated applicant boxes.',
        },
        {
          name: 'Passport-Size Photographs (3 Sets Each)',
          originalMandatory: true,
          copiesNeeded: 3,
          tip: 'Signed on the reverse by the applicant; plain white background.',
        },
      ],
    },
    {
      tabNumber: 2,
      tabTitle: 'Section 2: Student Identity & KYC',
      subtitle: 'Primary borrower identity verification',
      colorClass: 'border-l-blue-600',
      documents: [
        {
          name: 'Student Aadhaar Card (Copy)',
          originalMandatory: false,
          copiesNeeded: 2,
          tip: 'Carry original Aadhaar card for branch officer physical sight verification (OSV).',
        },
        {
          name: 'Student PAN Card (Copy)',
          originalMandatory: false,
          copiesNeeded: 2,
          tip: 'Self-attested copy; required for PAN verification and CIBIL report generation.',
        },
      ],
    },
    {
      tabNumber: 3,
      tabTitle: 'Section 3: Academic Credentials',
      subtitle: 'Verifying educational eligibility & progression',
      colorClass: 'border-l-emerald-600',
      documents: [
        {
          name: 'Class 10 Marksheet & Passing Certificate',
          originalMandatory: false,
          copiesNeeded: 2,
          tip: 'Primary benchmark for date of birth verification. Carry original for OSV verification.',
        },
        {
          name: 'Class 12 / Higher Secondary Marksheet',
          originalMandatory: false,
          copiesNeeded: 2,
          tip: 'Proves minimum eligibility criteria for engineering / B.Tech admission.',
        },
        {
          name: 'Graduation Degree & All Semester Marksheets (For PG Students)',
          originalMandatory: false,
          copiesNeeded: 2,
          tip: 'Mandatory only for M.Tech, MCA, or MBA loan applicants.',
        },
      ],
    },
    {
      tabNumber: 4,
      tabTitle: 'Section 4: VIT Bhopal University Admission & Costs',
      subtitle: 'Institutional underwriting documentation',
      colorClass: 'border-l-purple-600',
      documents: [
        {
          name: 'Provisional Admission Allotment Letter & Rank Card',
          originalMandatory: false,
          copiesNeeded: 2,
          tip: 'Downloaded from official VIT Admissions portal; confirms merit admission.',
        },
        {
          name: 'Official Fee Structure & Bonafide Certificate',
          originalMandatory: true,
          copiesNeeded: 2,
          tip: 'Must bear official round seal of VIT Bhopal and registrar or finance officer signature.',
        },
        {
          name: 'Hostel Fee Schedule / Allotment Slip (If Applicable)',
          originalMandatory: false,
          copiesNeeded: 2,
          tip: 'Required if hostel, boarding, and mess charges are included in loan sanction.',
        },
      ],
    },
    {
      tabNumber: 5,
      tabTitle: 'Section 5: Co-Applicant KYC & Income Proof',
      subtitle: 'Financial stability & underwriting appraisal',
      colorClass: 'border-l-amber-600',
      documents: [
        {
          name: 'Co-Applicant Aadhaar Card & PAN Card',
          originalMandatory: false,
          copiesNeeded: 2,
          tip: 'Self-attested copies with active phone number linked to Aadhaar.',
        },
        {
          name: 'Salary Slips (Last 3 Mo) OR CA Audited ITR & P&L (Last 2-3 Yrs)',
          originalMandatory: true,
          copiesNeeded: 2,
          tip: 'Salaried: Employer stamped payslips. Business: CA certified balance sheet and computation.',
        },
        {
          name: 'Bank Account Statements (Last 6 to 12 Months)',
          originalMandatory: true,
          copiesNeeded: 2,
          tip: 'Must be stamped by the issuing bank branch or digitally signed e-statement.',
        },
      ],
    },
    {
      tabNumber: 6,
      tabTitle: 'Section 6: Collateral & Guarantees (If Loan > ₹7.5 Lakhs)',
      subtitle: 'Physical property or liquid security deeds',
      colorClass: 'border-l-rose-600',
      documents: [
        {
          name: 'Original Registered Title Deeds & Parent Chain (13 to 30 Yrs)',
          originalMandatory: true,
          copiesNeeded: 2,
          tip: 'Original deed is deposited with the bank after Title Search Report (TSR) approval.',
        },
        {
          name: 'Property Tax Receipts, Approved Plan & Encumbrance Certificate',
          originalMandatory: true,
          copiesNeeded: 2,
          tip: 'Proves continuous title without municipal tax arrears or court disputes.',
        },
      ],
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header & Print Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-slate-50 border border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="verified">Bank Branch Ready</Badge>
            <span className="text-slate-500 font-medium text-xs">IBA Dossier Standard</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Physical Dossier Binder Assembly Order
          </h3>
          <p className="text-slate-600 text-xs">
            Organize your documents in the exact 6-tab order preferred by bank credit appraisal officers.
          </p>
        </div>

        <Button
          onClick={handlePrint}
          className="bg-brand-700 hover:bg-brand-800 text-white shrink-0 shadow-sm flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Save PDF Prep Pack</span>
        </Button>
      </div>

      {/* Rules of Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              1. Two Duplicate Sets
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 leading-relaxed text-[11px]">
            Always prepare 2 identical spiral or clip binders. One set stays with the branch loan officer; the second set is forwarded to the bank's Central Processing Center (CPC).
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-brand-600" />
              2. OSV Physical Sight
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 leading-relaxed text-[11px]">
            Carry all originals in a separate folder. The bank officer must physically verify each photocopy against the original and affix an "Original Seen & Verified" (OSV) stamp.
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <AlertOctagon className="h-4 w-4 text-amber-600" />
              3. Never Surrender Marksheets
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 leading-relaxed text-[11px]">
            Under Indian Banks Association guidelines, banks cannot retain original Class 10/12 marksheets. Only original property title deeds are held for loans requiring collateral.
          </CardContent>
        </Card>
      </div>

      {/* Sections Breakdown */}
      <div className="space-y-4">
        {dossierSections.map((sec) => (
          <div
            key={sec.tabNumber}
            className={`border border-slate-200 rounded-xl bg-white p-5 shadow-sm border-l-4 ${sec.colorClass}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{sec.tabTitle}</h4>
                <p className="text-[11px] text-slate-500">{sec.subtitle}</p>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Tab {sec.tabNumber}
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {sec.documents.map((doc, i) => (
                <div key={i} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-800">{doc.name}</span>
                    <p className="text-[11px] text-slate-500">{doc.tip}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {doc.copiesNeeded} Copies
                    </span>
                    {doc.originalMandatory && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        Original Required
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
