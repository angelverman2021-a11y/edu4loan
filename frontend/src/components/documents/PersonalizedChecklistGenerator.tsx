import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  Square,
  Sparkles,
  Download,
  Printer,
  ShieldCheck,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { documentService } from '@/services/documentService';
import {
  PersonalizedChecklistParams,
  PersonalizedChecklistData,
  DocumentModelItem,
} from '@/types';

interface PersonalizedChecklistGeneratorProps {
  initialAmount?: number;
  onNavigateToPrepPack?: () => void;
}

export const PersonalizedChecklistGenerator: React.FC<PersonalizedChecklistGeneratorProps> = ({
  initialAmount = 1200000,
  onNavigateToPrepPack,
}) => {
  // Profile Configuration Parameters
  const [params, setParams] = useState<PersonalizedChecklistParams>({
    estimatedLoanAmount: initialAmount,
    coApplicantType: 'salaried',
    hasCollateral: initialAmount > 750000,
    collateralType: initialAmount > 750000 ? 'property' : 'none',
    applyingThroughVidyaLakshmi: true,
    degreeLevel: 'Undergraduate',
  });

  const [checklist, setChecklist] = useState<PersonalizedChecklistData | null>(null);
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>(() =>
    documentService.getSavedCheckedState()
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [showNotApplicable, setShowNotApplicable] = useState<boolean>(false);

  // Sync collateral default when loan amount changes
  useEffect(() => {
    if (params.estimatedLoanAmount > 750000 && params.collateralType === 'none') {
      setParams((prev) => ({ ...prev, hasCollateral: true, collateralType: 'property' }));
    } else if (params.estimatedLoanAmount <= 750000 && params.collateralType === 'property') {
      setParams((prev) => ({ ...prev, hasCollateral: false, collateralType: 'none' }));
    }
  }, [params.estimatedLoanAmount]);

  // Fetch or locally recalculate personalized checklist
  useEffect(() => {
    let isMounted = true;
    const loadChecklist = async () => {
      setLoading(true);
      const data = await documentService.fetchPersonalizedChecklist(params);
      if (isMounted) {
        setChecklist(data);
        setLoading(false);
      }
    };
    loadChecklist();
    return () => {
      isMounted = false;
    };
  }, [params]);

  // Save checked state to localStorage
  const toggleCheck = (id: string) => {
    const updated = { ...checkedIds, [id]: !checkedIds[id] };
    setCheckedIds(updated);
    documentService.saveCheckedState(updated);
  };

  const handleClearAll = () => {
    setCheckedIds({});
    documentService.saveCheckedState({});
  };

  // Readiness Score
  const readiness = useMemo(() => {
    if (!checklist) {
      return { totalRequired: 0, completedCount: 0, percentage: 0, isReady: false, pendingRequiredNames: [] };
    }
    return documentService.calculateReadinessScore(checklist.requiredDocuments, checkedIds);
  }, [checklist, checkedIds]);

  const handleDownloadCsv = () => {
    if (!checklist) return;
    const csvContent = documentService.exportChecklistToCsv(checklist, checkedIds);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Edu4Loan_Personalized_Dossier_Checklist_${params.estimatedLoanAmount}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Configuration Header & Interactive Profile Form */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="info">Module 14</Badge>
                <Badge variant="verified">Statutory RBI Rules</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 mt-1">
                Customize Your Loan Document Checklist
              </CardTitle>
            </div>
            <span className="text-sm text-slate-500 font-medium">
              Adapts dynamically to your loan tier & co-borrower
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6 text-sm">
          {/* Preset Buttons & Loan Amount */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider">
                1. Loan Quantum (Principal Required)
              </span>
              <span className="text-base font-extrabold text-brand-700">
                {formatCurrency(params.estimatedLoanAmount)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: '₹4.0 Lakhs (Zero Collateral)', val: 400000 },
                { label: '₹7.5 Lakhs (CGFSEL Limit)', val: 750000 },
                { label: '₹12.0 Lakhs (VIT B.Tech 4-Yr)', val: 1200000 },
                { label: '₹18.0 Lakhs (Tuition + Hostel)', val: 1800000 },
              ].map((chip) => (
                <button
                  key={chip.val}
                  type="button"
                  onClick={() => setParams((prev) => ({ ...prev, estimatedLoanAmount: chip.val }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    params.estimatedLoanAmount === chip.val
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
              max={4000000}
              step={25000}
              value={params.estimatedLoanAmount}
              onChange={(e) =>
                setParams((prev) => ({ ...prev, estimatedLoanAmount: Number(e.target.value) }))
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>₹1 Lakh</span>
              <span>₹20 Lakhs</span>
              <span>₹40 Lakhs</span>
            </div>
          </div>

          {/* Grid of Profile Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Co-Applicant Employment */}
            <div>
              <label className="font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                2. Co-Borrower Employment
              </label>
              <select
                value={params.coApplicantType}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    coApplicantType: e.target.value as any,
                  }))
                }
                className="w-full p-2 text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-brand-500"
              >
                <option value="salaried">Salaried (MNC / Govt / Pvt)</option>
                <option value="self_employed">Self-Employed / Business / Trade</option>
                <option value="pensioner">Retired / Pensioner</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {params.coApplicantType === 'salaried'
                  ? 'Requires Form 16 & 3 months salary slips'
                  : 'Requires 2-3 years CA audited ITR & P&L'}
              </span>
            </div>

            {/* Collateral Status */}
            <div>
              <label className="font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                3. Security / Collateral Pledged
              </label>
              <select
                value={params.collateralType}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    collateralType: e.target.value as any,
                    hasCollateral: e.target.value !== 'none',
                  }))
                }
                className="w-full p-2 text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-brand-500"
              >
                <option value="none">None / Nil (Unsecured up to ₹7.5L)</option>
                <option value="property">Immovable Real Estate (House / Flat)</option>
                <option value="liquid">Liquid Assets (Fixed Deposit / LIC)</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {params.estimatedLoanAmount <= 750000
                  ? 'Exempted under RBI / CGFSEL guidelines'
                  : 'Mandatory for loans above ₹7.5 Lakhs'}
              </span>
            </div>

            {/* Application Portal */}
            <div>
              <label className="font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                4. Application Channel
              </label>
              <select
                value={params.applyingThroughVidyaLakshmi ? 'portal' : 'branch'}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    applyingThroughVidyaLakshmi: e.target.value === 'portal',
                  }))
                }
                className="w-full p-2 text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-brand-500"
              >
                <option value="portal">Vidya Lakshmi / PM-Vidyalaxmi</option>
                <option value="branch">Direct Bank Branch Application</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {params.applyingThroughVidyaLakshmi
                  ? 'Requires CELFS standard application form'
                  : 'Requires physical bank specific loan forms'}
              </span>
            </div>

            {/* Degree Program */}
            <div>
              <label className="font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                5. Degree Program at VIT
              </label>
              <select
                value={params.degreeLevel}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    degreeLevel: e.target.value as any,
                  }))
                }
                className="w-full p-2 text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-brand-500"
              >
                <option value="Undergraduate">Undergraduate (B.Tech 4-Yr)</option>
                <option value="Postgraduate">Postgraduate (M.Tech / MCA / MBA)</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {params.degreeLevel === 'Undergraduate'
                  ? 'Class 10 & 12 board marksheets'
                  : 'College graduation marksheets required'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Readiness Score & Progress Dashboard */}
      <Card className="border-2 border-brand-200 shadow-sm bg-gradient-to-r from-slate-900 to-brand-950 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold uppercase tracking-wider text-brand-200">
                  Dossier Readiness Score
                </span>
                {readiness.isReady ? (
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 100% Branch Ready
                  </span>
                ) : (
                  <span className="text-sm text-brand-300 font-medium">
                    {readiness.totalRequired - readiness.completedCount} required documents pending
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                {readiness.completedCount} of {readiness.totalRequired} Mandatory Documents Ready
              </h3>
              <p className="text-sm text-brand-100/80 max-w-xl leading-relaxed">
                {readiness.isReady
                  ? 'All mandatory requirements for your loan tier are checked! Proceed to print your physical dossier prep pack or export to CSV.'
                  : 'Gather the required items below. Keep original documents ready for bank officer verification and 2 self-attested photocopies.'}
              </p>
            </div>

            {/* Circular / Progress Indicator */}
            <div className="flex flex-col items-center md:items-end justify-center shrink-0">
              <div className="text-3xl font-extrabold text-white">
                {readiness.percentage}%
              </div>
              <div className="w-44 h-2.5 bg-brand-900/80 rounded-full mt-2 overflow-hidden border border-brand-700/50">
                <div
                  className={`h-full transition-all duration-300 ${
                    readiness.percentage === 100
                      ? 'bg-emerald-400'
                      : readiness.percentage >= 60
                      ? 'bg-brand-400'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${readiness.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="mt-6 pt-4 border-t border-brand-800/60 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCsv}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download CSV Checklist
              </Button>
              {onNavigateToPrepPack && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateToPrepPack}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
                >
                  <Printer className="h-3.5 w-3.5 mr-1.5" />
                  View Printable Prep Pack
                </Button>
              )}
            </div>

            {readiness.completedCount > 0 && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Checkmarks
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PARTITIONED CHECKLIST SECTIONS */}
      {loading || !checklist ? (
        <div className="py-16 text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Generating personalized document checklist...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* SECTION 1: MANDATORY REQUIRED DOCUMENTS */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-emerald-50/60 border-b border-emerald-100 py-3.5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <CardTitle className="text-base font-bold text-emerald-950">
                  Mandatory Required Documents ({checklist.requiredDocuments.length})
                </CardTitle>
              </div>
              <Badge variant="verified" size="sm">
                Compulsory for Credit Appraisal
              </Badge>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-slate-100 text-sm">
              {checklist.requiredDocuments.map((doc) => {
                const isChecked = Boolean(checkedIds[doc._id]);
                return (
                  <div
                    key={doc._id}
                    onClick={() => toggleCheck(doc._id)}
                    className={`p-4 transition-colors cursor-pointer flex items-start gap-3.5 hover:bg-slate-50/80 ${
                      isChecked ? 'bg-slate-50/40' : 'bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-brand-700 focus:outline-none shrink-0"
                    >
                      {isChecked ? (
                        <CheckSquare className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-300" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`text-base font-semibold ${
                            isChecked ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {doc.name}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {doc.issuingAuthority}
                        </span>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed">{doc.description}</p>

                      <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Tip: {doc.verificationTip}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* SECTION 2: CONDITIONAL / OPTIONAL DOCUMENTS */}
          {checklist.optionalDocuments.length > 0 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-700" />
                  <CardTitle className="text-base font-bold text-slate-900">
                    Conditional / Optional Documents ({checklist.optionalDocuments.length})
                  </CardTitle>
                </div>
                <Badge variant="neutral" size="sm">
                  Case-Specific
                </Badge>
              </CardHeader>

              <CardContent className="p-0 divide-y divide-slate-100 text-sm">
                {checklist.optionalDocuments.map((doc) => {
                  const isChecked = Boolean(checkedIds[doc._id]);
                  return (
                    <div
                      key={doc._id}
                      onClick={() => toggleCheck(doc._id)}
                      className="p-4 transition-colors cursor-pointer flex items-start gap-3.5 hover:bg-slate-50/80"
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-brand-700 focus:outline-none shrink-0"
                      >
                        {isChecked ? (
                          <CheckSquare className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <Square className="h-5 w-5 text-slate-300" />
                        )}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span
                            className={`text-base font-semibold ${
                              isChecked ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {doc.name}
                          </span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {doc.issuingAuthority}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{doc.description}</p>
                        <p className="text-slate-500 text-xs">
                          <strong>Applicability:</strong> {doc.applicableCondition}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* SECTION 3: EXEMPTED / NOT APPLICABLE FOR YOUR PROFILE */}
          {checklist.notApplicableDocuments.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/60 shadow-sm">
              <button
                type="button"
                onClick={() => setShowNotApplicable(!showNotApplicable)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-bold text-slate-800">
                    Exempted / Not Applicable Documents ({checklist.notApplicableDocuments.length})
                  </span>
                  <span className="text-xs text-slate-500">
                    — Documents not required for your selected profile
                  </span>
                </div>
                {showNotApplicable ? (
                  <ChevronUp className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                )}
              </button>

              {showNotApplicable && (
                <div className="p-4 pt-0 border-t border-slate-200 space-y-2 text-sm">
                  <p className="text-xs text-slate-500 mb-3 pt-2">
                    Based on your loan parameters ({formatCurrency(params.estimatedLoanAmount)},{' '}
                    {params.coApplicantType} co-borrower), you do not need to provide the following items:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {checklist.notApplicableDocuments.map((doc) => (
                      <div
                        key={doc._id}
                        className="p-3 rounded-lg bg-white border border-slate-200 space-y-1 text-slate-500"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700">{doc.name}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Exempted
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{doc.applicableCondition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Statutory Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 text-sm flex items-start gap-3">
            <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed space-y-1">
              <span className="font-bold">Important Statutory Clarification</span>
              <p className="text-blue-900/90">{checklist.disclaimer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
