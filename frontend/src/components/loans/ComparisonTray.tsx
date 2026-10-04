import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Columns3, X, ArrowRight, AlertCircle } from 'lucide-react';
import { useComparison } from '@/context/ComparisonContext';
import { Button } from '@/components/ui/Button';

export const ComparisonTray: React.FC = () => {
  const {
    selectedSchemes,
    removeScheme,
    clearComparison,
    warningMessage,
    dismissWarning,
  } = useComparison();
  const navigate = useNavigate();

  if (selectedSchemes.length === 0 && !warningMessage) {
    return null;
  }

  const handleCompare = () => {
    if (selectedSchemes.length < 2) return;
    const ids = selectedSchemes.map((s) => s.id).join(',');
    navigate(`/compare?ids=${ids}`);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto space-y-2 pointer-events-auto">
        {/* Warning Toast */}
        {warningMessage && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500 text-white shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{warningMessage}</span>
            </div>
            <button
              onClick={dismissWarning}
              className="p-1 hover:bg-white/20 rounded-md transition-colors"
              aria-label="Dismiss warning"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Floating Tray */}
        {selectedSchemes.length > 0 && (
          <div className="bg-white/95 backdrop-blur-md border border-slate-300/80 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-slate-200">
                <Columns3 className="h-4 w-4 text-brand-700" />
                <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
                  Compare ({selectedSchemes.length}/4)
                </span>
              </div>

              {/* Selected Scheme Chips */}
              <div className="flex items-center gap-1.5 flex-nowrap">
                {selectedSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/80 border border-blue-200/70 text-sm text-brand-900 shrink-0"
                  >
                    <span className="font-semibold max-w-[130px] truncate">
                      {scheme.bankName}: {scheme.schemeName}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeScheme(scheme.id)}
                      className="p-0.5 text-blue-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Remove from comparison"
                      aria-label={`Remove ${scheme.schemeName} from comparison`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={clearComparison}
                className="text-sm font-medium text-slate-500 hover:text-slate-800 px-2.5 py-1.5 transition-colors"
              >
                Clear all
              </button>

              <Button
                variant="primary"
                size="sm"
                disabled={selectedSchemes.length < 2}
                onClick={handleCompare}
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                {selectedSchemes.length < 2 ? 'Select 1 more' : 'Compare Side-by-Side'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
