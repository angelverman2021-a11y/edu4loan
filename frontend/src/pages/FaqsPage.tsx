import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { api } from '@/services/api';

export const FaqsPage: React.FC = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const res = await api.get<any[]>('/faqs');
        setFaqs(res.data || []);
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter((f) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return f.question?.toLowerCase().includes(term) || f.answer?.toLowerCase().includes(term);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <Badge variant="info">Student Knowledge Base</Badge>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <HelpCircle className="h-7 w-7 text-brand-700" />
          <span>Frequently Asked Questions</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Clear, straightforward answers to the most common queries regarding education loans, RBI rules, subsidies, and VIT Bhopal procedures.
        </p>

        {/* Search input */}
        <div className="pt-2 max-w-md mx-auto relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs (e.g. collateral, moratorium, CSIS)..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 shadow-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Loading FAQs...</p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">No questions found matching &ldquo;{search}&rdquo;.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq._id;
            return (
              <Card key={faq._id} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq._id)}
                  className="w-full text-left p-4.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors focus:outline-none"
                >
                  <span className="font-semibold text-slate-900 text-sm">{faq.question}</span>
                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>
                {isOpen && (
                  <CardContent className="pt-0 px-4.5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                    {faq.answer}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
