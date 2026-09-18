import React, { useState } from 'react';
import {
  Calendar,
  Building2,
  User,
  Clock,
  Plus,
  CheckCircle2,
  FileText,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BankVisitLogItem } from '@/types';

interface BankVisitLogManagerProps {
  logs: BankVisitLogItem[];
  onAddLog: (log: Omit<BankVisitLogItem, 'id' | '_id'>) => void;
}

export const BankVisitLogManager: React.FC<BankVisitLogManagerProps> = ({ logs, onAddLog }) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [branchName, setBranchName] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [officerName, setOfficerName] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [discussion, setDiscussion] = useState<string>('');
  const [pendingTasks, setPendingTasks] = useState<string>('');
  const [followUpDate, setFollowUpDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim() || !discussion.trim()) return;

    const pendingArray = pendingTasks
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAddLog({
      date,
      branchName: branchName.trim(),
      officerContactName: officerName.trim() || undefined,
      officerDesignation: designation.trim() || undefined,
      discussionSummary: discussion.trim(),
      pendingRequirementsGiven: pendingArray,
      followUpDate: followUpDate || undefined,
    });

    // Reset form
    setBranchName('');
    setOfficerName('');
    setDesignation('');
    setDiscussion('');
    setPendingTasks('');
    setFollowUpDate('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-base">Bank Branch Visit & Follow-Up Logs</h4>
          <p className="text-slate-500 text-xs">
            Keep a clear record of in-person interactions with loan officers and branch commitments.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-700 hover:bg-brand-800 text-white text-sm flex items-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{showAddForm ? 'Cancel' : 'Log New Visit'}</span>
        </Button>
      </div>

      {/* Add New Visit Form */}
      {showAddForm && (
        <Card className="border-brand-200 bg-brand-50/20 shadow-sm">
          <CardHeader className="py-3 border-b border-brand-100">
            <CardTitle className="text-sm font-bold text-slate-900">
              Record Branch Visit / Meeting
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Date of Visit *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Bank Branch Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SBI Ashta Branch or Indian Bank Campus Branch"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Officer Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. R. K. Sharma"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Designation (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chief Manager (Credit) / Loan Officer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Discussion Summary & Commitments *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Key points discussed: interest rate confirmation, margin money requirements, collateral valuation status..."
                  value={discussion}
                  onChange={(e) => setDiscussion(e.target.value)}
                  className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Pending Tasks Given by Bank (One per line)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Bring stamped fee structure&#10;Parent IT return acknowledgement"
                    value={pendingTasks}
                    onChange={(e) => setPendingTasks(e.target.value)}
                    className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Next Follow-Up Date (If Committed)
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-brand-700 text-white">
                  Save Visit Record
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Visit Logs List */}
      {logs.length === 0 ? (
        <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <Calendar className="h-6 w-6 text-slate-400 mx-auto" />
          <p className="text-slate-600 font-medium">No branch visits recorded yet.</p>
          <p className="text-slate-400 text-xs">
            Record your interactions after meeting loan officers to keep bank commitments documented.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log, idx) => (
            <div
              key={log._id || log.id || idx}
              className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-brand-700" />
                    {log.branchName}
                  </span>
                  {log.officerContactName && (
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      • <User className="h-3 w-3" /> {log.officerContactName}
                      {log.officerDesignation && ` (${log.officerDesignation})`}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{log.date}</span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-xs">
                {log.discussionSummary}
              </p>

              {log.pendingRequirementsGiven && log.pendingRequirementsGiven.length > 0 && (
                <div className="p-2.5 rounded bg-amber-50/70 border border-amber-200 text-amber-950 text-xs space-y-1">
                  <span className="font-bold flex items-center gap-1 text-amber-900">
                    <AlertCircle className="h-3 w-3 text-amber-700" />
                    Pending Action Items:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                    {log.pendingRequirementsGiven.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {log.followUpDate && (
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-brand-700 font-semibold flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Next Follow-Up: {log.followUpDate}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
