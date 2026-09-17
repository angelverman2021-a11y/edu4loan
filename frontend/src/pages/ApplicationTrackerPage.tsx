import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  FileCheck2,
  FileQuestion,
  HelpCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { StudentApplicationItem, ApplicationStage, BankVisitLogItem } from '@/types';
import { applicationService } from '@/services/applicationService';
import {
  ApplicationStageStepper,
  BankVisitLogManager,
  ApplicationFormModal,
} from '@/components/tracker';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const ApplicationTrackerPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState<StudentApplicationItem[]>([]);
  const [activeAppId, setActiveAppId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingApp, setEditingApp] = useState<StudentApplicationItem | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await applicationService.fetchMyApplications();
      setApplications(data);
      if (data.length > 0) {
        const queryId = searchParams.get('id');
        const found = data.find((a) => a._id === queryId);
        setActiveAppId(found ? found._id : data[0]._id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const activeApp = applications.find((a) => a._id === activeAppId) || applications[0] || null;

  const handleStageChange = async (newStage: ApplicationStage) => {
    if (!activeApp) return;
    const updated = await applicationService.updateApplication(activeApp._id, {
      status: newStage,
    });
    setApplications((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
  };

  const handleSaveApplication = async (data: Partial<StudentApplicationItem>) => {
    if (editingApp) {
      const updated = await applicationService.updateApplication(editingApp._id, data);
      setApplications((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
      setEditingApp(null);
    } else {
      const created = await applicationService.createApplication(data);
      setApplications((prev) => [created, ...prev]);
      setActiveAppId(created._id);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this application from your tracker?')) {
      await applicationService.deleteApplication(id);
      const remaining = applications.filter((a) => a._id !== id);
      setApplications(remaining);
      if (remaining.length > 0) {
        setActiveAppId(remaining[0]._id);
      } else {
        setActiveAppId('');
      }
    }
  };

  const handleAddVisitLog = async (visit: Omit<BankVisitLogItem, 'id' | '_id'>) => {
    if (!activeApp) return;
    const newLog = await applicationService.addBankVisitLog(activeApp._id, visit);
    setApplications((prev) =>
      prev.map((a) => {
        if (a._id === activeApp._id) {
          return {
            ...a,
            bankVisitLogs: [newLog, ...(a.bankVisitLogs || [])],
            nextAction: visit.followUpDate
              ? `Follow-up with ${visit.branchName} on ${visit.followUpDate}`
              : a.nextAction,
          };
        }
        return a;
      })
    );
  };

  // Stage details and actionable advice
  const getStageGuidance = (stage: ApplicationStage) => {
    switch (stage) {
      case 'draft':
        return {
          title: 'Stage 1: Assembling Dossier & Scheme Selection',
          guidance:
            'You are currently preparing required documents and confirming scheme terms. Ensure you have your VIT Bhopal Bonafide Fee Structure letter stamped by the campus finance office.',
          nextSteps: [
            'Generate your personalized checklist in Document Dossier',
            'Cross-check 10th & 12th original marksheets and entrance exam rank card',
            'Obtain salary slips (last 3 months) or ITR (2 years) from your co-borrower',
          ],
        };
      case 'submitted':
        return {
          title: 'Stage 2: Submitted to Vidya Lakshmi / Bank Portal',
          guidance:
            'Your application has been lodged online. Keep your Vidya Lakshmi CELFS application number safe. Banks typically acknowledge receipt within 3–5 working days.',
          nextSteps: [
            'Monitor email and SMS for branch allocation notification',
            'Note down the allocated processing branch and branch code',
            'Print 2 hard copies of the CELFS application form',
          ],
        };
      case 'documents_required':
        return {
          title: 'Stage 3: Additional Documentation Required',
          guidance:
            'The loan underwriting desk or branch manager has flagged missing or supplementary paperwork. Resolving this quickly prevents application expiry.',
          nextSteps: [
            'Contact the branch officer or check portal comments for the exact list',
            'Common requests: Form 16 Part A & B, Electricity bill in co-borrower name, Stamped Fee letter',
            'Upload or hand-deliver documents directly to the branch loan desk',
          ],
        };
      case 'under_review':
        return {
          title: 'Stage 4: Credit Appraisal & CIBIL Assessment',
          guidance:
            'The bank credit team is assessing repayment capacity, co-borrower credit score (CIBIL > 700 recommended), and course employability parameters.',
          nextSteps: [
            'Avoid new loan inquiries or credit card defaults during this window',
            'Keep co-borrower reachable via phone for telephonic verification (CPV)',
            'Check CGFSEL or CGCEF guarantee eligibility if loan is between ₹4L and ₹7.5L',
          ],
        };
      case 'bank_verification':
        return {
          title: 'Stage 5: Original Document Sighting (OSV) & Residence Verification',
          guidance:
            'The branch requires physical verification of original academic marksheets and may dispatch a field executive for co-borrower residential address check.',
          nextSteps: [
            'Carry original 10th, 12th marksheets, PAN, and Aadhaar to the branch',
            'Ensure all photocopies are self-attested by student and co-borrower',
            'Confirm branch manager signs and stamps OSV (Original Sighted & Verified)',
          ],
        };
      case 'sanctioned':
        return {
          title: 'Stage 6: In-Principle Sanction Letter Issued',
          guidance:
            'Congratulations! The bank has officially approved your education loan. Carefully examine the terms before signing the agreement.',
          nextSteps: [
            'Verify sanctioned loan quantum against your 4-year tuition + hostel estimate',
            'Review interest spread (Repo Rate + Spread) and moratorium terms',
            'Submit sanction letter copy to VIT Bhopal Admissions/Finance Office if required for fee deferral',
          ],
        };
      case 'disbursed':
        return {
          title: 'Stage 7: Loan Disbursed to VIT Bhopal',
          guidance:
            'Funds have been remitted directly to the VIT Bhopal University institutional bank account via Demand Draft (DD) or RTGS.',
          nextSteps: [
            'Collect UTR number / DD copy from the branch',
            'Submit disbursement proof to VIT Bhopal Finance Counter for official fee receipt generation',
            'Preserve all semester payment receipts for interest subvention and Section 80E claims',
          ],
        };
      case 'rejected':
        return {
          title: 'Application Rejected / Non-Sanctioned',
          guidance:
            'The branch was unable to sanction this loan. Indian Banks Association (IBA) norms mandate that rejections must be accompanied by written reasons.',
          nextSteps: [
            'Request a formal written rejection letter from the branch manager citing reasons',
            'Check if rejection was due to CIBIL score, jurisdiction, or document discrepancy',
            'Apply to your 2nd or 3rd chosen bank on Vidya Lakshmi Portal',
          ],
        };
      default:
        return {
          title: 'Stage Pipeline In Progress',
          guidance:
            'Your application is active in the student loan pipeline. Keep your documents ready and follow up with the assigned bank branch.',
          nextSteps: [
            'Maintain contact with branch loan processing officer',
            'Ensure all original documents are readily accessible for verification',
          ],
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="info" size="sm">
              Phase 10 — Module 16
            </Badge>
            <span className="text-xs text-slate-500 font-medium">
              Student Application Pipeline
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Education Loan Application Tracker
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl mt-1">
            Maintain complete transparency over your loan applications across banks and Vidya Lakshmi
            Portal. Track stage milestones, OSV visits, and branch follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              setEditingApp(null);
              setIsModalOpen(true);
            }}
            className="bg-brand-700 hover:bg-brand-800 text-white flex items-center gap-1.5 shadow-sm text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Track New Application</span>
          </Button>
        </div>
      </div>

      {/* Applications Tabs Switcher */}
      {applications.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
            Applications:
          </span>
          {applications.map((app) => {
            const isActive = app._id === activeApp?._id;
            return (
              <button
                key={app._id}
                onClick={() => {
                  setActiveAppId(app._id);
                  setSearchParams({ id: app._id });
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-50 border-brand-300 text-brand-900 shadow-sm ring-1 ring-brand-300 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building2
                  className={`h-3.5 w-3.5 ${isActive ? 'text-brand-700' : 'text-slate-400'}`}
                />
                <span>{app.targetBankName}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    app.status === 'sanctioned' || app.status === 'disbursed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : app.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {app.status.replace('_', ' ')}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      {!activeApp ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-4">
          <Building2 className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Applications Tracked Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Add your education loan application details to start tracking branch follow-ups,
            document submissions, and milestone progression.
          </p>
          <Button
            onClick={() => {
              setEditingApp(null);
              setIsModalOpen(true);
            }}
            className="bg-brand-700 hover:bg-brand-800 text-white text-xs inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Track First Application
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Application Header Card */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-brand-700" />
                    {activeApp.targetBankName}
                  </h2>
                  <span className="text-xs font-semibold text-slate-500">
                    — {activeApp.targetSchemeName}
                  </span>
                  {activeApp.vidyaLakshmiApplicationId && (
                    <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
                      VLP: {activeApp.vidyaLakshmiApplicationId}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>{activeApp.degreeProgram}</span>
                  <span>•</span>
                  <span>Admitted Year: {activeApp.admissionYear}</span>
                  <span>•</span>
                  <span>Updated {new Date(activeApp.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                    Requested Quantum
                  </span>
                  <span className="text-lg font-black text-brand-700">
                    {formatCurrency(activeApp.requestedAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingApp(activeApp);
                      setIsModalOpen(true);
                    }}
                    className="text-xs p-2 text-slate-600 hover:text-slate-900"
                    title="Edit Details"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteApplication(activeApp._id)}
                    className="text-xs p-2 text-rose-600 hover:text-rose-800 hover:border-rose-300"
                    title="Delete Entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Stepper Pipeline */}
            <div className="p-5 border-b border-slate-100 bg-white">
              <ApplicationStageStepper
                currentStage={activeApp.status}
                onSelectStage={handleStageChange}
              />
              <div className="mt-3 text-right">
                <span className="text-[10px] text-slate-400">
                  Tip: Click on any stage circle above to update your active progress.
                </span>
              </div>
            </div>

            {/* Stage Guidance & Next Action Box */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/30">
              <div className="md:col-span-2 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-brand-700" />
                  {getStageGuidance(activeApp.status).title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {getStageGuidance(activeApp.status).guidance}
                </p>

                <div className="mt-3 space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    Recommended Checklist for this stage:
                  </span>
                  <ul className="space-y-1">
                    {getStageGuidance(activeApp.status).nextSteps.map((step, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-600 flex items-start gap-2"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Immediate Next Action & Shortcuts */}
              <div className="p-4 rounded-xl border border-brand-100 bg-brand-50/30 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-brand-800 uppercase tracking-wider block mb-1">
                    Current Priority Action
                  </span>
                  <p className="text-xs font-medium text-slate-800 leading-snug">
                    {activeApp.nextAction || 'Visit branch for initial document submission.'}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-brand-100/60">
                  <Link
                    to="/documents"
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-brand-200 text-xs font-semibold text-brand-800 hover:bg-brand-50 transition-colors shadow-2xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileCheck2 className="h-3.5 w-3.5 text-brand-700" />
                      Document Dossier
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                  </Link>

                  <Link
                    to="/vit-bhopal"
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-slate-500" />
                      VIT Fee & Desk SOP
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Bank Interaction & OSV Log Manager */}
          <BankVisitLogManager
            logs={activeApp.bankVisitLogs || []}
            onAddLog={handleAddVisitLog}
          />
        </div>
      )}

      {/* Statutory Guidance / Non-Brokering Notice */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-700 block">
            Independent Student Self-Tracking Notice
          </span>
          <p className="text-[11px] leading-relaxed">
            Edu4Loan is an informational tracking utility engineered to assist VIT Bhopal students in
            organizing their education loan paperwork and bank branch commitments. Edu4Loan does not
            act as a loan agent, broker, direct selling agent (DSA), or underwriter. Application
            appraisal, sanctioning, interest concession decisions, and disbursement remain exclusively
            at the discretion of the respective lending institutions under RBI and IBA guidelines.
          </p>
        </div>
      </div>

      {/* Modal for Creating / Editing Application */}
      <ApplicationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveApplication}
        initialData={editingApp}
      />
    </div>
  );
};
