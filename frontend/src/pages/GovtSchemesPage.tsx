import React, { useState, useEffect } from 'react';
import { Landmark, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { api } from '@/services/api';

export const GovtSchemesPage: React.FC = () => {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGovtSchemes = async () => {
      try {
        setLoading(true);
        const res = await api.get<any[]>('/government-schemes');
        setSchemes(res.data || []);
      } catch (err) {
        console.error('Failed to load government schemes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGovtSchemes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="verified">Official Government Portals</Badge>
          <Badge variant="neutral">Cabinet Approved</Badge>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Landmark className="h-8 w-8 text-brand-700 shrink-0" />
          <span>Government Subsidies & Central Schemes</span>
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Comprehensive guide to statutory interest subsidies, credit guarantee schemes, and official application portals established by the Government of India for higher education.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Loading government schemes catalog...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((scheme) => (
            <Card key={scheme._id || scheme.code} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="info">{scheme.code}</Badge>
                  <VerifiedBadge status="verified" lastVerified={scheme.lastVerified || '2026-09-01'} size="sm" />
                </div>
                <CardTitle className="text-lg mt-2">{scheme.name}</CardTitle>
                <p className="text-xs text-slate-500">{scheme.nodalMinistry}</p>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                <p className="text-slate-600 leading-relaxed">{scheme.description}</p>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="font-semibold text-slate-800">Eligibility Criteria:</div>
                  <p className="text-slate-600">{scheme.eligibilitySummary || 'Check official guidelines.'}</p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Subsidy Benefit</span>
                  </div>
                  <p className="text-slate-700">{scheme.benefitsSummary || 'Interest waiver / Credit coverage.'}</p>
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
                      className="w-full"
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
  );
};
