import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Building2,
  Plus,
  Trash2,
  Edit,
  ArrowRight,
  History,
  CheckCircle2,
  Clock,
  IndianRupee,
} from 'lucide-react';
import { StudentApplicationItem, ApplicationStage, BankVisitLogItem } from '@/types';
import { applicationService } from '@/services/applicationService';
import {
  ApplicationStageStepper,
  BankVisitLogManager,
  ApplicationFormModal,
} from '@/components/tracker';
import { Card } from '@/components/ui/Card';
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
    if (window.confirm('Are you sure you want to remove this application?')) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12 pt-8">
      {/* Minimal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
          Application Tracker
        </h1>
        <Button
          onClick={() => {
            setEditingApp(null);
            setIsModalOpen(true);
          }}
          className="bg-brand-700 hover:bg-brand-800 text-white flex items-center gap-2 shadow-sm"
        >
          <Plus className="h-4 w-4" /> New Application
        </Button>
      </div>

      {/* Applications Tabs Switcher */}
      {applications.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {applications.map((app) => {
            const isActive = app._id === activeApp?._id;
            return (
              <button
                key={app._id}
                onClick={() => {
                  setActiveAppId(app._id);
                  setSearchParams({ id: app._id });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-transparent border-b-slate-200'
                }`}
              >
                <Building2 className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {app.targetBankName}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      {!activeApp ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">No Active Applications</h3>
          <p className="text-slate-500 mb-6">Start tracking your loan progress easily.</p>
          <Button
            onClick={() => {
              setEditingApp(null);
              setIsModalOpen(true);
            }}
            className="bg-brand-700 hover:bg-brand-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Track First Loan
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Minimal Active App Card */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-heading font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-brand-700" />
                  {activeApp.targetBankName}
                </h2>
                <div className="text-slate-500 mt-1 font-medium">
                  {activeApp.targetSchemeName} • {activeApp.degreeProgram} ({activeApp.admissionYear})
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">Amount</div>
                  <div className="text-xl font-black text-brand-700">{formatCurrency(activeApp.requestedAmount)}</div>
                </div>
                <div className="flex gap-2 border-l border-slate-200 pl-4">
                  <Button variant="outline" size="sm" onClick={() => { setEditingApp(activeApp); setIsModalOpen(true); }}>
                    <Edit className="h-4 w-4 text-slate-600" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteApplication(activeApp._id)}>
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Stepper Only */}
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <ApplicationStageStepper currentStage={activeApp.status} onSelectStage={handleStageChange} />
            </div>
          </Card>

          {/* Simple Logs Section */}
          <BankVisitLogManager logs={activeApp.bankVisitLogs || []} onAddLog={handleAddVisitLog} />
        </div>
      )}

      {/* Loan & Repayment History Section */}
      <div className="mt-12 pt-10 border-t border-slate-200">
        <div className="flex items-center gap-2 mb-6">
          <History className="h-6 w-6 text-slate-700" />
          <h2 className="text-2xl font-heading font-bold text-slate-900">Loan & Repayment History</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Example Hardcoded Historic Record (for demonstration purposes as requested) */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">State Bank of India</h3>
                  <p className="text-sm text-slate-500">SBI Scholar Scheme • B.Tech (2022)</p>
                </div>
                <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-none">Disbursed</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500 flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5"/> Total Loan Taken</span>
                  <span className="font-bold text-slate-900">₹7,50,000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500 flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500"/> Repaid Amount</span>
                  <span className="font-bold text-emerald-600">₹1,20,000</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-500 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-orange-400"/> Next EMI Due</span>
                  <div className="text-right">
                    <span className="block font-bold text-slate-900">₹15,400</span>
                    <span className="text-xs text-orange-500 font-medium">Due in 14 Days</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-3 border-t border-slate-100 text-center">
              <button className="text-sm font-semibold text-brand-600 hover:text-brand-800 flex items-center justify-center gap-1 w-full">
                View Full Ledger <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </Card>

          {/* Empty State / Add New Record */}
          <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="h-12 w-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="font-heading font-bold text-slate-700">Link Historic Loan</h3>
            <p className="text-sm text-slate-500 max-w-[200px] mt-1">
              Add a previously disbursed loan to track repayments and EMIs.
            </p>
          </Card>
        </div>
      </div>

      <ApplicationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveApplication}
        initialData={editingApp}
      />
    </div>
  );
};

