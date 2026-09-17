import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  FileCheck2,
  Building2,
  Calculator,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
  AlertCircle,
  CheckCircle2,
  Landmark,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import {
  StudentApplicationItem,
  DashboardSummary,
  ApplicationStage,
} from '@/types';
import { applicationService } from '@/services/applicationService';
import { documentService } from '@/services/documentService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const DashboardPage: React.FC = () => {
  const [applications, setApplications] = useState<StudentApplicationItem[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [readinessScore, setReadinessScore] = useState<number>(75);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const apps = await applicationService.fetchMyApplications();
        setApplications(apps);
        const summ = applicationService.getDashboardSummary(apps);

        // Fetch dynamic document readiness if available
        try {
          const checklist = await documentService.fetchPersonalizedChecklist({
            estimatedLoanAmount: 1200000,
            coApplicantType: 'salaried',
            hasCollateral: false,
            collateralType: 'none',
            applyingThroughVidyaLakshmi: true,
            degreeLevel: 'Undergraduate',
          });
          const checkedState = documentService.getSavedCheckedState();
          const readiness = documentService.calculateReadinessScore(
            checklist.requiredDocuments,
            checkedState
          );
          setReadinessScore(readiness.percentage);
          summ.documentReadinessPercent = readiness.percentage;
        } catch {
          // keep fallback
        }

        setSummary(summ);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getStageBadge = (stage: ApplicationStage) => {
    switch (stage) {
      case 'sanctioned':
      case 'disbursed':
        return <Badge variant="verified">{stage.replace('_', ' ').toUpperCase()}</Badge>;
      case 'rejected':
        return <Badge variant="error">REJECTED</Badge>;
      case 'bank_verification':
      case 'under_review':
        return <Badge variant="advisory">{stage.replace('_', ' ').toUpperCase()}</Badge>;
      default:
        return <Badge variant="neutral">{stage.replace('_', ' ').toUpperCase()}</Badge>;
    }
  };

  const getStageProgress = (stage: ApplicationStage): number => {
    const order: ApplicationStage[] = [
      'draft',
      'submitted',
      'documents_required',
      'under_review',
      'bank_verification',
      'sanctioned',
      'disbursed',
    ];
    const idx = order.indexOf(stage);
    if (idx === -1) return 0;
    return Math.round(((idx + 1) / order.length) * 100);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-brand-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-brand-700/80 text-brand-100 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase">
              Student Loan Command Center
            </span>
            <span className="text-brand-300 text-xs font-medium">VIT Bhopal Academic Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Edu4Loan Student Workspace
          </h1>
          <p className="text-xs sm:text-sm text-brand-100/80 leading-relaxed">
            Centralized hub for managing your bank loan applications, tracking branch verification
            milestones, monitoring document readiness, and keeping track of VIT Bhopal semester fee
            timelines.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 relative z-10">
          <Link
            to="/tracker"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-brand-900 text-xs font-bold shadow hover:bg-brand-50 transition-colors"
          >
            <Layers className="h-4 w-4 text-brand-700" />
            <span>Open Application Tracker</span>
          </Link>
          <Link
            to="/documents"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-800/80 hover:bg-brand-800 text-white text-xs font-semibold border border-brand-700 transition-colors"
          >
            <FileCheck2 className="h-4 w-4 text-brand-300" />
            <span>Document Dossier ({readinessScore}% Ready)</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Applications */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Tracked Applications
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {summary?.activeApplicationsCount || 0}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Active loan files
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Loan Quantum */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Quantum
              </span>
              <span className="text-xl sm:text-2xl font-black text-brand-800 mt-1 block">
                {formatCurrency(summary?.totalRequestedAmount || 0)}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Across tracked banks
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Landmark className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Document Readiness */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Dossier Readiness
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {readinessScore}%
              </span>
              <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">
                {readinessScore >= 80 ? 'Ready for Branch OSV' : 'Documents pending'}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileCheck2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Next Action / Follow-up */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Next Follow-Up
              </span>
              <span className="text-sm font-bold text-slate-900 mt-1 block truncate max-w-[130px]">
                {summary?.nextFollowUp ? summary.nextFollowUp.date : 'No pending date'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block truncate max-w-[130px]">
                {summary?.nextFollowUp ? summary.nextFollowUp.branchName : 'Keep logs updated'}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Active Applications & Next Follow-Up */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Active Applications Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-4 w-4 text-brand-700" />
                Active Loan Applications
              </h3>
              <p className="text-[11px] text-slate-500">
                Current status and stage progression across submitting banks.
              </p>
            </div>
            <Link
              to="/tracker"
              className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              <span>View All Pipeline</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {applications.length === 0 ? (
            <Card className="p-8 text-center border-slate-200 bg-white space-y-3">
              <Building2 className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-600 font-medium">
                No active education loan applications logged.
              </p>
              <Link
                to="/tracker"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Track a loan application
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const pct = getStageProgress(app.status);
                return (
                  <Card
                    key={app._id}
                    className="border-slate-200 bg-white hover:border-slate-300 shadow-2xs transition-all"
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-brand-700" />
                          <span className="font-bold text-slate-900 text-sm">
                            {app.targetBankName}
                          </span>
                          <span className="text-xs text-slate-500 hidden sm:inline">
                            — {app.targetSchemeName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStageBadge(app.status)}
                          <span className="font-bold text-brand-800 text-xs">
                            {formatCurrency(app.requestedAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                          <span>
                            Stage:{' '}
                            <strong className="text-slate-800 uppercase">
                              {app.status.replace('_', ' ')}
                            </strong>
                          </span>
                          <span>{pct}% Completed</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              app.status === 'rejected'
                                ? 'bg-rose-500'
                                : pct >= 80
                                ? 'bg-emerald-600'
                                : 'bg-brand-600'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* Immediate next action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-2 text-xs border-t border-slate-100">
                        <div className="text-slate-600 text-[11px] truncate max-w-md">
                          <strong className="text-slate-700">Next Action:</strong>{' '}
                          {app.nextAction || 'Continue document verification'}
                        </div>
                        <Link
                          to={`/tracker?id=${app._id}`}
                          className="text-brand-700 hover:text-brand-800 font-bold text-[11px] flex items-center gap-1 self-end sm:self-auto"
                        >
                          <span>Manage Logs</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Quick Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Schemes Comparison Shortcut */}
            <Card className="border-slate-200 bg-white hover:border-brand-300 transition-colors shadow-2xs">
              <CardContent className="p-4 space-y-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-xs">Scheme Comparison Engine</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Evaluate interest margins, collateral rules, and repayment terms across SBI,
                  Indian Bank, PNB, and Bank of Baroda.
                </p>
                <Link
                  to="/compare"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 pt-1"
                >
                  <span>Launch Comparison</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

            {/* Interest & EMI Simulator Shortcut */}
            <Card className="border-slate-200 bg-white hover:border-brand-300 transition-colors shadow-2xs">
              <CardContent className="p-4 space-y-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Calculator className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-xs">Moratorium EMI Calculator</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Simulate monthly EMI with simple interest accrual during the 4-year study period
                  and calculate Section 80E tax deductions.
                </p>
                <Link
                  to="/calculator?amount=1200000"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 pt-1"
                >
                  <span>Simulate ₹12L Loan</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column (1 Col): VIT Academic Timelines & Reminders */}
        <div className="space-y-4">
          {/* VIT Bhopal Academic Disbursement Alert */}
          <Card className="border-brand-200 bg-brand-50/20 shadow-2xs">
            <CardHeader className="py-3.5 border-b border-brand-100">
              <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-brand-800" />
                VIT Bhopal Disbursement Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-white border border-brand-100 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">Fall Semester Fee Window</span>
                    <span className="text-brand-700 font-bold">July 10 – July 25</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Apply for bank tranche DD/RTGS 20 business days in advance to avoid late
                    registration penalties.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-brand-100 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">Winter Semester Fee Window</span>
                    <span className="text-brand-700 font-bold">Dec 15 – Dec 30</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Submit preceding semester marksheet & Bonafide Demand Letter to processing branch.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-brand-100/60">
                <Link
                  to="/vit-bhopal"
                  className="w-full flex items-center justify-between text-xs font-bold text-brand-800 hover:text-brand-900"
                >
                  <span>View Campus Bank Desks & SOP</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Government Subvention Shortcut */}
          <Card className="border-slate-200 bg-white shadow-2xs">
            <CardHeader className="py-3.5 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Subsidy & Subvention Check
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Eligible students with parental income &le; ₹4.5L (CSIS) or &le; ₹8.0L (PM-Vidyalaxmi
                2024) qualify for statutory interest waivers during study.
              </p>
              <Link
                to="/govt-schemes?tab=checker"
                className="inline-flex items-center justify-center w-full py-2 px-3 rounded-lg bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors gap-1.5"
              >
                <span>Check Subvention Eligibility</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Compliance & Student Advisory */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
              Institutional Transparency
            </span>
            <p className="leading-normal">
              Edu4Loan provides analytical planning tools for educational financing. We maintain zero
              tie-ups with intermediaries and do not influence credit evaluation or loan sanctions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
