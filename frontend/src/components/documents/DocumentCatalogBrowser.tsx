import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  FileText,
  Building2,
  ExternalLink,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { documentService } from '@/services/documentService';
import { DocumentModelItem } from '@/types';

export const DocumentCatalogBrowser: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentModelItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Documents' },
    { key: 'student_kyc', label: 'Student Identity (KYC)' },
    { key: 'academic_records', label: 'Academic Records' },
    { key: 'vit_bhopal_admission', label: 'VIT Bhopal Admission' },
    { key: 'coapplicant_kyc', label: 'Co-Applicant KYC' },
    { key: 'coapplicant_income_salaried', label: 'Income: Salaried' },
    { key: 'coapplicant_income_selfemployed', label: 'Income: Self-Employed' },
    { key: 'collateral_property', label: 'Collateral Property' },
    { key: 'bank_specific_forms', label: 'Bank & Portal Forms' },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setLoading(true);
      const res = await documentService.fetchDocuments();
      if (isMounted) {
        setDocuments(res.documents);
        setLoading(false);
      }
    };
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchCat = selectedCategory === 'all' || doc.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.issuingAuthority.toLowerCase().includes(q) ||
        doc.verificationTip.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [documents, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 text-sm">
      {/* Search & Category Filter Rail */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by document name, issuing authority, or verification keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Loading master document catalog...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <FileText className="h-8 w-8 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No matching documents found</h4>
          <p className="text-slate-500">Try adjusting your keyword search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <Card
              key={doc._id}
              className="border-slate-200 hover:border-brand-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <CardHeader className="pb-2.5">
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant={doc.isRequired ? 'verified' : 'neutral'}
                    size="sm"
                  >
                    {doc.isRequired ? 'Compulsory' : 'Conditional'}
                  </Badge>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {doc.issuingAuthority}
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                  {doc.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-slate-600 text-sm leading-relaxed">{doc.description}</p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="p-2 rounded bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <span className="font-bold text-slate-800 block mb-0.5">Applicability:</span>
                    <span>{doc.applicableCondition}</span>
                  </div>

                  <div className="p-2 rounded bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900">
                    <span className="font-bold flex items-center gap-1 text-emerald-800 mb-0.5">
                      <CheckCircle2 className="h-3 w-3" /> Verification Tip:
                    </span>
                    <span>{doc.verificationTip}</span>
                  </div>

                  {/* Provenance Badge */}
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span>Source: {doc.source?.source || 'Official Circular'}</span>
                    {doc.source?.sourceUrl && (
                      <a
                        href={doc.source.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-brand-700 hover:underline"
                      >
                        <span>Verify Circular</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
