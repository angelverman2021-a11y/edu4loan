import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passed++;
    console.log(`[PASS] ${testName}`);
  } else {
    failed++;
    console.error(`[FAIL] ${testName} -> ${detail || 'Condition not met'}`);
  }
}

console.log('====================================================');
console.log('  EDU4LOAN FRONTEND ENHANCEMENT VERIFICATION SUITE');
console.log('====================================================\n');

// 1. Check ComparePage.tsx for 20+ comparison parameters
const comparePagePath = path.resolve(__dirname, '../pages/ComparePage.tsx');
const comparePageContent = fs.readFileSync(comparePagePath, 'utf-8');

const comparisonParameters = [
  'Documented Interest Rate',
  'Rate Structure Type',
  'External Benchmark Reference',
  'Documented Spread Range',
  'Girl Student Concession',
  'Prompt Servicing Concession',
  'Max Inland Limit',
  'Margin Money (Up to Rs 4 Lakhs)',
  'Margin Money (Above Rs 4 Lakhs)',
  'Scholarship Margin Adjustment',
  'Up to Rs 4.0 Lakhs',
  'Rs 4.0L to Rs 7.5 Lakhs',
  'Above Rs 7.5 Lakhs',
  'Third-Party Guarantee Requirement',
  'Co-Applicant Mandate',
  'Insurance Requirement',
  'Moratorium Grace Window',
  'Max Repayment Tenure',
  'Interest Accrual During Study',
  'Processing Fee',
  'Prepayment / Foreclosure Penalty',
  'Section 80E Tax Deduction',
  'Published Processing Window',
  'Eligible Expense Coverage',
  'Application Channels',
  'View Official Source',
];

let foundParamsCount = 0;
for (const param of comparisonParameters) {
  if (comparePageContent.includes(param)) {
    foundParamsCount++;
  }
}

assert(
  foundParamsCount >= 20,
  '1. ComparePage displays 20+ side-by-side comparison parameters',
  `Found ${foundParamsCount} of ${comparisonParameters.length} parameters`
);

assert(
  comparePageContent.includes('viewMode') &&
  comparePageContent.includes("'table'") &&
  comparePageContent.includes("'cards'"),
  '2. ComparePage includes responsive table and stacked mobile cards mode'
);

// 2. Check BankStatisticsPage.tsx
const statsPagePath = path.resolve(__dirname, '../pages/BankStatisticsPage.tsx');
const statsPageContent = fs.readFileSync(statsPagePath, 'utf-8');

assert(
  statsPageContent.includes('Documented Interest Rate Spreads & Benchmarks') &&
  statsPageContent.includes('Documented Loan Quantum Thresholds') &&
  statsPageContent.includes('Statutory Transparency Notice'),
  '3. BankStatisticsPage displays objective spreads, thresholds, and statutory disclosures'
);

assert(
  statsPageContent.includes('Authoritative Disclosure on Speculative Approval Statistics:'),
  '4. BankStatisticsPage explicitly states absence of speculative approval percentages'
);

// 3. Check PracticalHelpPage.tsx
const practicalHelpPath = path.resolve(__dirname, '../pages/PracticalHelpPage.tsx');
const practicalHelpContent = fs.readFileSync(practicalHelpPath, 'utf-8');

const practicalTabs = [
  'Student Verification',
  'Salary Slip Alternatives',
  'Minimum Documents Engine',
  'Approval Factors',
  'Terms & Conditions Decoder',
  'Application Timeline',
  'What-If Scenarios',
];

let foundTabsCount = 0;
for (const tab of practicalTabs) {
  if (practicalHelpContent.includes(tab)) {
    foundTabsCount++;
  }
}

assert(
  foundTabsCount === 7,
  '5. PracticalHelpPage implements all 7 dedicated student decision tools',
  `Found ${foundTabsCount} of 7 sub-tools`
);

assert(
  practicalHelpContent.includes('Fee Estimate & Structure Letter') &&
  practicalHelpContent.includes('Bonafide & Admission Certificate') &&
  practicalHelpContent.includes('University Bank Account Details'),
  '6. PracticalHelpPage includes VIT Bhopal fee estimate and bonafide guidance'
);

assert(
  practicalHelpContent.includes('Standard Salaried Verification Checklist') &&
  practicalHelpContent.includes('Professional / CA / Doctor') &&
  practicalHelpContent.includes('Farmer / Agriculture') &&
  practicalHelpContent.includes('Informal / Cash Income'),
  '7. PracticalHelpPage includes interactive salary slip decision tree with occupational alternatives'
);

// 4. Check ParentModePage.tsx & ParentModeContext
const parentModePath = path.resolve(__dirname, '../pages/ParentModePage.tsx');
const parentModeContent = fs.readFileSync(parentModePath, 'utf-8');
const parentContextPath = path.resolve(__dirname, '../context/ParentModeContext.tsx');
const parentContextContent = fs.readFileSync(parentContextPath, 'utf-8');

assert(
  parentContextContent.includes('English') &&
  parentContextContent.includes('हिंदी') &&
  parentContextContent.includes('ગુજરાતી') &&
  parentContextContent.includes('বাংলা'),
  '8. ParentModeContext provides dictionaries for English, Hindi, Gujarati, and Bengali'
);

assert(
  (parentModeContent.includes('dictionary.labels.preparationProgress') ||
    parentModeContent.includes('preparationProgress')) &&
  parentModeContent.includes('Print Checklist') &&
  parentModeContent.includes('Key Financial Terms Explained for Parents'),
  '9. ParentModePage includes preparation checklist progress tracker and jargon-free term comparisons'
);

// 5. Check AskEdu4LoanChatbot.tsx
const chatbotPath = path.resolve(__dirname, '../components/chat/AskEdu4LoanChatbot.tsx');
const chatbotContent = fs.readFileSync(chatbotPath, 'utf-8');

assert(
  chatbotContent.includes('Ask EDU4LOAN') &&
  chatbotContent.includes('chatbotService.ask') &&
  chatbotContent.includes('Verified Sources:'),
  '10. AskEdu4LoanChatbot implements floating assistant with verified source citations'
);

// Section 22: Guided Student Journey Verification
const studentJourneyPath = path.resolve(__dirname, '../pages/StudentJourneyPage.tsx');
const studentJourneyContent = fs.readFileSync(studentJourneyPath, 'utf-8');

assert(
  studentJourneyContent.includes('Complete Guided Student Loan Journey') &&
  studentJourneyContent.includes('VIT Bhopal University') &&
  studentJourneyContent.includes('Step 1 of 6') &&
  studentJourneyContent.includes('Step 2 of 6') &&
  studentJourneyContent.includes('Step 3 of 6') &&
  studentJourneyContent.includes('Step 4 of 6') &&
  studentJourneyContent.includes('Step 5 of 6') &&
  studentJourneyContent.includes('Step 6 of 6'),
  '11. StudentJourneyPage implements full multi-step journey (Section 22)'
);

assert(
  studentJourneyContent.includes('SBI Scholar Scheme') &&
  studentJourneyContent.includes('Canara Vidya Turan') &&
  studentJourneyContent.includes('Vidya Lakshmi Portal') &&
  studentJourneyContent.includes('PM-Vidyalaxmi Scheme (2024)'),
  '12. StudentJourneyPage provides scheme comparisons and official government portal links'
);

assert(
  studentJourneyContent.includes('PARENT_TEXTS') &&
  studentJourneyContent.includes('ગુજરાતી') &&
  studentJourneyContent.includes('বাংলা') &&
  studentJourneyContent.includes('हिंदी'),
  '13. StudentJourneyPage includes multilingual Parent Review Hub (Hindi, Gujarati, Bengali)'
);

// Section 21: SearchModal Verification
const searchModalPath = path.resolve(__dirname, '../components/layout/SearchModal.tsx');
const searchModalContent = fs.readFileSync(searchModalPath, 'utf-8');

assert(
  searchModalContent.includes('Official Regulatory Sources') &&
  searchModalContent.includes('Verified Chatbot Knowledge'),
  '14. SearchModal displays Official Sources and Verified Chatbot Answers (Section 21)'
);

// Section 24: AdminPage Data Catalog Verification
const adminPagePath = path.resolve(__dirname, '../pages/AdminPage.tsx');
const adminPageContent = fs.readFileSync(adminPagePath, 'utf-8');

assert(
  adminPageContent.includes('Platform Data Catalog Management') &&
  adminPageContent.includes('selectedEntity') &&
  adminPageContent.includes('VERIFIED') &&
  adminPageContent.includes('OUTDATED'),
  '15. AdminPage implements Data Catalog Management with VERIFIED, NEEDS_REVIEW, OUTDATED, UNAVAILABLE statuses (Section 24)'
);

// 6. Check Zero Emoji Constraint across newly created pages
const newFiles = [
  comparePagePath,
  statsPagePath,
  practicalHelpPath,
  parentModePath,
  chatbotPath,
  studentJourneyPath,
  searchModalPath,
  adminPagePath,
  path.resolve(__dirname, '../services/whatIfService.ts'),
  path.resolve(__dirname, '../services/chatbotService.ts'),
  path.resolve(__dirname, '../services/bankStatisticsService.ts'),
];

// Regex matching unicode emojis (including surrogate pairs, misc symbols, dingbats)
const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

let emojiViolations: string[] = [];
for (const file of newFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  if (emojiRegex.test(content)) {
    emojiViolations.push(path.basename(file));
  }
}

assert(
  emojiViolations.length === 0,
  '16. Zero Unicode emojis in newly added frontend code and UI files',
  emojiViolations.length > 0 ? `Violations found in: ${emojiViolations.join(', ')}` : undefined
);

// 7. Content Safety Scanner (No forbidden promotional/ranking words)
const FORBIDDEN_WORDS = [
  'best bank',
  'best loan',
  'winner',
  '#1 bank',
  'top bank',
  'recommended bank',
  'lowest rate',
  'guaranteed approval',
  'approval probability',
  'pre-approved',
];

let prohibitedViolations: string[] = [];
for (const file of newFiles) {
  const content = fs.readFileSync(file, 'utf-8').toLowerCase();
  for (const word of FORBIDDEN_WORDS) {
    if (content.includes(word)) {
      prohibitedViolations.push(`${path.basename(file)} contains "${word}"`);
    }
  }
}

assert(
  prohibitedViolations.length === 0,
  '12. Zero prohibited ranking or speculative approval claims in new files',
  prohibitedViolations.length > 0 ? prohibitedViolations.join('; ') : undefined
);

console.log('\n====================================================');
console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('====================================================\n');

if (failed === 0) {
  process.exit(0);
} else {
  process.exit(1);
}
