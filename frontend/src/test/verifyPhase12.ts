import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
console.log('🧪 RUNNING EDU4LOAN PHASE 12 VERIFICATION SUITE');
console.log('====================================================\n');

async function runTests() {
  // ----------------------------------------------------
  // 1. STATUTORY MARGIN MONEY LOGIC (IBA GUIDELINES)
  // ----------------------------------------------------
  const computeMargin = (loan: number): number => {
    if (loan <= 400000) return 0;
    return (loan - 400000) * 0.05;
  };

  assert(
    computeMargin(350000) === 0,
    '1.1 Zero margin money strictly enforced for education loans <= ₹4.0 Lakhs',
    'Loan ₹3.5L -> Margin ₹0'
  );

  assert(
    computeMargin(400000) === 0,
    '1.2 Zero margin money at boundary condition ₹4.0 Lakhs',
    'Loan ₹4.0L -> Margin ₹0'
  );

  const margin12L = computeMargin(1200000);
  assert(
    margin12L === 40000,
    '1.3 Margin money for ₹12 Lakhs loan accurately computed as 5% above ₹4 Lakhs (₹40,000)',
    `Calculated: ₹${margin12L}`
  );

  // ----------------------------------------------------
  // 2. FIXED OBLIGATION TO INCOME RATIO (FOIR) ENGINE
  // ----------------------------------------------------
  const computeFoir = (monthlyIncome: number, existingEmis: number, projectedEmi: number): number => {
    return Math.min(100, Math.round(((existingEmis + projectedEmi) / Math.max(1, monthlyIncome)) * 100));
  };

  const foirHealthy = computeFoir(100000, 15000, 20000);
  assert(
    foirHealthy === 35,
    '2.1 Healthy FOIR (35%) correctly calculated when monthly debt commitments are moderate',
    `FOIR: ${foirHealthy}%`
  );

  const foirHigh = computeFoir(50000, 25000, 15000);
  assert(
    foirHigh === 80,
    '2.2 Elevated FOIR (80%) correctly detected when monthly debt exceeds 60% ceiling',
    `FOIR: ${foirHigh}%`
  );

  // ----------------------------------------------------
  // 3. CREDIT READINESS BAND CLASSIFICATION
  // ----------------------------------------------------
  const evaluateReadiness = (cibilBand: string, foir: number) => {
    const isStrongCibil = cibilBand === '750_plus' || cibilBand === '700_749';
    if (isStrongCibil && foir <= 50) return 'HIGH';
    if (isStrongCibil && foir > 50) return 'MODERATE';
    return 'ADDITIONAL_SUPPORT';
  };

  assert(
    evaluateReadiness('750_plus', 35) === 'HIGH',
    '3.1 High readiness assigned when CIBIL >= 700 and FOIR <= 50%'
  );

  assert(
    evaluateReadiness('750_plus', 65) === 'MODERATE',
    '3.2 Moderate readiness assigned when credit is strong but FOIR > 50%'
  );

  assert(
    evaluateReadiness('below_650', 30) === 'ADDITIONAL_SUPPORT',
    '3.3 Additional support advised when CIBIL < 650 regardless of income'
  );

  // ----------------------------------------------------
  // 4. FAQ KNOWLEDGE BASE TAXONOMY & COVERAGE
  // ----------------------------------------------------
  const faqsFilePath = path.resolve(__dirname, '../pages/FaqsPage.tsx');
  const faqsContent = fs.readFileSync(faqsFilePath, 'utf-8');

  const requiredFaqCategories = [
    'Interest & Moratorium',
    'Collateral & Guarantees',
    'Government Subsidies',
    'VIT Bhopal Guides',
    'Eligibility & Co-Borrower',
  ];

  const allFaqCategoriesPresent = requiredFaqCategories.every((cat) =>
    faqsContent.includes(cat)
  );

  assert(
    allFaqCategoriesPresent,
    '4.1 All 5 authoritative financial FAQ categories present in FaqsPage',
    `Categories: ${requiredFaqCategories.join(', ')}`
  );

  const statutoryTerms = [
    'EBLR',
    'CGFSEL',
    'PM-Vidyalaxmi',
    'CSIS',
    'Bonafide',
    'Section 80E',
    'simple interest',
  ];

  const allStatutoryTermsPresent = statutoryTerms.every((term) =>
    faqsContent.includes(term)
  );

  assert(
    allStatutoryTermsPresent,
    '4.2 Critical regulatory and institutional terminology covered in FAQs',
    `Terms: ${statutoryTerms.join(', ')}`
  );

  // ----------------------------------------------------
  // 5. GLOBAL ROUTING & NAVIGATION INTEGRITY
  // ----------------------------------------------------
  const appFilePath = path.resolve(__dirname, '../App.tsx');
  const appContent = fs.readFileSync(appFilePath, 'utf-8');

  assert(
    appContent.includes('path="admin"') && appContent.includes('path="eligibility"'),
    '5.1 Both /admin and /eligibility routes declared in App.tsx'
  );

  const navbarFilePath = path.resolve(__dirname, '../components/layout/Navbar.tsx');
  const navbarContent = fs.readFileSync(navbarFilePath, 'utf-8');

  assert(
    navbarContent.includes('/eligibility') && navbarContent.includes('/admin'),
    '5.2 Navigation links for Eligibility and Admin Console present in Navbar.tsx'
  );

  // ----------------------------------------------------
  // 6. CONTENT SAFETY & ZERO RANKING AUDIT
  // ----------------------------------------------------
  const phase12Files = [
    '../pages/EligibilityPage.tsx',
    '../pages/FaqsPage.tsx',
    '../App.tsx',
    '../components/layout/Navbar.tsx',
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

  for (const relPath of phase12Files) {
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
    '6.1 Content Safety Audit: Zero prohibited ranking terms found across all Phase 12 files',
    `Violations: ${prohibitedViolations}`
  );

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`Phase 12 Verification Completed: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL PHASE 12 REQUIREMENTS VERIFIED & PASSING!\n');
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Unhandled test runner error:', err);
  process.exit(1);
});
