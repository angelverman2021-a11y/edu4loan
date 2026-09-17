import React from 'react';
import { Percent, TrendingUp, HelpCircle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const InterestRateExplainer: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-800">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-vit-navy to-vit-blue text-white space-y-2 shadow-fintech">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-semibold text-blue-200">
          <Percent className="h-3.5 w-3.5" />
          <span>Financial Literacy • Module 5</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Understanding Education Loan Interest Rates
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
          How the Reserve Bank of India (RBI) sets benchmark lending rates, why your loan interest rate is determined by a spread, and how concessions reduce your overall debt.
        </p>
      </div>

      {/* Grid of Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Concept 1: EBLR / RLLR */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="info">RBI Mandated Benchmark</Badge>
              <span className="text-[10px] text-slate-400 font-mono">Current Repo: 6.50%</span>
            </div>
            <CardTitle className="text-base mt-2">External Benchmark Lending Rate (EBLR)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
            <p>
              Since October 2019, the RBI has required all scheduled commercial banks to link retail loans (including education loans) to an external benchmark, most commonly the <strong>RBI Policy Repo Rate</strong>. This system is known as <strong>EBLR</strong> (or <strong>RLLR</strong> in state-owned banks).
            </p>
            <p>
              Before EBLR, banks used the <strong>MCLR</strong> (Marginal Cost of Funds based Lending Rate), which adjusted much more slowly when the central bank cut interest rates. EBLR provides complete statutory transparency.
            </p>
          </CardContent>
        </Card>

        {/* Concept 2: The Spread Formula */}
        <Card>
          <CardHeader>
            <Badge variant="verified">The Rate Formula</Badge>
            <CardTitle className="text-base mt-2">How Banks Calculate Your Interest Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-center text-xs text-brand-900 font-bold">
              Your Interest Rate = External Benchmark (Repo) + Bank Spread
            </div>
            <p>
              <strong>The Spread</strong> consists of the bank’s operating costs, credit risk assessment of the applicant/co-applicant, and institutional rating of the university (e.g. premier list vs non-premier).
            </p>
            <p>
              For example, if SBI Repo is <strong>6.50%</strong> and your scheme spread is <strong>1.85%</strong>, your effective interest rate will be <strong>8.35% p.a.</strong>
            </p>
          </CardContent>
        </Card>

        {/* Concept 3: Fixed vs Floating */}
        <Card>
          <CardHeader>
            <Badge variant="neutral">Market Mechanics</Badge>
            <CardTitle className="text-base mt-2">Fixed vs Floating Rates in Education Loans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
            <p>
              Over <strong>98% of education loans in India are floating-rate loans</strong>. This means your interest rate will automatically adjust whenever the RBI changes the Policy Repo Rate.
            </p>
            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-950 space-y-1">
              <strong className="block">What happens when RBI changes rates?</strong>
              <p>
                When the Repo rate increases or decreases, banks generally keep your monthly EMI amount fixed and instead <strong>extend or shorten your repayment tenure</strong>, unless requested otherwise.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Concept 4: Concessions & Discounts */}
        <Card>
          <CardHeader>
            <Badge variant="verified">Standard Concessions</Badge>
            <CardTitle className="text-base mt-2">Statutory Discounts & Concessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Girl Student Concession: </strong>
                  Almost all public sector banks (SBI, Canara, PNB, BoB) provide an automatic <strong>0.50% interest rate rebate</strong> for female borrowers.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Prompt Servicing Concession: </strong>
                  Several banks offer an additional <strong>1.00% interest concession</strong> if simple interest is serviced regularly during the moratorium period.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 80E Tax Deduction */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-5 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Info className="h-4 w-4 text-brand-700" />
            <span>Income Tax Relief under Section 80E</span>
          </div>
          <p className="leading-relaxed">
            Under Section 80E of the Indian Income Tax Act, the borrower or parent co-borrower can claim a <strong>100% tax deduction on the total interest paid</strong> towards an education loan for up to <strong>8 consecutive financial years</strong>, starting from the year repayment begins. There is no upper financial cap on this interest deduction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
