import React, { useState, useEffect } from 'react';
import { FileText, CheckSquare, Square, Download, ShieldCheck, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { api } from '@/services/api';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const res = await api.get<any[]>('/documents');
        setDocuments(res.data || []);
      } catch (err) {
        console.error('Failed to load documents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { key: 'academic', title: 'Academic & Admission Records' },
    { key: 'kyc_student', title: 'Student Identity & KYC' },
    { key: 'kyc_co_borrower', title: 'Co-Applicant Identity & KYC' },
    { key: 'income_salaried', title: 'Co-Borrower Income Proof' },
    { key: 'property_collateral', title: 'Collateral & Property Papers (If > ₹7.5L)' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="info">Phase 8 Checklist Engine</Badge>
          <Badge variant="verified">Bank Branch Ready</Badge>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <FileText className="h-8 w-8 text-brand-700 shrink-0" />
          <span>Education Loan Document Checklist</span>
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Comprehensive dossier checklist required by public and private banks. Mark items as completed as you assemble your loan application binder.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Loading document checklist catalog...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => {
            const catDocs = documents.filter((d) => d.category === cat.key);
            if (catDocs.length === 0) return null;

            return (
              <Card key={cat.key}>
                <CardHeader className="bg-slate-50/70 py-3.5">
                  <CardTitle className="text-sm font-semibold text-slate-800">
                    {cat.title} ({catDocs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-slate-100">
                  {catDocs.map((doc) => {
                    const isChecked = Boolean(checkedIds[doc._id]);
                    return (
                      <div
                        key={doc._id}
                        onClick={() => toggleCheck(doc._id)}
                        className="flex items-start gap-4 p-4 hover:bg-slate-50/50 cursor-pointer transition-colors"
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
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-medium ${
                                isChecked ? 'line-through text-slate-400' : 'text-slate-900'
                              }`}
                            >
                              {doc.documentName}
                            </span>
                            {doc.mandatory ? (
                              <Badge variant="error" size="sm">
                                Mandatory
                              </Badge>
                            ) : (
                              <Badge variant="neutral" size="sm">
                                Conditional
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{doc.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
