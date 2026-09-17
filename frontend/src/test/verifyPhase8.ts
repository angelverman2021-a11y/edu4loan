import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { documentService } from '../services/documentService';
import { PersonalizedChecklistParams } from '../types';

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
console.log('🧪 RUNNING EDU4LOAN PHASE 8 VERIFICATION SUITE');
console.log('====================================================\n');

async function runTests() {
  // ----------------------------------------------------
  // 1. TIER 1 PARTITIONING: LOAN <= 4 LAKHS, SALARIED
  // ----------------------------------------------------
  const tier1Params: PersonalizedChecklistParams = {
    estimatedLoanAmount: 400000,
    coApplicantType: 'salaried',
    hasCollateral: false,
    collateralType: 'none',
    applyingThroughVidyaLakshmi: true,
    degreeLevel: 'Undergraduate',
  };

  const tier1Checklist = await documentService.fetchPersonalizedChecklist(tier1Params);

  assert(
    tier1Checklist.requiredDocuments.length > 0,
    '1.1 Tier 1 Checklist contains mandatory documents',
    `Found ${tier1Checklist.requiredDocuments.length} required documents`
  );

  // Property collateral must be NOT APPLICABLE
  const propertyInTier1 = tier1Checklist.requiredDocuments.some(
    (d) => d.category === 'collateral_property'
  );
  assert(
    !propertyInTier1,
    '1.2 Collateral property documents are strictly NOT required for loans <= 4 Lakhs'
  );

  // Salaried income must be required
  const salariedInTier1 = tier1Checklist.requiredDocuments.some(
    (d) => d.category === 'coapplicant_income_salaried'
  );
  assert(
    salariedInTier1,
    '1.3 Salaried co-applicant income documents (Form 16/Payslips) are required'
  );

  // Self-employed income must be not applicable
  const selfEmployedInTier1 = tier1Checklist.requiredDocuments.some(
    (d) => d.category === 'coapplicant_income_selfemployed'
  );
  assert(
    !selfEmployedInTier1,
    '1.4 Self-employed documents are correctly excluded for salaried profiles'
  );

  // ----------------------------------------------------
  // 2. TIER 2 PARTITIONING: LOAN = 7.5 LAKHS, SELF-EMPLOYED
  // ----------------------------------------------------
  const tier2Params: PersonalizedChecklistParams = {
    estimatedLoanAmount: 750000,
    coApplicantType: 'self_employed',
    hasCollateral: false,
    collateralType: 'none',
    applyingThroughVidyaLakshmi: true,
    degreeLevel: 'Undergraduate',
  };

  const tier2Checklist = await documentService.fetchPersonalizedChecklist(tier2Params);

  // Property collateral still not required under CGFSEL up to 7.5L
  const propertyInTier2 = tier2Checklist.requiredDocuments.some(
    (d) => d.category === 'collateral_property'
  );
  assert(
    !propertyInTier2,
    '2.1 Loans <= 7.5 Lakhs do not mandate physical property collateral under CGFSEL guarantee'
  );

  // Self-employed documents must be required
  const selfEmployedInTier2 = tier2Checklist.requiredDocuments.some(
    (d) => d.category === 'coapplicant_income_selfemployed'
  );
  assert(
    selfEmployedInTier2,
    '2.2 Self-employed co-applicant income documents (ITR/Business proof) are required'
  );

  // ----------------------------------------------------
  // 3. TIER 3 PARTITIONING: LOAN = 15 LAKHS, PROPERTY COLLATERAL
  // ----------------------------------------------------
  const tier3Params: PersonalizedChecklistParams = {
    estimatedLoanAmount: 1500000,
    coApplicantType: 'salaried',
    hasCollateral: true,
    collateralType: 'property',
    applyingThroughVidyaLakshmi: true,
    degreeLevel: 'Undergraduate',
  };

  const tier3Checklist = await documentService.fetchPersonalizedChecklist(tier3Params);

  const propertyInTier3 = tier3Checklist.requiredDocuments.some(
    (d) => d.category === 'collateral_property'
  );
  assert(
    propertyInTier3,
    '3.1 Loans > 7.5 Lakhs with property collateral correctly require title deeds and encumbrance certificates'
  );

  // ----------------------------------------------------
  // 4. POSTGRADUATE VS UNDERGRADUATE DEGREE REQUIREMENTS
  // ----------------------------------------------------
  const pgParams: PersonalizedChecklistParams = {
    ...tier1Params,
    degreeLevel: 'Postgraduate',
  };

  const pgChecklist = await documentService.fetchPersonalizedChecklist(pgParams);
  const collegeGradInPg = pgChecklist.requiredDocuments.some(
    (d) => d._id === 'doc_degree_grad'
  );
  assert(
    collegeGradInPg,
    '4.1 Postgraduate degree applications mandate college graduation marksheets'
  );

  const ugGradInUg = tier1Checklist.requiredDocuments.some(
    (d) => d._id === 'doc_degree_grad'
  );
  assert(
    !ugGradInUg,
    '4.2 Undergraduate B.Tech applications do not require college graduation degree'
  );

  // ----------------------------------------------------
  // 5. READINESS SCORE ENGINE
  // ----------------------------------------------------
  const allReqDocs = tier1Checklist.requiredDocuments;

  // Case A: 0 checked
  const scoreEmpty = documentService.calculateReadinessScore(allReqDocs, {});
  assert(
    scoreEmpty.percentage === 0 && !scoreEmpty.isReady && scoreEmpty.completedCount === 0,
    '5.1 Readiness score returns 0% when zero documents are checked'
  );

  // Case B: Partial checked (first 3)
  const partialChecked: Record<string, boolean> = {};
  allReqDocs.slice(0, 3).forEach((d) => {
    partialChecked[d._id] = true;
  });
  const scorePartial = documentService.calculateReadinessScore(allReqDocs, partialChecked);
  assert(
    scorePartial.completedCount === 3 &&
      scorePartial.percentage === Math.round((3 / allReqDocs.length) * 100) &&
      !scorePartial.isReady,
    '5.2 Partial readiness accurately computes completion percentage',
    `Expected ${Math.round((3 / allReqDocs.length) * 100)}%, got ${scorePartial.percentage}%`
  );

  // Case C: 100% checked
  const fullChecked: Record<string, boolean> = {};
  allReqDocs.forEach((d) => {
    fullChecked[d._id] = true;
  });
  const scoreFull = documentService.calculateReadinessScore(allReqDocs, fullChecked);
  assert(
    scoreFull.percentage === 100 && scoreFull.isReady && scoreFull.pendingRequiredNames.length === 0,
    '5.3 Readiness score returns 100% and isReady: true when all required documents are checked'
  );

  // ----------------------------------------------------
  // 6. MASTER CATALOG & SEARCH FILTERING
  // ----------------------------------------------------
  const masterCatalog = await documentService.fetchDocuments();
  assert(
    masterCatalog.documents.length >= 10,
    '6.1 Master catalog returns complete document taxonomy',
    `Count: ${masterCatalog.documents.length}`
  );

  const kycDocs = await documentService.fetchDocuments({ category: 'student_kyc' });
  assert(
    kycDocs.documents.length > 0 &&
      kycDocs.documents.every((d) => d.category === 'student_kyc'),
    '6.2 Category filter strictly returns student KYC documents'
  );

  const searchDocs = await documentService.fetchDocuments({ search: 'Aadhaar' });
  assert(
    searchDocs.documents.length > 0 &&
      searchDocs.documents.some((d) => d.name.includes('Aadhaar')),
    '6.3 Keyword search finds documents containing search term'
  );

  // ----------------------------------------------------
  // 7. VIT BHOPAL SPECIFIC DOCUMENTS
  // ----------------------------------------------------
  const vitDocs = masterCatalog.documents.filter(
    (d) => d.category === 'vit_bhopal_admission'
  );
  assert(
    vitDocs.length >= 3,
    '7.1 VIT Bhopal institutional documents present in taxonomy',
    `Found ${vitDocs.length} institutional documents`
  );

  const hasRankCard = vitDocs.some((d) => d.name.toLowerCase().includes('viteee') || d.name.toLowerCase().includes('rank'));
  const hasFeeStructure = vitDocs.some((d) => d.name.toLowerCase().includes('fee structure') || d.name.toLowerCase().includes('bonafide'));
  assert(
    hasRankCard && hasFeeStructure,
    '7.2 VIT Bhopal admissions rank card and official fee structure exist with verification tips'
  );

  // ----------------------------------------------------
  // 8. CSV EXPORT ENGINE
  // ----------------------------------------------------
  const csvContent = documentService.exportChecklistToCsv(tier1Checklist, partialChecked);
  assert(
    csvContent.includes('Document Name,Classification,Readiness Status,Category,Issuing Authority,Verification Instruction') &&
      csvContent.includes('MANDATORY REQUIRED') &&
      csvContent.includes('NOT APPLICABLE FOR YOUR PROFILE'),
    '8.1 CSV export contains structured RFC-4180 headers and classified rows'
  );

  // ----------------------------------------------------
  // 9. COMPONENT EXPORTS INTEGRITY
  // ----------------------------------------------------
  const componentsIndexPath = path.resolve(__dirname, '../components/documents/index.ts');
  const componentsIndexContent = fs.readFileSync(componentsIndexPath, 'utf-8');

  const requiredComponents = [
    'PersonalizedChecklistGenerator',
    'DocumentCatalogBrowser',
    'VitBhopalDocGuide',
    'DocumentPrepPack',
  ];

  const allComponentsExported = requiredComponents.every((comp) =>
    componentsIndexContent.includes(comp)
  );

  assert(
    allComponentsExported,
    '9.1 All 4 Phase 8 document components are exported from documents/index.ts',
    `Exported components: ${requiredComponents.join(', ')}`
  );

  // ----------------------------------------------------
  // 10. CONTENT SAFETY & ZERO RANKING AUDIT
  // ----------------------------------------------------
  const phase8Files = [
    '../pages/DocumentsPage.tsx',
    '../components/documents/PersonalizedChecklistGenerator.tsx',
    '../components/documents/DocumentCatalogBrowser.tsx',
    '../components/documents/VitBhopalDocGuide.tsx',
    '../components/documents/DocumentPrepPack.tsx',
    '../services/documentService.ts',
    '../types/document.ts',
  ];

  const prohibitedPatterns = [
    /\bbest bank\b/i,
    /\bwinner\b/i,
    /\blowest rate\b/i,
    /\btop rated\b/i,
    /\brecommended bank\b/i,
    /\bguaranteed approval\b/i,
    /\beasiest documentation\b/i,
    /\bcheapest loan\b/i,
  ];

  let prohibitedViolations = 0;

  for (const relPath of phase8Files) {
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
    '10.1 Content Safety Audit: Zero prohibited ranking terms found across all Phase 8 files',
    `Prohibited violations: ${prohibitedViolations}`
  );

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`Phase 8 Verification Completed: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL PHASE 8 REQUIREMENTS VERIFIED & PASSING!\n');
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Unhandled test runner error:', err);
  process.exit(1);
});
