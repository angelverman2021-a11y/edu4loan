const fs = require('fs');

const path = '/Users/dhananjay/Documents/GitHub/edu4loan/frontend/src/pages/ComparePage.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add fields to BankData
content = content.replace(
  'note: string;\n}',
  `note: string;
  totalLoansGiven: number;
  outstandingAmountCrores: number;
  yearWiseApplications: { year: string; count: number }[];
  stateWiseApplications: { state: string; count: number }[];
}`
);

// 2. Add mock data to BANKS
const mockStats = {
  sbi: {
    totalLoansGiven: 850000, outstandingAmountCrores: 12500,
    yearWiseApplications: [{ year: '2021', count: 180000 }, { year: '2022', count: 210000 }, { year: '2023', count: 240000 }],
    stateWiseApplications: [{ state: 'MP', count: 45000 }, { state: 'MH', count: 60000 }, { state: 'DL', count: 30000 }]
  },
  canara: {
    totalLoansGiven: 420000, outstandingAmountCrores: 6200,
    yearWiseApplications: [{ year: '2021', count: 90000 }, { year: '2022', count: 110000 }, { year: '2023', count: 130000 }],
    stateWiseApplications: [{ state: 'MP', count: 20000 }, { state: 'KA', count: 40000 }, { state: 'MH', count: 25000 }]
  },
  pnb: {
    totalLoansGiven: 510000, outstandingAmountCrores: 7800,
    yearWiseApplications: [{ year: '2021', count: 110000 }, { year: '2022', count: 130000 }, { year: '2023', count: 145000 }],
    stateWiseApplications: [{ state: 'PB', count: 35000 }, { state: 'MP', count: 18000 }, { state: 'UP', count: 40000 }]
  },
  union: {
    totalLoansGiven: 380000, outstandingAmountCrores: 5400,
    yearWiseApplications: [{ year: '2021', count: 85000 }, { year: '2022', count: 95000 }, { year: '2023', count: 110000 }],
    stateWiseApplications: [{ state: 'MH', count: 30000 }, { state: 'MP', count: 25000 }, { state: 'UP', count: 22000 }]
  },
  bob: {
    totalLoansGiven: 490000, outstandingAmountCrores: 7100,
    yearWiseApplications: [{ year: '2021', count: 105000 }, { year: '2022', count: 125000 }, { year: '2023', count: 140000 }],
    stateWiseApplications: [{ state: 'GJ', count: 45000 }, { state: 'MP', count: 15000 }, { state: 'MH', count: 35000 }]
  },
  axis: {
    totalLoansGiven: 210000, outstandingAmountCrores: 3500,
    yearWiseApplications: [{ year: '2021', count: 45000 }, { year: '2022', count: 60000 }, { year: '2023', count: 75000 }],
    stateWiseApplications: [{ state: 'MH', count: 25000 }, { state: 'DL', count: 15000 }, { state: 'KA', count: 18000 }]
  },
  hdfc: {
    totalLoansGiven: 310000, outstandingAmountCrores: 5200,
    yearWiseApplications: [{ year: '2021', count: 70000 }, { year: '2022', count: 85000 }, { year: '2023', count: 105000 }],
    stateWiseApplications: [{ state: 'MH', count: 35000 }, { state: 'DL', count: 20000 }, { state: 'KA', count: 25000 }]
  },
  icici: {
    totalLoansGiven: 280000, outstandingAmountCrores: 4800,
    yearWiseApplications: [{ year: '2021', count: 65000 }, { year: '2022', count: 80000 }, { year: '2023', count: 95000 }],
    stateWiseApplications: [{ state: 'MH', count: 32000 }, { state: 'KA', count: 22000 }, { state: 'DL', count: 18000 }]
  },
  idfc: {
    totalLoansGiven: 120000, outstandingAmountCrores: 1900,
    yearWiseApplications: [{ year: '2021', count: 20000 }, { year: '2022', count: 35000 }, { year: '2023', count: 50000 }],
    stateWiseApplications: [{ state: 'MH', count: 15000 }, { state: 'KA', count: 10000 }, { state: 'TN', count: 8000 }]
  }
};

for (const [id, stats] of Object.entries(mockStats)) {
  const statString = `totalLoansGiven: ${stats.totalLoansGiven},
    outstandingAmountCrores: ${stats.outstandingAmountCrores},
    yearWiseApplications: ${JSON.stringify(stats.yearWiseApplications)},
    stateWiseApplications: ${JSON.stringify(stats.stateWiseApplications)},
    note: `;
  const regex = new RegExp(`id: '\\${id}'.*?note: `, 's');
  content = content.replace(regex, (match) => {
    return match.replace('note: ', statString);
  });
}

// 3. Add the new section (STEP 3)
const newSection = `
        {/* ════════════════════════════════════════════════════════════════
            STEP 3: BANK STATISTICS & OUTSTANDING LOANS
        ════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-5 w-5 text-brand-700" />
              <h2 className="text-lg font-extrabold text-slate-900">Education Loan Market Statistics</h2>
            </div>
            <p className="text-sm text-slate-500">Historical data: Total loans given, outstanding amount, and applications (Year & State-wise)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeBanks.map((b) => (
              <div key={b.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-extrabold" style={{ backgroundColor: b.hexColor }}>
                    {b.shortName.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{b.shortName}</h3>
                    <p className="text-xs text-slate-500">Total Loans: <span className="font-semibold text-slate-700">{new Intl.NumberFormat('en-IN').format(b.totalLoansGiven)}</span></p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-1">Outstanding Amount</p>
                  <p className="text-lg font-extrabold text-slate-900">₹{new Intl.NumberFormat('en-IN').format(b.outstandingAmountCrores)} Cr</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-2">Year-wise Applications</p>
                    <div className="space-y-1.5">
                      {b.yearWiseApplications.map((y, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">{y.year}</span>
                          <span className="font-semibold text-slate-900">{new Intl.NumberFormat('en-IN').format(y.count)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-2">State-wise Applications (Top 3)</p>
                    <div className="space-y-1.5">
                      {b.stateWiseApplications.map((s, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">{s.state}</span>
                          <span className="font-semibold text-slate-900">{new Intl.NumberFormat('en-IN').format(s.count)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
`;

content = content.replace(
  '{/* ════════════════════════════════════════════════════════════════\n            STEP 3: EMI COMPARISON LINE CHART\n        ════════════════════════════════════════════════════════════════ */}',
  newSection + '\n        {/* ════════════════════════════════════════════════════════════════\n            STEP 4: EMI COMPARISON LINE CHART\n        ════════════════════════════════════════════════════════════════ */}'
);
content = content.replace('STEP 4: RADAR CHART', 'STEP 5: RADAR CHART');
content = content.replace('STEP 5: FULL COMPARISON TABLE', 'STEP 6: FULL COMPARISON TABLE');
content = content.replace('STEP 6: BANK NOTES', 'STEP 7: BANK NOTES');

fs.writeFileSync(path, content, 'utf8');
console.log('Update successful');
