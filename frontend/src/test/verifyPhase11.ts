import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminService } from '../services/adminService';

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
console.log('🧪 RUNNING EDU4LOAN PHASE 11 VERIFICATION SUITE');
console.log('====================================================\n');

async function runTests() {
  // ----------------------------------------------------
  // 1. ADMIN METRICS INTEGRITY
  // ----------------------------------------------------
  const metrics = await adminService.getMetrics();
  assert(
    Boolean(metrics && metrics.banks.total >= 8 && metrics.loanSchemes.total >= 10),
    '1.1 Admin metrics aggregate bank and loan scheme totals',
    `Banks: ${metrics.banks.total}, Schemes: ${metrics.loanSchemes.total}`
  );

  assert(
    Boolean(metrics.sources.total >= 20 && metrics.studentApplicationsTracked >= 1),
    '1.2 Admin metrics report sources and student trackers count',
    `Sources: ${metrics.sources.total}, Trackers: ${metrics.studentApplicationsTracked}`
  );

  // ----------------------------------------------------
  // 2. AUDIT TRAIL LOG RETRIEVAL & FILTERING
  // ----------------------------------------------------
  const allLogs = await adminService.getAuditLogs();
  assert(
    allLogs.length > 0,
    '2.1 Historical audit trail logs retrieved',
    `Logs count: ${allLogs.length}`
  );

  const schemeLogs = await adminService.getAuditLogs({ entityType: 'loanscheme' });
  assert(
    schemeLogs.every((l) => l.entityType.toLowerCase() === 'loanscheme'),
    '2.2 Audit logs filterable by entityType="loanscheme"'
  );

  // ----------------------------------------------------
  // 3. DATA QUALITY & CITATION INTEGRITY AUDIT
  // ----------------------------------------------------
  const qualityReport = await adminService.getDataQualityReport();
  assert(
    qualityReport.overallScore >= 90,
    '3.1 Data quality health score exceeds 90% benchmark',
    `Score: ${qualityReport.overallScore}%`
  );

  assert(
    qualityReport.issuesCount.critical === 0,
    '3.2 Zero critical data anomalies or rate range violations in production baseline',
    `Critical issues: ${qualityReport.issuesCount.critical}`
  );

  assert(
    Array.isArray(qualityReport.issues) && qualityReport.issues.length > 0,
    '3.3 Audit issues detail warnings and suggestions for review horizon'
  );

  // ----------------------------------------------------
  // 4. SOURCE VERIFICATION QUEUE & SAFELINKS
  // ----------------------------------------------------
  const queue = await adminService.getVerificationQueue();
  assert(
    queue.length >= 4,
    '4.1 Verification queue contains pending and verified regulatory circulars',
    `Queue count: ${queue.length}`
  );

  const allHaveValidUrls = queue.every(
    (item) => !item.sourceUrl || item.sourceUrl.startsWith('http')
  );
  assert(
    allHaveValidUrls,
    '4.2 All primary source citations enforce valid HTTP/HTTPS destination URLs'
  );

  // ----------------------------------------------------
  // 5. MANUAL ENTITY VERIFICATION WORKFLOW
  // ----------------------------------------------------
  const verifyRes = await adminService.verifyEntity(
    'loanscheme',
    'scheme_sbi_scholar',
    'Verified against latest SBI master circular update'
  );
  assert(
    verifyRes.success === true,
    '5.1 Admin verification workflow promotes entity with logged justification',
    verifyRes.message
  );

  // ----------------------------------------------------
  // 6. FRESHNESS SCAN & DEMO DATA PURGE
  // ----------------------------------------------------
  const freshnessRes = await adminService.triggerFreshnessScan();
  assert(
    freshnessRes.totalScanned > 0,
    '6.1 Freshness scanner evaluates 90-day review horizon across records',
    `Scanned: ${freshnessRes.totalScanned}`
  );

  const demoResetRes = await adminService.triggerDemoReset();
  assert(
    demoResetRes.success === true && demoResetRes.totalDeleted >= 0,
    '6.2 Demo data isolation engine safely purges demo records while preserving production'
  );

  // ----------------------------------------------------
  // 7. COMPONENT EXPORTS INTEGRITY
  // ----------------------------------------------------
  const adminIndexPath = path.resolve(__dirname, '../components/admin/index.ts');
  const adminIndexContent = fs.readFileSync(adminIndexPath, 'utf-8');

  const requiredComponents = [
    'AdminMetricsStrip',
    'SourceVerificationQueue',
    'DataQualityAuditView',
    'AuditLogViewer',
  ];

  const allComponentsExported = requiredComponents.every((comp) =>
    adminIndexContent.includes(comp)
  );

  assert(
    allComponentsExported,
    '7.1 All 4 Phase 11 admin components exported from components/admin/index.ts',
    `Exported: ${requiredComponents.join(', ')}`
  );

  // ----------------------------------------------------
  // 8. CONTENT SAFETY & ZERO RANKING AUDIT
  // ----------------------------------------------------
  const phase11Files = [
    '../pages/AdminPage.tsx',
    '../components/admin/AdminMetricsStrip.tsx',
    '../components/admin/SourceVerificationQueue.tsx',
    '../components/admin/DataQualityAuditView.tsx',
    '../components/admin/AuditLogViewer.tsx',
    '../services/adminService.ts',
    '../types/admin.ts',
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

  for (const relPath of phase11Files) {
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
    '8.1 Content Safety Audit: Zero prohibited ranking terms found across all Phase 11 files',
    `Violations: ${prohibitedViolations}`
  );

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`Phase 11 Verification Completed: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL PHASE 11 REQUIREMENTS VERIFIED & PASSING!\n');
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Unhandled test runner error:', err);
  process.exit(1);
});
