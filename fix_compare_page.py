import re

with open("frontend/src/pages/ComparePage.tsx", "r") as f:
    content = f.read()

# 1. Fix BankData and BANKS
new_bank_data = """interface BankData {
  id: string;
  bank: string;
  scheme: string;
  shortName: string;
  color: string;
  hexColor: string;
  minRate: number;
  maxRate: number;
  maxLoanLakh: number;
  collateralFreeUptoLakh: number;
  marginPercent: number;
  moratoriumMonths: number;
  maxTenureYears: number;
  processingFeePct: number;
  girlConcessionBps: number;
  cgfselCover: boolean;
  pmVidyalaxmi: boolean;
  sectionEighty: boolean;
  prepaymentPenalty: boolean;
  processingDayMin: number;
  processingDayMax: number;
  officialUrl: string;
  note: string;
}"""

content = re.sub(r'interface BankData \{.*?\}', new_bank_data, content, flags=re.DOTALL)

# Let's replace the grid of selection buttons with dropdowns
old_selection_logic = """  const [selected, setSelected] = useState<Set<string>>(new Set(['sbi', 'canara', 'pnb']));

  const toggleBank = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 2) next.delete(id); // Keep minimum 2
      } else {
        if (next.size < 5) next.add(id); // Max 5
      }
      return next;
    });
  };

  const activeBanks = useMemo(() => BANKS.filter((b) => selected.has(b.id)), [selected]);"""

new_selection_logic = """  const [selectedIds, setSelectedIds] = useState<string[]>(['sbi', 'canara']);

  const addDropdown = () => {
    if (selectedIds.length < 5) {
      setSelectedIds([...selectedIds, '']);
    }
  };

  const updateDropdown = (index: number, newId: string) => {
    const next = [...selectedIds];
    next[index] = newId;
    setSelectedIds(next);
  };

  const removeDropdown = (index: number) => {
    if (selectedIds.length > 2) {
      const next = [...selectedIds];
      next.splice(index, 1);
      setSelectedIds(next);
    }
  };

  const activeBanks = useMemo(() => {
    return selectedIds.map(id => BANKS.find(b => b.id === id)).filter(Boolean) as BankData[];
  }, [selectedIds]);"""

content = content.replace(old_selection_logic, new_selection_logic)

old_ui_section = """        {/* ════════════════════════════════════════════════════════════════
            STEP 1: BANK SELECTOR
        ════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Select Banks to Compare</h2>
                <p className="text-sm text-slate-500 mt-0.5">Choose 2–5 banks · {selected.size} selected</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-slate-50">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {BANKS.map((b) => {
                const isSelected = selected.has(b.id);
                return (
                  <button
                    key={b.id}
                    onClick={() => toggleBank(b.id)}
                    className={clsx(
                      'flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200',
                      isSelected
                        ? 'bg-white border-brand-400 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] ring-1 ring-brand-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm opacity-80 hover:opacity-100 grayscale hover:grayscale-0'
                    )}
                  >
                    <div
                      className={clsx('h-8 w-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-inner', !isSelected && 'opacity-60')}
                      style={{ backgroundColor: b.hexColor }}
                    >
                      <span className="text-[10px] font-extrabold">{b.shortName.slice(0, 2)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={clsx('text-xs font-bold leading-tight', isSelected ? 'text-brand-800' : 'text-slate-800')}>
                        {b.shortName}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>"""

new_ui_section = """        {/* ════════════════════════════════════════════════════════════════
            STEP 1: BANK SELECTOR
        ════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Select Banks to Compare</h2>
                <p className="text-sm text-slate-500 mt-0.5">Choose 2–5 banks from the eligible list.</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-slate-50">
            <div className="flex flex-wrap gap-4 items-end">
              {selectedIds.map((id, index) => (
                <div key={index} className="flex flex-col gap-1.5 w-full sm:w-64">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                    Bank {index + 1}
                  </label>
                  <div className="relative">
                    <select
                      value={id}
                      onChange={(e) => updateDropdown(index, e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm cursor-pointer pr-10"
                    >
                      <option value="" disabled>-- Select a Bank --</option>
                      {BANKS.map(b => (
                        <option key={b.id} value={b.id}>{b.bank}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    
                    {/* Remove button if more than 2 dropdowns */}
                    {selectedIds.length > 2 && (
                      <button
                        onClick={() => removeDropdown(index)}
                        className="absolute -right-2 -top-2 bg-rose-100 text-rose-600 rounded-full p-1 hover:bg-rose-200 shadow-sm"
                        title="Remove"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {selectedIds.length < 5 && (
                <button
                  onClick={addDropdown}
                  className="h-[46px] px-6 rounded-xl border border-dashed border-slate-300 text-brand-600 font-semibold hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Bank
                </button>
              )}
            </div>
          </div>
        </section>"""

content = content.replace(old_ui_section, new_ui_section)

with open("frontend/src/pages/ComparePage.tsx", "w") as f:
    f.write(content)
