const fs = require('fs');
const path = '/Users/dhananjay/Documents/GitHub/edu4loan/frontend/src/pages/ComparePage.tsx';
let content = fs.readFileSync(path, 'utf8');

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
  const regex = new RegExp(`id: '${id}'.*?note: '(.*?)'`, 's');
  content = content.replace(regex, (match, note) => {
    return match.replace(`note: '${note}'`, `note: '${note}',
    totalLoansGiven: ${stats.totalLoansGiven},
    outstandingAmountCrores: ${stats.outstandingAmountCrores},
    yearWiseApplications: ${JSON.stringify(stats.yearWiseApplications)},
    stateWiseApplications: ${JSON.stringify(stats.stateWiseApplications)}`);
  });
}

fs.writeFileSync(path, content, 'utf8');
console.log('Update successful');
