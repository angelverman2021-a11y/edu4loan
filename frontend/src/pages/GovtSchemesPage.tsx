import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Landmark,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText,
  Calculator,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { governmentSchemeService } from '@/services/governmentSchemeService';
import {
  VidyaLakshmiGuide,
  PmVidyalaxmiGuide,
  SubsidyEligibilityChecker,
} from '@/components/schemes';
import { GovernmentSchemeItem } from '@/types';

export const GovtSchemesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schemes, setSchemes] = useState<GovernmentSchemeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Active tab: 'catalog' | 'checker' | 'vidyalakshmi' | 'pmvidyalaxmi'
  const activeTab = searchParams.get('tab') || 'catalog';

  const setTab = (tab: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    let isMounted = true;
    const fetchGovtSchemes = async () => {
      setLoading(true);
      const data = await governmentSchemeService.fetchGovernmentSchemes();
      if (isMounted) {
        setSchemes(data);
        setLoading(false);
      }
    };
    fetchGovtSchemes();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="verified">Official Government Portals</Badge>
          <VerifiedBadge status="verified" lastVerified="2026-09-01" size="sm" />
          <span className="text-xs text-slate-500 font-medium">Cabinet Approved</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Landmark className="h-9 w-9 text-brand-700 shrink-0" />
          <span>Government Subsidies & Central Schemes</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Statutory interest subsidies, credit guarantee programs, and official application portals established by the Government of India for higher education.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-sm font-semibold">
        <button
          onClick={() => setTab('catalog')}
          className={`px-5 py-3 rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Central Schemes Catalog</span>
        </button>

        <button
          onClick={() => setTab('checker')}
          className={`px-5 py-3 rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'checker'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calculator className="h-4 w-4" />
          <span>Subsidy Eligibility Checker</span>
        </button>

        <button
          onClick={() => setTab('vidyalakshmi')}
          className={`px-5 py-3 rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'vidyalakshmi'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Vidya Lakshmi Portal Guide (Module 9)</span>
        </button>

        <button
          onClick={() => setTab('pmvidyalaxmi')}
          className={`px-5 py-3 rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'pmvidyalaxmi'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50 shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>PM-Vidyalaxmi 2024 Guide (Module 10)</span>
        </button>
      </div>

      {/* Tab 1: Schemes Catalog */}
      {activeTab === 'catalog' && (
        <div>
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="h-8 w-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Loading government schemes catalog...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {schemes.map((scheme) => (
                <Card
                  key={scheme._id || scheme.code}
                  className="border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="info">{scheme.code}</Badge>
                      <VerifiedBadge
                        status="verified"
                        lastVerified={scheme.lastVerified || '2026-09-01'}
                        size="sm"
                      />
                    </div>
                    <CardTitle className="text-base font-bold text-slate-900 mt-2">
                      {scheme.name}
                    </CardTitle>
                    <p className="text-xs text-slate-500 font-medium">{scheme.nodalMinistry}</p>
                  </CardHeader>

                  <CardContent className="space-y-4 text-xs flex-1">
                    <p className="text-slate-600 leading-relaxed">{scheme.description}</p>

                    {scheme.keyFeatures && (
                      <div className="space-y-1.5 pt-1">
                        <span className="font-bold text-slate-800 text-[11px] block">
                          Key Provisions:
                        </span>
                        <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                          {scheme.keyFeatures.map((kf, i) => (
                            <li key={i} className="leading-relaxed">
                              {kf}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200/80 text-[11px] space-y-1">
                      <span className="font-bold text-slate-800">Target Beneficiaries:</span>
                      <p className="text-slate-600">
                        {scheme.targetBeneficiaries || 'Check official guidelines.'}
                      </p>
                    </div>
                  </CardContent>

                  <div className="px-6 pb-5 pt-0">
                    {scheme.officialPortalUrl && (
                      <a
                        href={scheme.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                        >
                          Visit Official Portal
                        </Button>
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Subsidy Eligibility Checker */}
      {activeTab === 'checker' && <SubsidyEligibilityChecker />}

      {/* Tab 3: Vidya Lakshmi Guide */}
      {activeTab === 'vidyalakshmi' && <VidyaLakshmiGuide />}

      {/* Tab 4: PM-Vidyalaxmi Guide */}
      {activeTab === 'pmvidyalaxmi' && <PmVidyalaxmiGuide />}
    </div>
  );
};
