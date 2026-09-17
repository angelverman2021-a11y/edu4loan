import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculatorService } from '../services/calculatorService';
import { CalculatorInputs, PrepaymentOptions } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}${detail ? ` -> ${detail}` : ''}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}${detail ? ` -> ${detail}` : ''}`);
    failed++;
  }
}

console.log('====================================================');
console.log('🧪 RUNNING EDU4LOAN PHASE 7 VERIFICATION SUITE');
console.log('====================================================\n');

// ----------------------------------------------------
// 1. STANDARD EMI CALCULATION ACCURACY
// ----------------------------------------------------
const standardInputs: CalculatorInputs = {
  loanAmount: 1200000,
  annualInterestRatePercent: 9.15,
  courseDurationYears: 4,
  moratoriumPostCourseMonths: 12,
  repaymentTenureYears: 10,
  serviceInterestDuringMoratorium: false,
};

const resultUnserviced = calculatorService.calculateEmiLocal(standardInputs);

assert(
  resultUnserviced.totalMoratoriumMonths === 60,
  '1.1 Moratorium duration calculation',
  `Expected 60 months, got ${resultUnserviced.totalMoratoriumMonths}`
);

// Moratorium simple interest: 12,00,000 * 0.0915 * 5 years = 5,49,000
const expectedMoratoriumInterest = 1200000 * (9.15 / 100) * 5;
assert(
  Math.abs(resultUnserviced.moratoriumInterestAccrued - expectedMoratoriumInterest) < 10,
  '1.2 Moratorium simple interest accuracy',
  `Expected ₹${expectedMoratoriumInterest}, got ₹${resultUnserviced.moratoriumInterestAccrued}`
);

// Unserviced capitalized principal: 12,00,000 + 5,49,000 = 17,49,000
assert(
  resultUnserviced.principalAtRepaymentStart === 1200000 + resultUnserviced.moratoriumInterestAccrued,
  '1.3 Capitalized principal at repayment start',
  `Expected ₹${1200000 + resultUnserviced.moratoriumInterestAccrued}, got ₹${resultUnserviced.principalAtRepaymentStart}`
);

// Standard monthly EMI verification
const rMonthly = 9.15 / 12 / 100;
const nMonths = 120;
const pCap = resultUnserviced.principalAtRepaymentStart;
const factor = Math.pow(1 + rMonthly, nMonths);
const expectedEmi = (pCap * rMonthly * factor) / (factor - 1);

assert(
  Math.abs(resultUnserviced.monthlyEMI - expectedEmi) < 2,
  '1.4 Standard Monthly EMI formula precision',
  `Expected ₹${expectedEmi.toFixed(2)}, got ₹${resultUnserviced.monthlyEMI}`
);

// ----------------------------------------------------
// 2. SIMPLE INTEREST SERVICING & CAPITALIZATION SAVINGS
// ----------------------------------------------------
const servicedInputs: CalculatorInputs = {
  ...standardInputs,
  serviceInterestDuringMoratorium: true,
};

const resultServiced = calculatorService.calculateEmiLocal(servicedInputs);

assert(
  resultServiced.principalAtRepaymentStart === 1200000,
  '2.1 Non-capitalized principal stays equal to initial loan amount',
  `Expected ₹12,00,000, got ₹${resultServiced.principalAtRepaymentStart}`
);

assert(
  resultServiced.monthlyEMI < resultUnserviced.monthlyEMI,
  '2.2 Serviced EMI is strictly lower than unserviced capitalized EMI',
  `Serviced EMI: ₹${resultServiced.monthlyEMI} vs Unserviced: ₹${resultUnserviced.monthlyEMI}`
);

assert(
  resultUnserviced.savingsByServicingInterestDuringStudy > 0,
  '2.3 Substantial savings calculated by servicing simple interest during study',
  `Calculated savings: ₹${resultUnserviced.savingsByServicingInterestDuringStudy}`
);

// ----------------------------------------------------
// 3. ZERO-INTEREST EDGE CASE HANDLING
// ----------------------------------------------------
const zeroInterestInputs: CalculatorInputs = {
  loanAmount: 600000,
  annualInterestRatePercent: 0,
  courseDurationYears: 4,
  moratoriumPostCourseMonths: 12,
  repaymentTenureYears: 5,
  serviceInterestDuringMoratorium: false,
};

const resultZeroInterest = calculatorService.calculateEmiLocal(zeroInterestInputs);

assert(
  resultZeroInterest.moratoriumInterestAccrued === 0,
  '3.1 Zero percent interest results in zero moratorium interest'
);

assert(
  Math.abs(resultZeroInterest.monthlyEMI - (600000 / 60)) < 1,
  '3.2 Zero percent interest calculates exact linear principal division for EMI',
  `Expected ₹10,000, got ₹${resultZeroInterest.monthlyEMI}`
);

assert(
  resultZeroInterest.totalAmountPaid === 600000,
  '3.3 Zero percent total repayment equals principal exactly'
);

// ----------------------------------------------------
// 4. AMORTIZATION SCHEDULE & BALANCE CONVERGENCE
// ----------------------------------------------------
assert(
  resultUnserviced.yearlySchedule.length === standardInputs.repaymentTenureYears,
  '4.1 Amortization schedule has exact yearly periods matching tenure',
  `Expected 10 years, got ${resultUnserviced.yearlySchedule.length}`
);

const finalYear = resultUnserviced.yearlySchedule[resultUnserviced.yearlySchedule.length - 1];
assert(
  finalYear.outstandingBalanceEnd === 0,
  '4.2 Amortization schedule converges balance to exactly ₹0 at end of tenure',
  `Final balance: ₹${finalYear.outstandingBalanceEnd}`
);

const totalPrincipalRepaid = resultUnserviced.yearlySchedule.reduce(
  (acc, y) => acc + y.principalPaid,
  0
);
assert(
  Math.abs(totalPrincipalRepaid - resultUnserviced.principalAtRepaymentStart) <= 10,
  '4.3 Sum of principal payments matches starting repayment balance',
  `Total principal repaid: ₹${totalPrincipalRepaid} vs Starting: ₹${resultUnserviced.principalAtRepaymentStart}`
);

// ----------------------------------------------------
// 5. PREPAYMENT ACCELERATION ENGINE
// ----------------------------------------------------
const prepaymentPlan: PrepaymentOptions = {
  extraMonthlyPayment: 3000,
  lumpSumAmount: 100000,
  lumpSumMonth: 12,
};

const prepaymentResult = calculatorService.simulatePrepayment(resultUnserviced, prepaymentPlan);

assert(
  prepaymentResult.monthsSaved > 0,
  '5.1 Prepayment reduces loan tenure',
  `Months saved: ${prepaymentResult.monthsSaved} months (~${(prepaymentResult.monthsSaved / 12).toFixed(1)} years)`
);

assert(
  prepaymentResult.interestSaved > 0,
  '5.2 Prepayment reduces total lifetime interest paid',
  `Interest saved: ₹${prepaymentResult.interestSaved}`
);

assert(
  prepaymentResult.revisedTenureMonths + prepaymentResult.monthsSaved === resultUnserviced.totalRepaymentMonths,
  '5.3 Prepayment tenure balance reconciliation'
);

// ----------------------------------------------------
// 6. RECHARTS DATA STRUCTURES & CSV EXPORT
// ----------------------------------------------------
const donutData = calculatorService.getDonutChartData(resultUnserviced);
assert(
  donutData.length === 3 &&
    donutData.every((d) => d.value > 0 && typeof d.name === 'string' && d.color.startsWith('#')),
  '6.1 Donut chart series structure is complete with 3 valid color-coded slices'
);

const areaData = calculatorService.getAreaChartData(resultUnserviced);
assert(
  areaData.length > standardInputs.repaymentTenureYears &&
    areaData[0].phase === 'moratorium' &&
    areaData[areaData.length - 1].balance === 0,
  '6.2 Area chart balance trajectory spans moratorium to zero balance'
);

const barData = calculatorService.getBarChartData(resultUnserviced);
assert(
  barData.length === standardInputs.repaymentTenureYears &&
    barData.every((b) => b.principalPaid > 0 && b.interestPaid >= 0),
  '6.3 Bar chart series has yearly breakdown with valid principal and interest values'
);

const csvData = calculatorService.exportAmortizationToCsv(resultUnserviced);
assert(
  csvData.includes('Year,Phase,Principal Paid (INR),Interest Paid (INR),Outstanding Balance (INR)') &&
    csvData.includes('Moratorium') &&
    csvData.split('\n').length >= 12,
  '6.4 Amortization schedule CSV export generates well-formatted CSV text'
);

// ----------------------------------------------------
// 7. COMPONENT EXPORTS INTEGRITY
// ----------------------------------------------------
const componentsIndexPath = path.resolve(__dirname, '../components/calculator/index.ts');
const componentsIndexContent = fs.readFileSync(componentsIndexPath, 'utf-8');

const requiredComponents = [
  'RepaymentDonutChart',
  'AmortizationAreaChart',
  'YearlyBreakdownBarChart',
  'MoratoriumSavingsCard',
  'PrepaymentSimulator',
  'AmortizationTable',
  'InterestRateExplainer',
  'CollateralExplainer',
];

const allComponentsExported = requiredComponents.every((comp) =>
  componentsIndexContent.includes(comp)
);

assert(
  allComponentsExported,
  '7.1 All 8 Phase 7 calculator & explainer components are exported from calculator/index.ts',
  `Exported components: ${requiredComponents.join(', ')}`
);

// ----------------------------------------------------
// 8. ZERO RANKING & CONTENT NEUTRALITY AUDIT
// ----------------------------------------------------
const phase7Files = [
  '../pages/CalculatorPage.tsx',
  '../components/calculator/InterestRateExplainer.tsx',
  '../components/calculator/CollateralExplainer.tsx',
  '../components/calculator/MoratoriumSavingsCard.tsx',
  '../components/calculator/PrepaymentSimulator.tsx',
  '../components/calculator/AmortizationTable.tsx',
  '../components/calculator/RepaymentDonutChart.tsx',
  '../components/calculator/AmortizationAreaChart.tsx',
  '../components/calculator/YearlyBreakdownBarChart.tsx',
  '../services/calculatorService.ts',
  '../types/calculator.ts',
];

const prohibitedPatterns = [
  /\bbest bank\b/i,
  /\bwinner\b/i,
  /\blowest rate\b/i,
  /\btop rated\b/i,
  /\brecommended bank\b/i,
  /\bguaranteed approval\b/i,
  /\bcheapest loan\b/i,
];

let prohibitedViolations = 0;

for (const relPath of phase7Files) {
  const fullPath = path.resolve(__dirname, relPath);
  if (!fs.existsSync(fullPath)) continue;

  const content = fs.readFileSync(fullPath, 'utf-8');
  for (const pattern of prohibitedPatterns) {
    const match = content.match(pattern);
    if (match) {
      console.error(`Violation in ${relPath}: matches prohibited pattern "${pattern}" -> "${match[0]}"`);
      prohibitedViolations++;
    }
  }
}

assert(
  prohibitedViolations === 0,
  '8.1 Content Safety Audit: Zero prohibited ranking terms found across all Phase 7 files',
  `Prohibited violations: ${prohibitedViolations}`
);

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`Phase 7 Verification Completed: ${passed} Passed, ${failed} Failed`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PHASE 7 REQUIREMENTS VERIFIED & PASSING!\n');
  process.exit(0);
}
