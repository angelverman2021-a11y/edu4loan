import React, { useState } from 'react';
import { X, Building2, BookOpen, IndianRupee, FileText, Calendar, CheckCircle2 } from 'lucide-react';
import { StudentApplicationItem, ApplicationStage } from '@/types';
import { Button } from '@/components/ui/Button';

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (app: Partial<StudentApplicationItem>) => void;
  initialData?: StudentApplicationItem | null;
}

const COMMON_BANKS = [
  'State Bank of India',
  'Indian Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'Central Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
];

const DEGREE_PROGRAMS = [
  'B.Tech - Computer Science & Engineering',
  'B.Tech - Artificial Intelligence & Data Science',
  'B.Tech - Electronics & Communication Engineering',
  'B.Tech - Mechanical Engineering',
  'B.Tech - Electrical & Electronics Engineering',
  'Integrated M.Tech / MCA',
  'Other Degree Program',
];

export const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [bankName, setBankName] = useState<string>(
    initialData?.targetBankName || COMMON_BANKS[0]
  );
  const [customBank, setCustomBank] = useState<string>('');
  const [schemeName, setSchemeName] = useState<string>(
    initialData?.targetSchemeName || 'SBI Scholar Scheme'
  );
  const [requestedAmount, setRequestedAmount] = useState<number>(
    initialData?.requestedAmount || 1200000
  );
  const [status, setStatus] = useState<ApplicationStage>(
    initialData?.status || 'draft'
  );
  const [degreeProgram, setDegreeProgram] = useState<string>(
    initialData?.degreeProgram || DEGREE_PROGRAMS[0]
  );
  const [admissionYear, setAdmissionYear] = useState<number>(
    initialData?.admissionYear || 2026
  );
  const [vlpId, setVlpId] = useState<string>(
    initialData?.vidyaLakshmiApplicationId || ''
  );
  const [notes, setNotes] = useState<string>(initialData?.notes || '');
  const [nextAction, setNextAction] = useState<string>(
    initialData?.nextAction || 'Prepare documents for initial branch submission'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveBank = bankName === 'Other' ? (customBank.trim() || 'Custom Bank') : bankName;

    onSubmit({
      targetBankName: effectiveBank,
      targetSchemeName: schemeName.trim() || 'Education Loan Scheme',
      requestedAmount: Number(requestedAmount) || 0,
      status,
      degreeProgram,
      admissionYear: Number(admissionYear) || 2026,
      vidyaLakshmiApplicationId: vlpId.trim() || undefined,
      notes: notes.trim(),
      nextAction: nextAction.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {initialData ? 'Edit Loan Application Tracker' : 'Track New Loan Application'}
            </h3>
            <p className="text-sm text-slate-500">
              Record your education loan submission to track milestones and branch commitments.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {/* Bank Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Target Bank *
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
              >
                {COMMON_BANKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option value="Other">Other Bank...</option>
              </select>
            </div>

            {bankName === 'Other' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Specify Bank Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bank of Maharashtra"
                  value={customBank}
                  onChange={(e) => setCustomBank(e.target.value)}
                  className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
                />
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Scheme Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SBI Scholar Scheme, Baroda Vidya"
                value={schemeName}
                onChange={(e) => setSchemeName(e.target.value)}
                className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Amount & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Requested Loan Amount (₹) *
              </label>
              <input
                type="number"
                required
                min={50000}
                max={15000000}
                step={10000}
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(Number(e.target.value))}
                className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Current Pipeline Stage *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStage)}
                className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white font-medium"
              >
                <option value="draft">1. Draft Application</option>
                <option value="submitted">2. Submitted to Portal / Branch</option>
                <option value="documents_required">3. Documents Required / Clarifications</option>
                <option value="under_review">4. Credit Appraisal Under Review</option>
                <option value="bank_verification">5. Branch Verification (OSV)</option>
                <option value="sanctioned">6. Loan Sanctioned</option>
                <option value="disbursed">7. Disbursed to VIT Bhopal</option>
                <option value="rejected">Rejected by Bank</option>
              </select>
            </div>
          </div>

          {/* Degree & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Degree Program *
              </label>
              <select
                value={degreeProgram}
                onChange={(e) => setDegreeProgram(e.target.value)}
                className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
              >
                {DEGREE_PROGRAMS.map((dp) => (
                  <option key={dp} value={dp}>
                    {dp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Admission Year *
              </label>
              <input
                type="number"
                min={2022}
                max={2030}
                value={admissionYear}
                onChange={(e) => setAdmissionYear(Number(e.target.value))}
                className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Vidya Lakshmi Portal ID */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Vidya Lakshmi Portal CELFS ID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. CELFS-2026-VITB-0982"
              value={vlpId}
              onChange={(e) => setVlpId(e.target.value)}
              className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Found on your Vidya Lakshmi Portal application dashboard after CELFS form submission.
            </p>
          </div>

          {/* Immediate Next Action */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Immediate Next Action Item
            </label>
            <input
              type="text"
              placeholder="e.g. Submit original 10th/12th marksheets for OSV on Tuesday"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Internal Notes & Specific Branch Observations
            </label>
            <textarea
              rows={3}
              placeholder="Notes on margin money discussion, co-borrower documents, or interest concessions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-white"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-brand-700 hover:bg-brand-800 text-white font-medium shadow-sm"
            >
              {initialData ? 'Save Changes' : 'Create Application Tracker'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
