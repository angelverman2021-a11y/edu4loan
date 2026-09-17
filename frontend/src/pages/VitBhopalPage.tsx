import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Building,
  CheckCircle2,
  ShieldAlert,
  FileText,
  Phone,
  MapPin,
  BedDouble,
  CreditCard,
  AlertTriangle,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { api } from '@/services/api';

export const VitBhopalPage: React.FC = () => {
  const [institution, setInstitution] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchInstitution = async () => {
      try {
        setLoading(true);
        const res = await api.get<any>('/institutions/vit-bhopal');
        if (isMounted) {
          setInstitution(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Failed to load institution profile, using static verified data:', err);
        if (isMounted) setLoading(false);
      }
    };
    fetchInstitution();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="verified">Institutional Specifics</Badge>
          <VerifiedBadge status="verified" lastVerified="2026-09-01" size="sm" />
          <span className="text-xs text-slate-500 font-medium">Academic Year 2026–27</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <BookOpen className="h-9 w-9 text-brand-700 shrink-0" />
          <span>VIT Bhopal Campus Education Loan Guide</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Official B.Tech tuition fee tiers, hostel and boarding estimates, campus banking helpdesks, and standard operating procedures for securing your Bonafide Fee Certificate and multi-semester loan disbursements.
        </p>
      </div>

      {/* Institutional Notice */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-brand-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">Independent Academic Decision Support</p>
          <p className="text-slate-600">
            Edu4Loan is an independent student guidance tool. All fee structures and campus helpdesk contacts are compiled from verified public brochures and university notifications. Official sanction remains subject to bank and university regulations.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Fee Structure & Bonafide Process */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tuition Fee Categories */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5">
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900">
                B.Tech Tuition Fee Tiers (Categories 1 – 5)
              </CardTitle>
              <p className="text-xs text-slate-500">
                Banks sanction educational loans based on the specific Category assigned in your VITEEE allotment letter.
              </p>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Category</th>
                    <th className="p-3">Annual Tuition</th>
                    <th className="p-3">Caution Deposit</th>
                    <th className="p-3">Total Year 1</th>
                    <th className="p-3">4-Year Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-3 font-semibold text-brand-800">Category 1</td>
                    <td className="p-3">₹1,98,000</td>
                    <td className="p-3">₹3,000 (Refundable)</td>
                    <td className="p-3 font-medium">₹2,01,000</td>
                    <td className="p-3 font-bold text-slate-900">₹7,95,000</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-3 font-semibold text-brand-800">Category 2</td>
                    <td className="p-3">₹3,07,000</td>
                    <td className="p-3">₹3,000</td>
                    <td className="p-3 font-medium">₹3,10,000</td>
                    <td className="p-3 font-bold text-slate-900">₹12,31,000</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-3 font-semibold text-brand-800">Category 3</td>
                    <td className="p-3">₹4,05,000</td>
                    <td className="p-3">₹3,000</td>
                    <td className="p-3 font-medium">₹4,08,000</td>
                    <td className="p-3 font-bold text-slate-900">₹16,23,000</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-3 font-semibold text-brand-800">Category 4</td>
                    <td className="p-3">₹4,48,000</td>
                    <td className="p-3">₹3,000</td>
                    <td className="p-3 font-medium">₹4,51,000</td>
                    <td className="p-3 font-bold text-slate-900">₹17,95,000</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-3 font-semibold text-brand-800">Category 5</td>
                    <td className="p-3">₹4,93,000</td>
                    <td className="p-3">₹3,000</td>
                    <td className="p-3 font-medium">₹4,96,000</td>
                    <td className="p-3 font-bold text-slate-900">₹19,75,000</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Hostel & Boarding Schedule */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5">
              <div className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-brand-700" />
                <CardTitle className="text-sm sm:text-base font-bold text-slate-900">
                  Hostel & Mess Boarding Estimates (Eligible for Loan Inclusion)
                </CardTitle>
              </div>
              <p className="text-xs text-slate-500">
                RBI Model Scheme guidelines allow 100% of residential hostel and catering fees to be funded through your educational loan.
              </p>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Non-AC (2/3/4 Bed)</span>
                  <span className="text-brand-800 font-bold block text-sm">~₹1,15,000 / yr</span>
                  <span className="text-[10px] text-slate-500">Room rent + Special / Regular mess</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">AC Rooms (2/3 Bed)</span>
                  <span className="text-brand-800 font-bold block text-sm">~₹1,55,000 / yr</span>
                  <span className="text-[10px] text-slate-500">Room rent + Electricity + Mess</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">4-Year Hostel Total</span>
                  <span className="text-slate-900 font-extrabold block text-sm">₹4.6L – ₹6.2L</span>
                  <span className="text-[10px] text-slate-500">Added to total loan limit</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bonafide Certificate SOP */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="py-3.5 bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900">
                How to Obtain Your Fee Estimate & Bonafide Letter
              </CardTitle>
              <p className="text-xs text-slate-500">Step-by-step procedure for bank submission.</p>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-600 pt-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-700 text-white font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-slate-900 block mb-0.5">VTOP Portal Request:</strong>
                  Log in to your VTOP student portal &gt; Navigate to <em>Services / Certificates</em> &gt; Request &ldquo;Bonafide Certificate for Bank Loan&rdquo;.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-700 text-white font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-slate-900 block mb-0.5">Finance Office Verification:</strong>
                  The Finance & Accounts Office issues a stamped 4-Year Schedule of Projected Fees, including tuition category and hostel/mess options.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-700 text-white font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-slate-900 block mb-0.5">Direct Bank Submission:</strong>
                  Provide this stamped estimate along with the University Bank Account Details for electronic disbursement via RTGS/NEFT or Demand Draft.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Semester Tranche Workflow */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="py-3.5 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-brand-700" />
                <CardTitle className="text-sm sm:text-base font-bold text-slate-900">
                  Semester Tranche Disbursement Workflow
                </CardTitle>
              </div>
              <p className="text-xs text-slate-500">
                How banks release funds semester-by-semester directly to the university
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-600 pt-4">
              <p className="leading-relaxed">
                Banks never credit tuition disbursements into the student or parent personal savings account. All payments are executed directly to the institutional account of <strong>VIT Bhopal University</strong>.
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800">Beneficiary Name for Demand Draft / RTGS:</span>
                  <p className="font-mono text-xs font-semibold text-brand-800">VIT Bhopal University</p>
                  <p className="text-[11px] text-slate-500">Payable at: Bhopal / Ashta Branch</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800">Tranche Release Checklist (Before Each Semester):</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                    <li>Previous semester grade card / marksheet (must show satisfactory progression)</li>
                    <li>Upcoming semester fee demand notice from VTOP portal</li>
                    <li>Receipt of previous semester fee reconciliation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Campus Branches & Helpdesks */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="py-3.5 bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">
                Campus Banking Desks & Nearby Branches
              </CardTitle>
              <p className="text-xs text-slate-500">Branches handling VIT Bhopal student loans.</p>
            </CardHeader>
            <CardContent className="space-y-4 text-xs pt-4">
              <div className="p-3.5 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Indian Bank</span>
                  <Badge variant="verified" size="sm">On-Campus Branch</Badge>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Kothri Kalan Campus, Sehore Highway</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Handles on-campus student accounts, fee payments, and education loan servicing directly within university premises.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">State Bank of India (SBI)</span>
                  <Badge variant="info" size="sm">Designated Branch</Badge>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Ashta Branch (Bhopal-Indore Highway)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Dedicated desk handling SBI Scholar Scheme underwriting and Vidya Lakshmi portal loan sanctions for VIT Bhopal.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Bank of Baroda</span>
                  <Badge variant="neutral" size="sm">Regional Branch</Badge>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Sehore Main Branch / Bhopal Regional Hub</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Processes Baroda Gyan & Baroda Scholar education loan schemes with direct digital verification.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Caution Banner */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-bold">Avoid Semester Late Fees</span>
              <p className="text-amber-900/90 text-[11px]">
                Submit your semester tranche disbursement request to your bank manager at least <strong>25 working days</strong> prior to the semester fee deadline announced on VTOP to ensure timely DD/RTGS settlement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
