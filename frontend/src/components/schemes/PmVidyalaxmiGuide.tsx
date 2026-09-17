import React from 'react';
import {
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Landmark,
  Scale,
  Building,
  Info,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const PmVidyalaxmiGuide: React.FC = () => {
  return (
    <div className="space-y-6 text-xs">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-800 text-white rounded-xl p-6 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-700/60 text-xs font-semibold text-brand-100 border border-brand-600/40">
            <Sparkles className="h-3.5 w-3.5" />
            Module 10: 2024 Cabinet Approved
          </div>
          <a
            href="https://pmvidyalaxmi.education.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-200 hover:text-white transition-colors"
          >
            <span>Visit pmvidyalaxmi.education.gov.in</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          PM-Vidyalaxmi Scheme (2024) Deep Dive
        </h2>
        <p className="text-xs sm:text-sm text-brand-100/90 max-w-3xl leading-relaxed">
          The landmark central sector scheme approved by the Union Cabinet in 2024 to provide 3% interest subvention for students with family income up to ₹8 Lakhs pursuing degrees in top NIRF institutions, alongside 75% credit guarantee coverage.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="verified" size="sm">
                Financial Relief
              </Badge>
              <Award className="h-4 w-4 text-brand-600" />
            </div>
            <CardTitle className="text-sm font-bold text-slate-900 mt-1">
              3.0% Annual Interest Subvention
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 leading-relaxed text-[11px] space-y-2">
            <p>
              Students with annual family income up to <strong>₹8.0 Lakhs</strong> who are not receiving benefits under other government scholarships qualify for a 3% interest rate subvention on loan amounts up to <strong>₹10.0 Lakhs</strong>.
            </p>
            <p className="text-emerald-700 font-semibold">
              Direct Government electronic payment reduces your monthly interest compounding during study!
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="info" size="sm">
                Statutory Coverage
              </Badge>
              <ShieldCheck className="h-4 w-4 text-brand-600" />
            </div>
            <CardTitle className="text-sm font-bold text-slate-900 mt-1">
              75% NCGTC Credit Guarantee
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 leading-relaxed text-[11px] space-y-2">
            <p>
              For education loans up to <strong>₹7.5 Lakhs</strong>, the scheme provides a 75% credit guarantee to banks through the National Credit Guarantee Trustee Company (NCGTC).
            </p>
            <p className="text-blue-800 font-semibold">
              Banks cannot demand physical property collateral or third-party guarantors within this limit!
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="neutral" size="sm">
                Institutional Scope
              </Badge>
              <Building className="h-4 w-4 text-brand-600" />
            </div>
            <CardTitle className="text-sm font-bold text-slate-900 mt-1">
              Top NIRF 100/200 Institutions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 leading-relaxed text-[11px] space-y-2">
            <p>
              Applies to Higher Education Institutions ranked in the top 100 overall / categories or ranks 101–200 in NIRF, covering state and central universities as well as premier private institutions like VIT.
            </p>
            <p className="text-slate-700 font-medium">
              Over 860 premier institutions eligible across India covering 22+ lakh students annually.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison: PM-Vidyalaxmi vs CSIS */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-brand-700" />
            <CardTitle className="text-sm font-bold text-slate-900">
              Comparative Analysis: PM-Vidyalaxmi (2024) vs. CSIS (2009)
            </CardTitle>
          </div>
          <p className="text-[11px] text-slate-500">
            Understanding which central scheme provides greater financial relief for your income tier
          </p>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="p-3">Feature</th>
                <th className="p-3 text-brand-800">PM-Vidyalaxmi (2024)</th>
                <th className="p-3 text-slate-800">CSIS Scheme (2009)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr className="hover:bg-slate-50/60">
                <td className="p-3 font-semibold text-slate-700">Annual Family Income Ceiling</td>
                <td className="p-3 font-bold text-brand-700">Gross Income ≤ ₹8.0 Lakhs</td>
                <td className="p-3 font-bold text-slate-900">Gross Income ≤ ₹4.5 Lakhs (EWS)</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="p-3 font-semibold text-slate-700">Subsidy Quantum</td>
                <td className="p-3">3.0% p.a. interest subvention</td>
                <td className="p-3 text-emerald-700 font-bold">
                  100% full interest waiver during study + 1 yr
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="p-3 font-semibold text-slate-700">Eligible Loan Cap for Subsidy</td>
                <td className="p-3">Up to ₹10.0 Lakhs</td>
                <td className="p-3">Up to ₹10.0 Lakhs (Moratorium interest waived)</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="p-3 font-semibold text-slate-700">Eligible Institutions</td>
                <td className="p-3">Top 100/200 NIRF Ranked HEIs</td>
                <td className="p-3">All NAAC/NBA accredited technical colleges</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="p-3 font-semibold text-slate-700">Credit Guarantee</td>
                <td className="p-3">75% via NCGTC up to ₹7.5 Lakhs</td>
                <td className="p-3">Covered under CGFSEL guidelines</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="p-3 font-semibold text-slate-700">Application Portal</td>
                <td className="p-3 font-medium">Unified PM-Vidyalaxmi Portal</td>
                <td className="p-3 font-medium">Vidya Lakshmi Portal / Canara Bank Nodal</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Advisory Note */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 flex items-start gap-3">
        <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <span className="font-bold">Student Guidance: Which Scheme Should You Target?</span>
          <p className="text-blue-900/90">
            If your family income is <strong>≤ ₹4.5 Lakhs</strong>, prioritize the <strong>CSIS scheme</strong>, as it completely wipes out 100% of your interest during your 4 years of college and moratorium (saving ₹3L–₹5L). If your family income is between <strong>₹4.5L and ₹8.0L</strong>, the <strong>PM-Vidyalaxmi scheme</strong> is your primary statutory benefit, saving 3% annual interest.
          </p>
        </div>
      </div>
    </div>
  );
};
