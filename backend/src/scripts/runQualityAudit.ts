import { ensureDbForSeed, closeDbForSeed } from '../seeds/seedHelper';
import { runDataQualityAudit } from '../services/dataQuality.service';

const main = async () => {
  console.log('====================================================');
  console.log('  EDU4LOAN DATA QUALITY & INTEGRITY AUDIT');
  console.log('====================================================\n');

  await ensureDbForSeed();

  const report = await runDataQualityAudit();

  console.log('OVERALL AUDIT METRICS:');
  console.log(`- Total Records: ${report.overall.totalRecords}`);
  console.log(`- Verified: ${report.overall.verifiedRecords}`);
  console.log(`- Needs Verification: ${report.overall.needsVerificationRecords}`);
  console.log(`- Expired: ${report.overall.expiredRecords}`);
  console.log(`- Demo Records: ${report.overall.demoRecords}`);
  console.log(`- Total Issues: ${report.overall.totalIssues} (${report.overall.criticalIssues} Critical, ${report.overall.warningIssues} Warnings)`);

  console.log('\nBREAKDOWN BY COLLECTION:');
  for (const [colName, colSummary] of Object.entries(report.collections)) {
    console.log(`\n[${colName.toUpperCase()}]`);
    console.log(`  Total: ${colSummary.total} | Verified: ${colSummary.verified} | Needs Verification: ${colSummary.needsVerification} | Demo: ${colSummary.demo}`);
    if (colSummary.issues.length > 0) {
      console.log(`  Issues (${colSummary.issues.length}):`);
      colSummary.issues.forEach((issue) => {
        console.log(`    - [${issue.severity}] [${issue.issueType}] ${issue.name}: ${issue.details}`);
      });
    } else {
      console.log('  No issues found.');
    }
  }

  console.log('\n====================================================');
  console.log(`Audit Timestamp: ${report.timestamp}`);
  console.log('====================================================\n');

  await closeDbForSeed();
  process.exit(report.overall.criticalIssues > 0 ? 1 : 0);
};

main().catch(async (err) => {
  console.error('[AUDIT FATAL ERROR]', err);
  await closeDbForSeed();
  process.exit(1);
});
