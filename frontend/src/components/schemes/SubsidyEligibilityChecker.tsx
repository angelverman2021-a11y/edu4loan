import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Landmark,
  Sparkles,
  Award,
  ShieldCheck,
  Scale,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { governmentSchemeService } from '@/services/governmentSchemeService';
import { SubsidyCheckParams } from '@/types';

export const SubsidyEligibilityChecker: React.FC = () => {
  const [income, setIncome] = useState<number>(450000);
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [institutionType, setInstitutionType] = useState<'nirf_top_100_200' | 'other'>('nirf_top_100_200');
  const [degreeLevel, setDegreeLevel] = useState<'Undergraduate' | 'Postgraduate'>('Undergraduate');

  const checkParams: SubsidyCheckParams = useMemo(
    () => ({
      annualIncome: income,
      loanAmount,
      institutionType,
      degreeLevel,
    }),
    [income, loanAmount, institutionType, degreeLevel]
  );

  const evaluation = useMemo(() => {
    return governmentSchemeService.evaluateSubsidyEligibility(checkParams);
  }, [checkParams]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Input Card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
          <div className="flex items-center gap-2">
            <Badge variant="info">Central Subsidies</Badge>
            <Badge variant="verified">Cabinet Guidelines</Badge>
          </div>
          <CardTitle className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            Central Government Subsidy & Guarantee Checker
          </CardTitle>
          <p className="text-[11px] text-slate-500">
            Enter your family income and required loan quantum to evaluate matching central government schemes
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Income Input & Presets */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-800 uppercase tracking-wider">
                Gross Annual Family Income (From All Sources)
              </label>
              <span className="text-sm font-extrabold text-brand-700">
                {formatCurrency(income)} / year
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: '₹3.0 Lakhs (EWS / CSIS Tier)', val: 300000 },
                { label: '₹4.5 Lakhs (CSIS Ceiling)', val: 450000 },
                { label: '₹6.0 Lakhs (Mid Income)', val: 600000 },
                { label: '₹8.0 Lakhs (PM-Vidyalaxmi Ceiling)', val: 800000 },
                { label: '₹12.0 Lakhs (Non-Subsidized)', val: 1200000 },
              ].map((chip) => (
                <button
                  key={chip.val}
                  type="button"
                  onClick={() => setIncome(chip.val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    income === chip.val
                      ? 'bg-brand-700 text-white shadow-sm ring-2 ring-brand-700 ring-offset-1'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <input
              type="range"
              min={100000}
              max={1500000}
              step={25000}
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹1 Lakh</span>
              <span>₹4.5L (CSIS Cap)</span>
              <span>₹8L (PM-Vidyalaxmi Cap)</span>
              <span>₹15 Lakhs</span>
            </div>
          </div>

          {/* Loan Amount & Institution Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Loan Amount */}
            <div>
              <label className="font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                Estimated Loan Amount
              </label>
              <select
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-brand-500"
              >
                <option value={400000}>₹4.0 Lakhs (Tier 1)</option>
                <option value={750000}>₹7.5 Lakhs (Tier 2 / CGFSEL)</option>
                <option value={1000000}>₹10.0 Lakhs (PM-Vidyalaxmi Cap)</option>
                <option value={1200000}>₹12.0 Lakhs (VIT B.Tech Standard)</option>
                <option value={1800000}>₹18.0 Lakhs (Tuition + Hostel)</option>
              </select>
            </div>

            {/* Institution Standing */}
            <div>
              <label className="font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                Institution NIRF Standing
              </label>
              <select
                value={institutionType}
                onChange={(e) => setInstitutionType(e.target.value as any)}
                className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-brand-500"
              >
                <option value="nirf_top_100_200">Top NIRF 100/200 (VIT Bhopal Eligible)</option>
                <option value="other">Other Higher Education Institutions</option>
              </select>
            </div>

            {/* Degree Level */}
            <div>
              <label className="font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                Degree Level
              </label>
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value as any)}
                className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-brand-500"
              >
                <option value="Undergraduate">Undergraduate (B.Tech)</option>
                <option value="Postgraduate">Postgraduate (M.Tech / MCA / MBA)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Dashboard */}
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <Info className="h-5 w-5 text-brand-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-900 text-sm">Eligibility Assessment</span>
            <p className="text-slate-600 leading-relaxed text-xs">{evaluation.explanation}</p>
          </div>
        </div>

        {/* Matched Schemes Cards */}
        {evaluation.matchedSchemes.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-2">
            <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">
              No Central Subsidies Matched for Selected Income Tier
            </h4>
            <p className="text-slate-500 max-w-md mx-auto">
              Your annual family income ({formatCurrency(income)}) exceeds central interest subsidy ceilings (₹4.5L for CSIS, ₹8.0L for PM-Vidyalaxmi). Standard bank educational loans remain fully accessible.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evaluation.matchedSchemes.map((scheme) => (
              <Card key={scheme.code} className="border-slate-200 shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={scheme.badgeVariant} size="sm">
                      {scheme.code}
                    </Badge>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Eligible
                    </span>
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900 mt-2">
                    {scheme.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 flex-1 text-xs">
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      Subsidy Benefit:
                    </span>
                    <p className="text-slate-900 font-bold text-xs">{scheme.benefit}</p>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-600">
                    <p>
                      <strong>Income Cap:</strong> {scheme.incomeCeiling}
                    </p>
                    <p className="leading-relaxed">{scheme.notes}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
