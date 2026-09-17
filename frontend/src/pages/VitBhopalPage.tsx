import React, { useState, useEffect } from 'react';
import { BookOpen, Building, CheckCircle2, ShieldAlert, FileText, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { api } from '@/services/api';

export const VitBhopalPage: React.FC = () => {
  const [institution, setInstitution] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        setLoading(true);
        const res = await api.get<any>('/institutions/vit-bhopal');
        setInstitution(res.data);
      } catch (err) {
        console.error('Failed to load institution profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInstitution();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="verified">Institutional Specifics</Badge>
          <Badge variant="neutral">Academic Year 2026-27</Badge>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-brand-700 shrink-0" />
          <span>VIT Bhopal Campus Education Loan Guide</span>
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Course fee categories, hostel and mess cost estimates, on-campus bank helpdesk contacts, and standard operating procedures for obtaining your Bonafide Fee Certificate.
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

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Fee Structure & Bonafide Process */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tuition Fee Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">B.Tech Tuition Fee Tiers (Categories 1 – 5)</CardTitle>
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

          {/* Bonafide Certificate SOP */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How to Obtain Your Fee Estimate & Bonafide Letter</CardTitle>
              <p className="text-xs text-slate-500">Step-by-step procedure for bank submission.</p>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-700 text-white font-bold text-[10px] shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-slate-900 block mb-0.5">VTOP Portal Request:</strong>
                  Log in to your VTOP student portal &gt; Navigate to <em>Services / Certificates</em> &gt; Request &ldquo;Bonafide Certificate for Bank Loan&rdquo;.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-700 text-white font-bold text-[10px] shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-slate-900 block mb-0.5">Finance Office Verification:</strong>
                  The Finance Office issues a stamped 4-Year Schedule of Projected Fees, including Hostel and Mess options.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-700 text-white font-bold text-[10px] shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-slate-900 block mb-0.5">Direct Bank Submission:</strong>
                  Provide this stamped estimate along with the University Account Details for electronic disbursement via RTGS/NEFT.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Campus Branches & Helpdesks */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Campus Banking Helpdesks</CardTitle>
              <p className="text-xs text-slate-500">Branches with dedicated desks for VIT Bhopal students.</p>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3.5 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Indian Bank</span>
                  <Badge variant="verified" size="sm">On-Campus</Badge>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Kothri Kalan Campus Branch, Sehore Highway</span>
                </div>
                <div className="text-slate-600">
                  Handles on-campus account opening, loan servicing, and fee demand drafts.
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">State Bank of India (SBI)</span>
                  <Badge variant="info" size="sm">Nearby</Badge>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Ashta Branch (Near Bhopal-Indore Highway)</span>
                </div>
                <div className="text-slate-600">
                  Specialist desk for SBI Scholar Scheme processing for VIT Bhopal students.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
