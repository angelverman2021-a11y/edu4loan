import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  FileText, 
  Layers, 
  Info, 
  Scale, 
  FileCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface CollateralExplainerProps {
  currentLoanAmount?: number;
  onSelectAmount?: (amount: number) => void;
}

export const CollateralExplainer: React.FC<CollateralExplainerProps> = ({
  currentLoanAmount = 1200000,
  onSelectAmount,
}) => {
  const [selectedLoanTier, setSelectedLoanTier] = useState<number>(() => {
    if (currentLoanAmount <= 400000) return 1;
    if (currentLoanAmount <= 750000) return 2;
    return 3;
  });

  const [activeTab, setActiveTab] = useState<'tiers' | 'assets' | 'sop' | 'margin'>('tiers');

  const tiers = [
    {
      id: 1,
      name: 'Tier 1: Up to ₹4.0 Lakhs',
      subtitle: 'Zero Collateral, Zero Third-Party Guarantee',
      range: '₹0 – ₹4,00,000',
      securityReq: 'No collateral security or third-party guarantee required.',
      coBorrowerReq: 'Parents / Legal Guardian as joint borrower / co-obligant.',
      margin: '0% (Nil Margin)',
      cgfsel: 'Not required',
      badgeText: 'RBI Statutory Exemption',
      badgeVariant: 'verified' as const,
      details: [
        'As per RBI / IBA Model Educational Loan Scheme, banks cannot ask for collateral or third-party guarantee for loans up to ₹4 Lakhs.',
        'Primary security is the hypothecation of future earning capacity of the student and any equipment/books purchased from loan proceeds.',
        'Co-borrower must be father, mother, or legal guardian.',
      ],
    },
    {
      id: 2,
      name: 'Tier 2: ₹4.0 Lakhs to ₹7.5 Lakhs',
      subtitle: 'Guarantee / CGFSEL Covered',
      range: '₹4,00,001 – ₹7,50,000',
      securityReq: 'Satisfactory third-party guarantee OR CGFSEL credit guarantee coverage.',
      coBorrowerReq: 'Parents / Legal Guardian as joint borrower / co-obligant.',
      margin: '5% for Studies in India (0% under select premier tie-ups)',
      cgfsel: 'CGFSEL (Credit Guarantee Fund Scheme for Education Loans) via NCGTC',
      badgeText: 'CGFSEL Guarantee Covered',
      badgeVariant: 'info' as const,
      details: [
        'Physical tangible collateral is NOT mandatory under RBI Model Scheme guidelines up to ₹7.5 Lakhs.',
        'Member Lending Institutions (MLIs) are covered up to 75% of the defaulted amount by NCGTC under the CGFSEL scheme.',
        'If CGFSEL is not opted, banks may ask for a third-party guarantor acceptable to the bank whose net worth exceeds the loan amount.',
        'VIT Bhopal students admitted through merit lists often qualify for waived third-party guarantee in premier institutional tie-ups.',
      ],
    },
    {
      id: 3,
      name: 'Tier 3: Above ₹7.5 Lakhs',
      subtitle: 'Tangible Collateral Security Required',
      range: 'Above ₹7,50,000 (e.g. ₹12L – ₹40L)',
      securityReq: 'Tangible collateral security of suitable value (100% to 133% of loan value).',
      coBorrowerReq: 'Parents / Legal Guardian along with owner of the collateral property.',
      margin: '5% for Studies in India (Up to 15% for Studies Abroad)',
      cgfsel: 'Applicable only if covered under special bank schemes',
      badgeText: 'Tangible Asset Required',
      badgeVariant: 'advisory' as const,
      details: [
        'Tangible collateral of marketable value matching or exceeding the loan amount is required.',
        'Includes residential houses, apartments, non-agricultural approved plots, fixed deposits, or surrender value of LIC policies.',
        'Equitable mortgage (deposit of title deeds) or registered mortgage is executed as per state stamp duty laws.',
        'Property valuation and 13–30 year Title Search Report (TSR) are conducted by empanelled advocates and engineers.',
      ],
    },
  ];

  const acceptableAssets = [
    {
      type: 'Residential Real Estate (House / Flat)',
      status: 'Widely Accepted',
      ltv: '100% – 133% coverage required',
      notes: 'Must possess clear unencumbered title, approved building plan, completion certificate, and continuous chain of deed for 13 to 30 years.',
      eligible: true,
    },
    {
      type: 'Non-Agricultural Freehold Land / Plot',
      status: 'Widely Accepted',
      ltv: '100% – 125% coverage required',
      notes: 'Must be municipal or urban development authority approved layout (e.g., BDA, DTCP, PUDA). Must have demarcated boundaries and road access.',
      eligible: true,
    },
    {
      type: 'Bank Fixed Deposits (FD) / Term Deposits',
      status: 'Fast Approval / 100% Accepted',
      ltv: 'Up to 90% – 95% of FD value',
      notes: 'FD with the lending bank or approved schedule commercial bank. Bank marks a lien against the deposit. No legal search or valuation needed.',
      eligible: true,
    },
    {
      type: 'Life Insurance Policies (LIC / Endowments)',
      status: 'Accepted',
      ltv: 'Up to 85% – 90% of Surrender Value',
      notes: 'Surrender value (not sum assured) is pledged. Term insurance policies have zero surrender value and cannot be accepted as collateral.',
      eligible: true,
    },
    {
      type: 'Government Securities (NSC, KVP, Sovereign Gold Bonds)',
      status: 'Accepted',
      ltv: '80% – 90% of face / market value',
      notes: 'National Savings Certificates, Kisan Vikas Patra, and SGBs can be assigned in favour of the bank with the post office or RBI depository.',
      eligible: true,
    },
    {
      type: 'Agricultural Land',
      status: 'Strictly Prohibited',
      ltv: '0% (Cannot be mortgaged)',
      notes: 'Barred under Section 31(i) of the SARFAESI Act, 2002. Banks cannot enforce mortgage or auction agricultural land under standard recovery procedures.',
      eligible: false,
    },
    {
      type: 'Vehicles, Gold Jewellery, Shares & Cryptocurrencies',
      status: 'Generally Not Accepted for Education Loans',
      ltv: '0% for education term loans',
      notes: 'Movable assets are not eligible as standard educational loan collateral due to high volatility and depreciation.',
      eligible: false,
    },
  ];

  const sopSteps = [
    {
      step: 1,
      title: 'Submission of Original Title Documents',
      duration: 'Day 1–2',
      description: 'Borrower submits copies of original registered sale deed, parent deeds, approved layout plans, tax receipts, and encumbrance certificates (EC).',
    },
    {
      step: 2,
      title: 'Title Search Report (TSR) by Bank Advocate',
      duration: 'Day 3–7',
      description: 'Bank-empanelled legal advocate conducts search at Sub-Registrar Office tracing title ownership 13 to 30 years to confirm clear, marketable, unencumbered title.',
    },
    {
      step: 3,
      title: 'Physical Property Valuation by Empanelled Engineer',
      duration: 'Day 4–8',
      description: 'Approved chartered surveyor/engineer visits the property, inspects boundaries, verifies municipal adherence, and determines Fair Market Value (FMV) and Realizable Value.',
    },
    {
      step: 4,
      title: 'Creation of Mortgage (Equitable or Registered)',
      duration: 'Day 8–12',
      description: 'Deposit of Title Deeds (Equitable Mortgage) with bank execution or Registered Mortgage before Sub-Registrar depending on state-specific stamp act requirements.',
    },
    {
      step: 5,
      title: 'CERSAI Filing & Sanction Release',
      duration: 'Day 10–14',
      description: 'Bank registers the security charge on the Central Electronic Registry (CERSAI) portal to prevent fraudulent double-mortgaging, followed by disbursement.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-800 text-white rounded-xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-700/60 text-xs font-semibold tracking-wide uppercase text-brand-100 border border-brand-600/40">
            <Shield className="h-3.5 w-3.5" />
            Module 7: Statutory Collateral & Security Explainer
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Collateral, Guarantees & Security Demystified
          </h2>
          <p className="text-sm sm:text-base text-brand-100/90 leading-relaxed">
            Understand RBI Model Educational Loan Scheme rules, why loans up to ₹4 Lakhs need no collateral, how CGFSEL protects loans up to ₹7.5 Lakhs, and the exact legal process for pledging immovable property.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-sm font-medium">
        <button
          onClick={() => setActiveTab('tiers')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'tiers'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>RBI Statutory Tiers</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'assets'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Acceptable Collateral Classes</span>
        </button>

        <button
          onClick={() => setActiveTab('sop')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'sop'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          <span>Valuation & TSR Legal SOP</span>
        </button>

        <button
          onClick={() => setActiveTab('margin')}
          className={`px-4 py-2.5 rounded-t-lg transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'margin'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Scale className="h-4 w-4" />
          <span>Margin Money & Co-Borrower</span>
        </button>
      </div>

      {/* TAB 1: RBI Statutory Tiers */}
      {activeTab === 'tiers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Interactive Tier Selector
              </p>
              <h3 className="text-base font-semibold text-slate-900">
                Select your anticipated education loan amount
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {[
                { label: '₹4L (Tier 1)', tierId: 1, amt: 400000 },
                { label: '₹7.5L (Tier 2)', tierId: 2, amt: 750000 },
                { label: '₹12L (Tier 3)', tierId: 3, amt: 1200000 },
              ].map((item) => (
                <button
                  key={item.tierId}
                  onClick={() => {
                    setSelectedLoanTier(item.tierId);
                    if (onSelectAmount) onSelectAmount(item.amt);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedLoanTier === item.tierId
                      ? 'bg-brand-700 text-white shadow-sm ring-2 ring-brand-700 ring-offset-1'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => {
              const isSelected = selectedLoanTier === tier.id;
              return (
                <Card
                  key={tier.id}
                  className={`transition-all duration-200 ${
                    isSelected
                      ? 'border-brand-600 shadow-md ring-2 ring-brand-500/20 bg-brand-50/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Badge variant={tier.badgeVariant} size="sm">
                        {tier.badgeText}
                      </Badge>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Selected
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900">
                      {tier.name}
                    </CardTitle>
                    <p className="text-xs text-slate-500 font-medium">{tier.subtitle}</p>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700 block mb-0.5">
                        Security Requirement:
                      </span>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                        {tier.securityReq}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-[11px] font-medium text-slate-500 block">
                          Domestic Margin
                        </span>
                        <span className="font-bold text-slate-900">{tier.margin}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-[11px] font-medium text-slate-500 block">
                          Co-Borrower
                        </span>
                        <span className="font-semibold text-slate-800">Parents/Guardian</span>
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 block mb-1">Key Rules:</span>
                      <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                        {tier.details.map((d, i) => (
                          <li key={i} className="leading-normal">
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 text-xs sm:text-sm flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-bold">Did you know? (RBI / IBA Circular Compliance)</span>
              <p className="text-blue-900/90">
                Banks cannot deny an education loan solely because the borrower cannot provide collateral if the loan amount is up to ₹4 Lakhs. For loans between ₹4L and ₹7.5L, CGFSEL ensures that public sector banks have risk protection without demanding physical land or house deeds from parents.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Acceptable Collateral Classes */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Approved vs Unacceptable Asset Classes for Education Loans
                </h3>
                <p className="text-xs text-slate-500">
                  Collateral assets must be easily marketable, free of encumbrances, and legally enforceable under SARFAESI.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {acceptableAssets.map((asset, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="shrink-0 mt-1">
                    {asset.eligible ? (
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                        ✓
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-sm">
                        ✕
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{asset.type}</span>
                      <Badge variant={asset.eligible ? 'verified' : 'error'} size="sm">
                        {asset.status}
                      </Badge>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {asset.ltv}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {asset.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SARFAESI Alert */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-bold">Crucial Legal Caveat: Agricultural Land</span>
              <p className="text-amber-900/90">
                Under Section 31(i) of the SARFAESI Act 2002, the provisions of the Act do not apply to any security interest created in agricultural land. Therefore, all commercial banks and NBFCs reject agricultural land as collateral for educational loans. Only land converted to non-agricultural (NA) use with municipal approvals is accepted.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Valuation & TSR Legal SOP */}
      {activeTab === 'sop' && (
        <div className="space-y-6">
          <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Property Verification & Legal Mortgage Lifecycle (SOP)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              When pledging immovable property for loans &gt; ₹7.5 Lakhs, banks follow a rigorous legal protocol to ensure undisputed title ownership and fair valuation.
            </p>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-brand-200">
              {sopSteps.map((s) => (
                <div key={s.step} className="relative group">
                  {/* Step Bubble */}
                  <div className="absolute -left-6 sm:-left-8 top-0 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center ring-4 ring-white shadow-sm">
                    {s.step}
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 transition-all hover:bg-white hover:border-brand-300 hover:shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-900">{s.title}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                        {s.duration}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-600" />
                  What is a Title Search Report (TSR)?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>
                  A TSR is a certified legal opinion provided by an advocate on the bank's panel. The advocate traces the property's sale and inheritance chain back 13 to 30 years at the local registrar office.
                </p>
                <p>
                  It verifies there are no prior mortgages, court attachments, minor's claims, revenue disputes, or pending inheritance litigation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-brand-600" />
                  What is Property Valuation?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>
                  An empanelled structural engineer / valuer calculates two numbers:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Fair Market Value (FMV):</strong> Current market price.</li>
                  <li><strong>Realizable Value:</strong> Conservative price if auctioned under SARFAESI within 3 months (usually 80%–85% of FMV).</li>
                </ul>
                <p>
                  The loan amount sanctioned is capped by the realizable value and bank LTV ratios.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 4: Margin Money & Co-Borrower */}
      {activeTab === 'margin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-brand-600" />
                  Margin Money Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  <strong>Margin Money</strong> represents the proportion of total educational expenses that the student / family must fund from their own pocket before the bank disburses each semester tranche.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="font-medium text-slate-800">Studies in India &le; ₹4.0 Lakhs</span>
                    <Badge variant="verified">0% (Nil)</Badge>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="font-medium text-slate-800">Studies in India &gt; ₹4.0 Lakhs</span>
                    <Badge variant="info">5% Statutory Margin</Badge>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="font-medium text-slate-800">Studies Abroad</span>
                    <Badge variant="advisory">15% Statutory Margin</Badge>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex justify-between items-center">
                    <span className="font-medium text-blue-900">VIT Bhopal Scholar Schemes</span>
                    <Badge variant="verified">Often 0% Margin</Badge>
                  </div>
                </div>
                <p className="text-xs text-slate-500 pt-2">
                  * Note: Scholarships and fee concessions awarded to the student are treated as margin money by banks.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-brand-600" />
                  Co-Borrower & Co-Obligant Mandate
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  Because full-time college students do not have independent verified income during their 4-year degree, the loan is granted jointly with a co-borrower.
                </p>
                <div className="space-y-2">
                  <div className="border border-slate-100 bg-slate-50 p-2.5 rounded">
                    <span className="font-semibold text-slate-800 block mb-0.5">Eligible Co-Borrowers:</span>
                    <span>Father, Mother, Legal Guardian, or Spouse (if married). In select banks, parents-in-law or siblings may co-sign.</span>
                  </div>
                  <div className="border border-slate-100 bg-slate-50 p-2.5 rounded">
                    <span className="font-semibold text-slate-800 block mb-0.5">Joint Legal Liability:</span>
                    <span>The co-borrower is jointly and severally liable. If the student defaults after moratorium, the bank can pursue recovery directly from the co-borrower.</span>
                  </div>
                  <div className="border border-slate-100 bg-slate-50 p-2.5 rounded">
                    <span className="font-semibold text-slate-800 block mb-0.5">CIBIL / Credit Score Impact:</span>
                    <span>The repayment behavior reflects on BOTH the student's credit report and the co-borrower's credit score. Timely EMI payment builds a stellar CIBIL score for graduation.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
