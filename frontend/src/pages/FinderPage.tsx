import React from 'react';
import { Compass, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

export const FinderPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="info">Phase 6 Engine Preview</Badge>
          <Badge variant="verified">Impartial Decision Support</Badge>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Compass className="h-8 w-8 text-brand-700 shrink-0" />
          <span>Interactive Loan Finder</span>
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Our rule-based recommendation engine matches your degree level, required loan quantum, and family income with the most applicable public and private banking programs.
        </p>
      </div>

      {/* Feature Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-6 pt-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-900 text-base">What the Loan Finder Evaluates:</h3>
              <p className="text-xs text-slate-500 mt-1">
                Zero algorithmic bias — results are strictly matched against statutory RBI guidelines and published bank eligibility criteria.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>RBI Collateral Thresholds</span>
                </div>
                <p className="text-slate-600">
                  Categorizes requirements into &lt;₹4L (Nil), ₹4L–₹7.5L (Third party guarantee), and &gt;₹7.5L (Tangible collateral).
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Central Sector Subsidies</span>
                </div>
                <p className="text-slate-600">
                  Evaluates family income against the ₹4.5L CSIS ceiling and ₹8.0L PM-Vidyalaxmi limits for automatic interest subventions.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>VIT Bhopal Fee Categories</span>
                </div>
                <p className="text-slate-600">
                  Select your exact B.Tech Category (1 to 5) to prefill tuition + hostel figures automatically.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Margin Money Calculation</span>
                </div>
                <p className="text-slate-600">
                  Calculates exact student contribution (5% on loans &gt;₹4L for domestic institutions).
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link to="/banks">
                <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Explore Bank Schemes Directly
                </Button>
              </Link>
              <Link to="/calculator">
                <Button variant="secondary">
                  Calculate EMI Instead
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-slate-50 to-blue-50/40 border-brand-100">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2 text-brand-800 font-semibold text-sm">
                <ShieldCheck className="h-4 w-4 text-brand-600" />
                <span>Statutory Disclaimer</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Loan sanction and ultimate approval remain the exclusive prerogative of the lending bank. Edu4Loan provides eligibility alignment and preparation guidance only.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
