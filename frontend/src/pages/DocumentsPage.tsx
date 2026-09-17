import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Layers,
  GraduationCap,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import {
  PersonalizedChecklistGenerator,
  DocumentCatalogBrowser,
  VitBhopalDocGuide,
  DocumentPrepPack,
} from '@/components/documents';

export const DocumentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab: 'personalized' | 'catalog' | 'vitbhopal' | 'preppack'
  const activeTab = searchParams.get('tab') || 'personalized';
  const initialAmount = Number(searchParams.get('amount')) || 1200000;

  const setTab = (tab: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    setSearchParams(newParams, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">Modules 8 & 14 Document Engine</Badge>
          <VerifiedBadge status="verified" lastVerified="2026-09-01" size="sm" />
          <span className="text-xs text-slate-500 font-medium">Bank Branch Ready</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <FileText className="h-9 w-9 text-brand-700 shrink-0" />
          <span>Education Loan Document & Dossier Hub</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Generate a tailored document checklist matched to your loan quantum and co-borrower profile, explore the complete bank document taxonomy, review VIT Bhopal institutional certificate workflows, and organize your physical dossier binder.
        </p>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-sm font-semibold">
        <button
          onClick={() => setTab('personalized')}
          className={`px-5 py-3 rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'personalized'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Personalized Checklist (Module 14)</span>
        </button>

        <button
          onClick={() => setTab('catalog')}
          className={`px-5 py-3 rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Master Document Catalog (Module 8)</span>
        </button>

        <button
          onClick={() => setTab('vitbhopal')}
          className={`px-5 py-3 rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'vitbhopal'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>VIT Bhopal Institutional Documents</span>
        </button>

        <button
          onClick={() => setTab('preppack')}
          className={`px-5 py-3 rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'preppack'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Printer className="h-4 w-4" />
          <span>Branch Prep Pack & Dossier Order</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'personalized' && (
        <PersonalizedChecklistGenerator
          initialAmount={initialAmount}
          onNavigateToPrepPack={() => setTab('preppack')}
        />
      )}

      {activeTab === 'catalog' && (
        <DocumentCatalogBrowser />
      )}

      {activeTab === 'vitbhopal' && (
        <VitBhopalDocGuide />
      )}

      {activeTab === 'preppack' && (
        <DocumentPrepPack />
      )}
    </div>
  );
};
