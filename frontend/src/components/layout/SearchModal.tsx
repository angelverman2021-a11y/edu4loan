import React, { useState, useEffect, useRef } from 'react';
import { Search, Building2, BookOpen, FileText, Landmark, HelpCircle, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchService } from '@/services/searchService';
import { SearchResponseData } from '@/types';
import { Modal } from '@/components/ui/Modal';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResponseData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setData(null);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchService.globalSearch(query);
        setData(res);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url: string) => {
    onClose();
    navigate(url);
  };

  const hasResults =
    data &&
    (data.results.banks.length > 0 ||
      data.results.loanSchemes.length > 0 ||
      data.results.governmentSchemes.length > 0 ||
      data.results.documents.length > 0 ||
      data.results.institutions.length > 0 ||
      data.results.faqs.length > 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" className="p-0 overflow-hidden">
      {/* Search Input Bar */}
      <div className="flex items-center px-4 py-3.5 border-b border-slate-200">
        <Search className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search banks, loan schemes, subsidies, documents, or VIT fees..."
          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        {loading && <Loader2 className="h-4 w-4 animate-spin text-brand-600 shrink-0 ml-2" />}
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 rounded border border-slate-200 ml-2">
          ESC
        </kbd>
      </div>

      {/* Results or Quick Suggestions */}
      <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
        {!query && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Popular Searches for VIT Bhopal
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'SBI Scholar Scheme', q: 'SBI Scholar' },
                { label: 'PM-Vidyalaxmi Subsidy', q: 'PM-Vidyalaxmi' },
                { label: 'Canara Vidya Turan', q: 'Canara' },
                { label: 'Bonafide Certificate', q: 'Bonafide' },
                { label: 'Category 1 to 5 Fees', q: 'Category Fees' },
                { label: 'Moratorium Period', q: 'Moratorium' },
              ].map((item) => (
                <button
                  key={item.q}
                  onClick={() => setQuery(item.q)}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {query && !loading && !hasResults && (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-500">No results found for &ldquo;{query}&rdquo;</p>
            <p className="text-xs text-slate-400 mt-1">
              Try searching by bank name (SBI, Canara, PNB), &ldquo;collateral&rdquo;, or &ldquo;subsidy&rdquo;.
            </p>
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {/* Banks */}
            {data.results.banks.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Landmark className="h-3.5 w-3.5" />
                  <span>Banks ({data.results.banks.length})</span>
                </h4>
                <div className="space-y-1">
                  {data.results.banks.map((b: any) => (
                    <button
                      key={b._id}
                      onClick={() => handleSelect(`/banks?bank=${b.slug || b.code}`)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-50/70 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900 group-hover:text-brand-700">
                          {b.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {b.category?.replace('_', ' ').toUpperCase()} • Code: {b.code}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loan Schemes */}
            {data.results.loanSchemes.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Loan Schemes ({data.results.loanSchemes.length})</span>
                </h4>
                <div className="space-y-1">
                  {data.results.loanSchemes.map((s: any) => (
                    <button
                      key={s._id}
                      onClick={() => handleSelect(`/banks?scheme=${s.slug || s.code}`)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-50/70 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900 group-hover:text-brand-700">
                          {s.schemeName}
                        </div>
                        <div className="text-xs text-slate-500">
                          Max: ₹{(s.maxLoanAmount?.value / 100000).toFixed(1)}L •{' '}
                          {s.interestRate?.minRate}% – {s.interestRate?.maxRate}%
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Government Schemes */}
            {data.results.governmentSchemes.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Government Subsidies & Portals</span>
                </h4>
                <div className="space-y-1">
                  {data.results.governmentSchemes.map((g: any) => (
                    <button
                      key={g._id}
                      onClick={() => handleSelect(`/schemes#${g.code?.toLowerCase()}`)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-50/70 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900 group-hover:text-brand-700">
                          {g.name} ({g.code})
                        </div>
                        <div className="text-xs text-slate-500">{g.nodalMinistry}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {data.results.documents.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Document Requirements</span>
                </h4>
                <div className="space-y-1">
                  {data.results.documents.map((d: any) => (
                    <button
                      key={d._id}
                      onClick={() => handleSelect(`/documents?highlight=${d.code}`)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-50/70 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900 group-hover:text-brand-700">
                          {d.documentName}
                        </div>
                        <div className="text-xs text-slate-500">
                          Category: {d.category?.replace('_', ' ').toUpperCase()} •{' '}
                          {d.mandatory ? 'Mandatory' : 'Conditional'}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {data.results.faqs.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Frequently Asked Questions</span>
                </h4>
                <div className="space-y-1">
                  {data.results.faqs.map((f: any) => (
                    <button
                      key={f._id}
                      onClick={() => handleSelect(`/faqs#${f._id}`)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-50/70 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900 group-hover:text-brand-700 line-clamp-1">
                          {f.question}
                        </div>
                        <div className="text-xs text-slate-500">{f.category}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
