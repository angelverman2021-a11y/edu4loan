import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { governmentSchemeService } from '../services/governmentSchemeService';

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
console.log('🧪 RUNNING EDU4LOAN PHASE 9 VERIFICATION SUITE');
console.log('====================================================\n');

async function runTests() {
  // ----------------------------------------------------
  // 1. GOVERNMENT SCHEMES CATALOG INTEGRITY
  // ----------------------------------------------------
  const schemes = await governmentSchemeService.fetchGovernmentSchemes();
  assert(
    schemes.length >= 4,
    '1.1 Government schemes catalog contains required statutory schemes',
    `Count: ${schemes.length}`
  );

  const codes = schemes.map((s) => s.code);
  assert(
    codes.includes('PM_VIDYALAXMI') &&
      codes.includes('CSIS') &&
      codes.includes('VIDYA_LAKSHMI_PORTAL') &&
      codes.includes('CGFSEL'),
    '1.2 Critical scheme codes present (PM_VIDYALAXMI, CSIS, VIDYA_LAKSHMI_PORTAL, CGFSEL)'
  );

  // ----------------------------------------------------
  // 2. CODE RESOLUTION & ALIAS SUPPORT
  // ----------------------------------------------------
  const pmVidya = await governmentSchemeService.fetchSchemeByCode('pm-vidyalaxmi');
  assert(
    Boolean(pmVidya && pmVidya.code === 'PM_VIDYALAXMI'),
    '2.1 Normalized alias resolution for "pm-vidyalaxmi" -> PM_VIDYALAXMI'
  );

  const csis = await governmentSchemeService.fetchSchemeByCode('csis');
  assert(
    Boolean(csis && csis.code === 'CSIS'),
    '2.2 Normalized alias resolution for "csis" -> CSIS'
  );

  const vlp = await governmentSchemeService.fetchSchemeByCode('vidya-lakshmi');
  assert(
    Boolean(vlp && vlp.code === 'VIDYA_LAKSHMI_PORTAL'),
    '2.3 Normalized alias resolution for "vidya-lakshmi" -> VIDYA_LAKSHMI_PORTAL'
  );

  // ----------------------------------------------------
  // 3. SUBSIDY ELIGIBILITY CALCULATOR - SCENARIO A: EWS (INCOME <= 4.5L)
  // ----------------------------------------------------
  const ewsResult = governmentSchemeService.evaluateSubsidyEligibility({
    annualIncome: 350000,
    loanAmount: 1000000,
    institutionType: 'nirf_top_100_200',
    degreeLevel: 'Undergraduate',
  });

  assert(
    ewsResult.isCsisEligible === true,
    '3.1 EWS family income (₹3.5L) qualifies for CSIS 100% moratorium interest waiver'
  );

  assert(
    ewsResult.isPmVidyalaxmiEligible === true,
    '3.2 Income (₹3.5L) also falls within PM-Vidyalaxmi (≤ ₹8.0L) ceiling'
  );

  // ----------------------------------------------------
  // 4. SUBSIDY ELIGIBILITY CALCULATOR - SCENARIO B: MID INCOME (4.5L < INCOME <= 8.0L)
  // ----------------------------------------------------
  const midIncomeResult = governmentSchemeService.evaluateSubsidyEligibility({
    annualIncome: 600000,
    loanAmount: 1000000,
    institutionType: 'nirf_top_100_200',
    degreeLevel: 'Undergraduate',
  });

  assert(
    midIncomeResult.isCsisEligible === false,
    '4.1 Income ₹6.0L correctly disqualified from CSIS (exceeds ₹4.5L cap)'
  );

  assert(
    midIncomeResult.isPmVidyalaxmiEligible === true,
    '4.2 Income ₹6.0L correctly qualifies for PM-Vidyalaxmi 3% subvention (within ₹8.0L cap)'
  );

  // ----------------------------------------------------
  // 5. SUBSIDY ELIGIBILITY CALCULATOR - SCENARIO C: CGFSEL GUARANTEE (LOAN <= 7.5L)
  // ----------------------------------------------------
  const guaranteeResult = governmentSchemeService.evaluateSubsidyEligibility({
    annualIncome: 1000000,
    loanAmount: 650000,
    institutionType: 'nirf_top_100_200',
    degreeLevel: 'Undergraduate',
  });

  assert(
    guaranteeResult.isCgfselEligible === true,
    '5.1 Loan quantum ₹6.5L qualifies for 75% CGFSEL credit guarantee without physical collateral'
  );

  assert(
    guaranteeResult.isCsisEligible === false && guaranteeResult.isPmVidyalaxmiEligible === false,
    '5.2 High income (₹10L) correctly disqualified from interest subsidies'
  );

  // ----------------------------------------------------
  // 6. SUBSIDY ELIGIBILITY CALCULATOR - SCENARIO D: NON-SUBSIDIZED
  // ----------------------------------------------------
  const nonSubsidized = governmentSchemeService.evaluateSubsidyEligibility({
    annualIncome: 1500000,
    loanAmount: 1500000,
    institutionType: 'nirf_top_100_200',
    degreeLevel: 'Undergraduate',
  });

  assert(
    nonSubsidized.matchedSchemes.length === 0,
    '6.1 High income (₹15L) and high loan (₹15L) correctly yields 0 matched central subsidies'
  );

  // ----------------------------------------------------
  // 7. COMPONENT EXPORTS INTEGRITY
  // ----------------------------------------------------
  const componentsIndexPath = path.resolve(__dirname, '../components/schemes/index.ts');
  const componentsIndexContent = fs.readFileSync(componentsIndexPath, 'utf-8');

  const requiredComponents = ['VidyaLakshmiGuide', 'PmVidyalaxmiGuide', 'SubsidyEligibilityChecker'];

  const allComponentsExported = requiredComponents.every((comp) =>
    componentsIndexContent.includes(comp)
  );

  assert(
    allComponentsExported,
    '7.1 All 3 Phase 9 scheme components are exported from schemes/index.ts',
    `Exported components: ${requiredComponents.join(', ')}`
  );

  // ----------------------------------------------------
  // 8. CONTENT SAFETY & ZERO RANKING AUDIT
  // ----------------------------------------------------
  const phase9Files = [
    '../pages/GovtSchemesPage.tsx',
    '../pages/VitBhopalPage.tsx',
    '../components/schemes/VidyaLakshmiGuide.tsx',
    '../components/schemes/PmVidyalaxmiGuide.tsx',
    '../components/schemes/SubsidyEligibilityChecker.tsx',
    '../services/governmentSchemeService.ts',
    '../types/governmentScheme.ts',
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

  for (const relPath of phase9Files) {
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
    '8.1 Content Safety Audit: Zero prohibited ranking terms found across all Phase 9 files',
    `Prohibited violations: ${prohibitedViolations}`
  );

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`Phase 9 Verification Completed: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL PHASE 9 REQUIREMENTS VERIFIED & PASSING!\n');
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Unhandled test runner error:', err);
  process.exit(1);
});
