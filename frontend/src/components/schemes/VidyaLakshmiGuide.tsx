import React, { useState } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
  HelpCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const VidyaLakshmiGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'celfs' | 'selection' | 'pitfalls'>('overview');

  const celfsTabs = [
    {
      tabId: 1,
      name: 'Tab 1: Basic Information',
      desc: 'Student and co-borrower identity, contact details, permanent address, and Aadhaar/PAN details.',
      mandatoryFields: ['Student Name (matches 10th marksheet)', 'Active Mobile linked to Aadhaar', 'PAN Number', 'Co-Borrower Relationship'],
      tip: 'Ensure mobile number is active to receive the Aadhaar OTP required for digital signature.',
    },
    {
      tabId: 2,
      name: 'Tab 2: Relationship with Bank',
      desc: 'Discloses existing savings/current accounts and any prior loan liabilities with financial institutions.',
      mandatoryFields: ['Existing Account Number', 'Branch IFSC Code', 'Details of Existing Loans (if any)', 'Credit Card dues'],
      tip: 'Never conceal existing personal or vehicle loans; banks cross-verify immediately via CIBIL.',
    },
    {
      tabId: 3,
      name: 'Tab 3: Course & Institution Details',
      desc: 'Specifies admission details, degree duration, university name, and merit ranking.',
      mandatoryFields: ['Select "Vellore Institute of Technology Bhopal"', 'Course: B.Tech / M.Tech / MCA', 'Duration (4 Years for B.Tech)', 'Merit / Management Quota'],
      tip: 'Select merit quota if admitted through VITEEE ranking to unlock lower interest spreads.',
    },
    {
      tabId: 4,
      name: 'Tab 4: Cost of Course & Loan Required',
      desc: 'Itemized expenditure schedule and requested loan finance broken down by academic years.',
      mandatoryFields: ['Tuition Fees (Year 1 to 4)', 'Hostel & Mess Boarding', 'Books, Equipment & Laptop', 'Own Source Margin Money'],
      tip: 'Club tuition and hostel fees into a single application so the bank sanctions a combined limit.',
    },
  ];

  const commonPitfalls = [
    {
      title: '1. Incorrect IFSC Code for Home Branch',
      impact: 'Application Routed to Wrong Regional Hub',
      solution: 'Ensure the IFSC code corresponds to the branch closest to your permanent residence or the VIT campus branch.',
    },
    {
      title: '2. Name Discrepancy on Marksheet vs Aadhaar',
      impact: 'Immediate Processing Rejection at CPC',
      solution: 'The name in CELFS must match your Class 10 marksheet letter-by-letter. If Aadhaar differs, submit a Gazette notification or affidavit.',
    },
    {
      title: '3. Unstamped Fee Structure Certificate',
      impact: 'Sanction Amount Capped or Delayed',
      solution: 'Upload the official Fee Estimate Letter on VIT Bhopal letterhead bearing the round seal and finance officer signature.',
    },
    {
      title: '4. Applying to More Than 3 Banks at Once',
      impact: 'Portal Constraint Violation',
      solution: 'Vidya Lakshmi permits a maximum of 3 concurrent bank/scheme applications. Choose 3 complementary schemes wisely.',
    },
  ];

  return (
    <div className="space-y-6 text-xs">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-800 text-white rounded-xl p-6 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-700/60 text-xs font-semibold text-brand-100 border border-brand-600/40">
            <FileText className="h-3.5 w-3.5" />
            Module 9: Official Gateway Explainer
          </div>
          <a
            href="https://www.vidyalakshmi.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-200 hover:text-white transition-colors"
          >
            <span>Visit vidyalakshmi.co.in</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Vidya Lakshmi Portal (VLP) Application Guide
        </h2>
        <p className="text-xs sm:text-sm text-brand-100/90 max-w-3xl leading-relaxed">
          The unified gateway developed by NSDL e-Governance under the Ministry of Finance and Ministry of Education. Complete your single CELFS application to apply to up to 3 banks simultaneously.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Workflow Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('celfs')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'celfs'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>CELFS Form (4 Tabs)</span>
        </button>

        <button
          onClick={() => setActiveTab('pitfalls')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'pitfalls'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Common Rejection Pitfalls</span>
        </button>
      </div>

      {/* Tab 1: Workflow Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: 1,
                title: 'Register Student Account',
                desc: 'Sign up on vidyalakshmi.co.in using an active email and mobile number linked to your Aadhaar.',
              },
              {
                step: 2,
                title: 'Fill Single CELFS Form',
                desc: 'Fill personal, academic, course, and loan requirements across the 4 standardized sections.',
              },
              {
                step: 3,
                title: 'Search & Apply (Max 3 Banks)',
                desc: 'Select up to 3 bank schemes (e.g. SBI Scholar, BoB Baroda Gyan, PNB Saraswati) matching your criteria.',
              },
              {
                step: 4,
                title: 'Track Application Status',
                desc: 'Monitor real-time stage updates from submission to branch document verification and sanction.',
              },
            ].map((s) => (
              <Card key={s.step} className="border-slate-200 shadow-sm relative">
                <CardHeader className="pb-2">
                  <div className="h-6 w-6 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center mb-1">
                    {s.step}
                  </div>
                  <CardTitle className="text-xs font-bold text-slate-900">{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-slate-600 text-[11px] leading-relaxed">
                  {s.desc}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-bold">Why Vidya Lakshmi Is Mandatory for Public Sector Banks</span>
              <p className="text-blue-900/90">
                Under Department of Financial Services (DFS) instructions, all public sector banks (SBI, BoB, PNB, Canara, etc.) route educational loan applications through Vidya Lakshmi to ensure Central Sector Interest Subsidy (CSIS) claims and credit guarantee filings are auditable by the Ministry of Education.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: CELFS Form */}
      {activeTab === 'celfs' && (
        <div className="space-y-4">
          <p className="text-slate-600">
            The Common Educational Loan Application Form (CELFS) is divided into 4 mandatory sections. Filling these accurately ensures your file proceeds straight to underwriting without back-and-forth queries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {celfsTabs.map((tab) => (
              <Card key={tab.tabId} className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2.5 bg-slate-50/60 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-bold text-slate-900">{tab.name}</CardTitle>
                    <Badge variant="neutral" size="sm">
                      Section {tab.tabId}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{tab.desc}</p>
                </CardHeader>
                <CardContent className="pt-3 space-y-3">
                  <div>
                    <span className="font-semibold text-slate-800 text-[11px] block mb-1">
                      Key Mandatory Inputs:
                    </span>
                    <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                      {tab.mandatoryFields.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2 rounded bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-[11px] flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Important:</strong> {tab.tip}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Common Pitfalls */}
      {activeTab === 'pitfalls' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonPitfalls.map((item, idx) => (
              <Card key={idx} className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-xs font-bold text-slate-900">{item.title}</CardTitle>
                    <Badge variant="advisory" size="sm">
                      Common Error
                    </Badge>
                  </div>
                  <p className="text-[11px] text-amber-800 font-medium">Impact: {item.impact}</p>
                </CardHeader>
                <CardContent className="pt-1">
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                    <span className="font-bold text-slate-900 block mb-0.5">How to Avoid:</span>
                    <span>{item.solution}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
