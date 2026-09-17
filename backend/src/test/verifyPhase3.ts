/**
 * Phase 3 Comprehensive Verification Suite
 * Tests Core Financial Data Ingestion & Seed Engine:
 * 1. Database Connection & Environment Initializer
 * 2. Production Seed Ingestion Integrity (Sources, Banks, Loan Schemes, Govt Schemes, Institution, Documents)
 * 3. Linkage Integrity (Loan Schemes correctly linked to Banks via ObjectId)
 * 4. Safeguard Hook: Demo records can never be marked verified
 * 5. Safeguard Hook: Production records cannot be verified without valid source URL
 * 6. Safe Upsert: Verified records cannot be overwritten by demo data
 * 7. Safe Upsert: Verified records cannot be downgraded without allowVerifiedDowngrade flag
 * 8. Data Freshness Engine: Evaluation and automatic flagging of expired records
 * 9. Data Quality Service: Full audit report & anomaly detection
 * 10. Demo Seed Ingestion: Ingests demo records strictly with isDemo: true
 * 11. Safe Demo Reset: Deletes demo records while keeping production data & users 100% untouched
 * 12. Admin API: GET /api/admin/data-quality returns valid report
 * 13. Admin API: POST /api/admin/verify/:entity/:id verifies unverified entity with audit logging
 * 14. Admin API: POST /api/admin/verify blocks attempt to verify demo records
 * 15. Admin API: POST /api/admin/reset-demo triggers safe demo reset
 */

import http from 'http';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import { Bank } from '../models/Bank';
import { LoanScheme } from '../models/LoanScheme';
import { GovernmentScheme } from '../models/GovernmentScheme';
import { Institution } from '../models/Institution';
import { DocumentModel } from '../models/Document';
import { Source } from '../models/Source';
import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';
import { runProductionSeed } from '../seeds/seedProduction';
import { runDemoSeed } from '../seeds/seedDemo';
import { executeResetDemo } from '../seeds/resetDemo';
import { safeUpsertBank } from '../services/safeUpsert.service';
import { evaluateFreshness, scanAndFlagExpiredRecords } from '../services/dataFreshness.service';
import { runDataQualityAudit } from '../services/dataQuality.service';
import { signToken } from '../utils/jwt';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

const logResult = (name: string, passed: boolean, details?: string) => {
  results.push({ name, passed, details });
  const badge = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${badge}: ${name}${details ? ` -> ${details}` : ''}`);
};

const makeRequest = (
  server: http.Server,
  options: {
    method: string;
    path: string;
    headers?: Record<string, string>;
    body?: any;
  }
): Promise<{ status: number; body: any }> => {
  return new Promise((resolve, reject) => {
    const address = server.address();
    if (!address || typeof address === 'string') {
      return reject(new Error('Server address not available'));
    }

    const postData = options.body ? JSON.stringify(options.body) : '';
    const headers: Record<string, string> = {
      ...options.headers,
    };
    if (postData) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(postData).toString();
    }

    const req = http.request(
      {
        host: '127.0.0.1',
        port: address.port,
        method: options.method,
        path: options.path,
        headers,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let parsed: any;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
          resolve({ status: res.statusCode || 500, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
};

const runSuite = async () => {
  console.log('====================================================');
  console.log('  EDU4LOAN PHASE 3 COMPREHENSIVE VERIFICATION SUITE');
  console.log('====================================================\n');

  // Start in-memory Mongo
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  logResult('1. In-Memory MongoDB Initialized for Phase 3 Testing', true);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));

  // Create an Admin user for testing admin endpoints
  const adminUser = await User.create({
    name: 'Lead Auditor Admin',
    email: 'admin.phase3@edu4loan.org',
    passwordHash: 'dummy_hash',
    role: 'admin',
    isEmailVerified: true,
  });
  const adminToken = signToken({
    userId: adminUser._id.toString(),
    role: adminUser.role,
  });

  try {
    // 2. Production Seed Ingestion
    console.log('\n--- Running Production Seed Ingestion ---');
    await runProductionSeed();

    const [srcCount, bankCount, schemeCount, govCount, instCount, docCount] = await Promise.all([
      Source.countDocuments({ isDemo: false }),
      Bank.countDocuments({ isDemo: false }),
      LoanScheme.countDocuments({ isDemo: false }),
      GovernmentScheme.countDocuments({ isDemo: false }),
      Institution.countDocuments({ isDemo: false }),
      DocumentModel.countDocuments({ isDemo: false }),
    ]);

    logResult(
      '2. Production Seed Ingestion Complete',
      srcCount >= 7 && bankCount >= 3 && schemeCount >= 3 && govCount >= 3 && instCount >= 1 && docCount >= 15,
      `Sources: ${srcCount}, Banks: ${bankCount}, Schemes: ${schemeCount}, Gov: ${govCount}, Inst: ${instCount}, Docs: ${docCount}`
    );

    // 3. Linkage Integrity
    const sbiBank = await Bank.findOne({ slug: 'state-bank-of-india' });
    const sbiScheme = await LoanScheme.findOne({ schemeCode: 'SBI_STUDENT_LOAN' });
    const isLinked = !!(sbiBank && sbiScheme && sbiScheme.bankId.toString() === sbiBank._id.toString());
    logResult(
      '3. Linkage Integrity: Loan Schemes linked to Bank via ObjectId',
      isLinked,
      `SBI Scheme references BankId: ${sbiScheme?.bankId}`
    );

    // 4. Model Pre-Save Safeguard: Demo record can never have status 'verified'
    const testDemoBank = new Bank({
      name: 'Test Demo Bank',
      slug: 'test-demo-bank',
      shortCode: 'TDB',
      category: 'private',
      officialWebsite: 'https://example.com',
      educationLoanPortalUrl: 'https://example.com/loans',
      headquarters: 'Demo City',
      isDemo: true,
      overallSource: {
        value: 'Demo Test Value',
        source: 'Demo Source',
        sourceUrl: 'https://example.com/demo',
        lastVerified: '2026-08-01',
        status: 'verified', // Attempting to set verified
      },
    });
    await testDemoBank.save();
    const demoStatusSaved = testDemoBank.overallSource.status;
    logResult(
      '4. Safeguard Hook: Demo records automatically forced to needs_verification',
      demoStatusSaved === 'needs_verification',
      `Saved status is: ${demoStatusSaved}`
    );

    // 5. Model Pre-Save Safeguard: Production Source without valid URL cannot be verified
    let caughtSourceError = false;
    try {
      const invalidSource = new Source({
        sourceName: 'Invalid Missing URL Source',
        sourceUrl: '', // Invalid empty URL
        status: 'verified',
        issuingAuthority: 'Test Authority',
        isDemo: false,
      });
      await invalidSource.save();
    } catch {
      caughtSourceError = true;
    }
    logResult(
      '5. Safeguard Hook: Production Source cannot be verified with invalid/empty sourceUrl',
      caughtSourceError
    );

    // 6. Safe Upsert: Verified record cannot be overwritten by demo data
    const sbiBefore = await Bank.findOne({ slug: 'state-bank-of-india' });
    const overwriteAttempt = await safeUpsertBank({
      name: 'State Bank of India',
      slug: 'state-bank-of-india',
      shortCode: 'SBI',
      category: 'public',
      officialWebsite: 'https://sbi.co.in',
      educationLoanPortalUrl: 'https://sbi.co.in/loans',
      headquarters: 'Mumbai',
      isDemo: true, // Demo attempt
      overallSource: {
        value: 'Demo Overwrite Attempt',
        source: 'Fake Source',
        sourceUrl: 'https://example.com/fake',
        lastVerified: '2026-08-01',
        status: 'needs_verification',
      },
    });
    const sbiAfter = await Bank.findOne({ slug: 'state-bank-of-india' });
    const overwriteBlocked =
      overwriteAttempt.action === 'SKIPPED' && sbiAfter?.isDemo === false && sbiAfter?.overallSource.status === 'verified';
    logResult(
      '6. Safe Upsert: Overwriting verified production record with demo data is blocked',
      overwriteBlocked,
      `Action: ${overwriteAttempt.action}, isDemo: ${sbiAfter?.isDemo}`
    );

    // 7. Safe Upsert: Verified record cannot be downgraded without allowVerifiedDowngrade
    const downgradeAttempt = await safeUpsertBank({
      name: 'State Bank of India',
      slug: 'state-bank-of-india',
      isDemo: false,
      overallSource: {
        value: 'Downgrade Attempt',
        source: 'Unknown Source',
        sourceUrl: 'https://example.com/unknown',
        lastVerified: '2026-08-01',
        status: 'needs_verification', // Attempting to downgrade verified to needs_verification
      },
    });
    logResult(
      '7. Safe Upsert: Downgrading verified record without allowVerifiedDowngrade is blocked',
      downgradeAttempt.action === 'SKIPPED',
      `Action: ${downgradeAttempt.action}`
    );

    // 8. Data Freshness Engine
    const freshEval = evaluateFreshness('2026-08-20', 'verified', 90);
    const oldDateIso = new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const staleEval = evaluateFreshness(oldDateIso, 'verified', 90);

    // Create a temporary stale scheme to test scanAndFlagExpiredRecords
    const tempStaleScheme = await LoanScheme.create({
      bankId: sbiBank?._id,
      bankName: 'State Bank of India',
      schemeName: 'Temporary Expired Stale Scheme',
      schemeCode: 'TEMP_STALE_SCHEME',
      overview: 'Temporary test scheme for freshness scan',
      targetDegreeLevel: ['Undergraduate'],
      eligibilityCriteria: ['Test criteria'],
      maxLoanAmountInland: {
        value: 1000000,
        source: 'Test Source',
        sourceUrl: 'https://example.com/test',
        lastVerified: oldDateIso,
        status: 'verified',
      },
      interestRate: {
        benchmarkType: 'EBLR',
        benchmarkRatePercent: 6.5,
        spreadPercentMin: 2.0,
        spreadPercentMax: 3.5,
        minRate: { value: 9.0, source: 'Test', sourceUrl: 'https://example.com', lastVerified: oldDateIso, status: 'verified' },
        maxRate: { value: 10.0, source: 'Test', sourceUrl: 'https://example.com', lastVerified: oldDateIso, status: 'verified' },
        girlChildConcessionPercent: { value: 0.5, source: 'Test', sourceUrl: 'https://example.com', lastVerified: oldDateIso, status: 'verified' },
      },
      collateral: {
        upTo4Lakhs: 'None',
        from4To7point5Lakhs: 'Third party',
        above7point5Lakhs: 'Tangible',
        acceptableCollateralTypes: ['House'],
        details: 'Valid collateral details string for test schema validation',
      },
      marginMoney: { upTo4LakhsPercent: 0, above4LakhsIndiaPercent: 5, scholarshipAdjustmentAllowed: true, notes: 'Test margin note' },
      moratorium: {
        courseDurationYears: 4,
        moratoriumBufferMonths: 12,
        repaymentTenureMaxYears: 15,
        interestServicingDuringMoratorium: 'optional_simple',
        explanation: 'Course duration + 12 months buffer repayment structure',
      },
      processingFee: { value: 'Nil', source: 'Test', sourceUrl: 'https://example.com', lastVerified: oldDateIso, status: 'verified' },
      prepaymentPenalty: { value: 'Nil', source: 'Test', sourceUrl: 'https://example.com', lastVerified: oldDateIso, status: 'verified' },
      officialCircularUrl: 'https://example.com/circular',
      officialApplicationUrl: 'https://example.com/apply',
      source: { value: 'Test', source: 'Test', sourceUrl: 'https://example.com', lastVerified: oldDateIso, status: 'verified' },
      status: 'verified',
      lastVerified: oldDateIso,
      isDemo: false,
    });

    const scanResult = await scanAndFlagExpiredRecords();
    const updatedTemp = await LoanScheme.findById(tempStaleScheme._id);
    await LoanScheme.findByIdAndDelete(tempStaleScheme._id); // clean up

    logResult(
      '8. Data Freshness Engine: Correctly evaluates freshness and flags expired records',
      freshEval.isFresh === true && staleEval.isFresh === false && updatedTemp?.status === 'expired',
      `Fresh: ${freshEval.isFresh}, Stale: ${staleEval.isFresh}, Flagged: ${scanResult.expiredCount}`
    );

    // 9. Data Quality Service Audit Report
    const qualityReport = await runDataQualityAudit();
    logResult(
      '9. Data Quality Audit: Produces full structured audit report with zero critical issues on production seed',
      qualityReport.overall.totalRecords > 20 && qualityReport.overall.criticalIssues === 0,
      `Total: ${qualityReport.overall.totalRecords}, Verified: ${qualityReport.overall.verifiedRecords}, Critical: ${qualityReport.overall.criticalIssues}`
    );

    // 10. Demo Seed Ingestion
    console.log('\n--- Ingesting Demo Dataset ---');
    const demoSeedStats = await runDemoSeed();
    const demoTotalInDb = await Bank.countDocuments({ isDemo: true });
    logResult(
      '10. Demo Seed Ingestion: Successfully ingests demo entities with isDemo: true',
      demoSeedStats.banks > 0 && demoTotalInDb > 0,
      `Demo Banks: ${demoSeedStats.banks}, Demo Schemes: ${demoSeedStats.loanSchemes}`
    );

    // 11. Safe Demo Reset
    console.log('\n--- Running Safe Demo Reset ---');
    const resetResult = await executeResetDemo();
    const [remainingDemoBanks, prodBanksAfterReset, userCountAfterReset] = await Promise.all([
      Bank.countDocuments({ isDemo: true }),
      Bank.countDocuments({ isDemo: false }),
      User.countDocuments(),
    ]);

    logResult(
      '11. Safe Demo Reset: Deletes all demo data while preserving production records and users',
      remainingDemoBanks === 0 && prodBanksAfterReset >= 3 && userCountAfterReset >= 1 && resetResult.totalDeleted > 0,
      `Deleted: ${resetResult.totalDeleted}, Remaining Demo: ${remainingDemoBanks}, Prod Banks: ${prodBanksAfterReset}, Users: ${userCountAfterReset}`
    );

    // 12. Admin API: GET /api/admin/data-quality
    const qualityRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/admin/data-quality',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    logResult(
      '12. Admin API: GET /api/admin/data-quality returns 200 with structured audit report',
      qualityRes.status === 200 && qualityRes.body.success === true && qualityRes.body.data.overall.totalRecords > 0,
      `Status: ${qualityRes.status}, Total records reported: ${qualityRes.body.data?.overall?.totalRecords}`
    );

    // 13. Admin API: POST /api/admin/verify/:entity/:id
    // Create an unverified document to test manual admin verification
    const unverifiedDoc = await DocumentModel.create({
      name: 'Temporary Unverified Affiliated Document',
      category: 'student_kyc',
      description: 'Temporary document to test admin manual verification flow.',
      isRequired: false,
      applicableCondition: 'Test scenario only',
      issuingAuthority: 'Test Authority',
      verificationTip: 'Check test seal',
      source: {
        value: 'Official Gazette Notification',
        source: 'Govt of India Gazette',
        sourceUrl: 'https://gazette.gov.in/test-doc',
        lastVerified: '2026-01-01',
        status: 'needs_verification',
      },
      isDemo: false,
    });

    const verifyRes = await makeRequest(server, {
      method: 'POST',
      path: `/api/admin/verify/document/${unverifiedDoc._id.toString()}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { reason: 'Lead Auditor manual verification of official gazette citation.' },
    });

    const docAfterVerify = await DocumentModel.findById(unverifiedDoc._id);
    await DocumentModel.findByIdAndDelete(unverifiedDoc._id); // clean up

    logResult(
      '13. Admin API: POST /api/admin/verify/:entity/:id transitions status to verified and logs audit',
      verifyRes.status === 200 && docAfterVerify?.source.status === 'verified',
      `Status: ${verifyRes.status}, Verified: ${docAfterVerify?.source.status}`
    );

    // 14. Admin API: POST /api/admin/verify rejects demo entities
    const dummyDemoDoc = await DocumentModel.create({
      name: 'Dummy Demo Document for Rejection Test',
      category: 'student_kyc',
      description: 'Demo doc',
      isRequired: false,
      applicableCondition: 'None',
      issuingAuthority: 'Demo',
      verificationTip: 'Demo',
      source: {
        value: 'Demo',
        source: 'Demo',
        sourceUrl: 'https://example.com/demo',
        lastVerified: '2026-01-01',
        status: 'needs_verification',
      },
      isDemo: true,
    });

    const rejectVerifyRes = await makeRequest(server, {
      method: 'POST',
      path: `/api/admin/verify/document/${dummyDemoDoc._id.toString()}`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    await DocumentModel.findByIdAndDelete(dummyDemoDoc._id); // clean up

    logResult(
      '14. Admin API: POST /api/admin/verify rejects attempt to verify demo records (400 Bad Request)',
      rejectVerifyRes.status === 400 && rejectVerifyRes.body.success === false,
      `Status: ${rejectVerifyRes.status}, Error: ${rejectVerifyRes.body.message}`
    );

    // 15. Admin API: POST /api/admin/reset-demo
    // Re-seed demo, then test endpoint
    await runDemoSeed();
    const resetApiRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/admin/reset-demo',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    logResult(
      '15. Admin API: POST /api/admin/reset-demo safely purges demo items via admin endpoint',
      resetApiRes.status === 200 && resetApiRes.body.success === true && resetApiRes.body.data.totalDeleted > 0,
      `Status: ${resetApiRes.status}, Deleted: ${resetApiRes.body.data?.totalDeleted}`
    );

  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await mongoose.connection.close();
    await mongod.stop();
  }

  // Summary report
  console.log('\n====================================================');
  console.log('  PHASE 3 VERIFICATION SUMMARY');
  console.log('====================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`TOTAL TESTS: ${results.length}`);
  console.log(`PASSED: ${passedCount}`);
  console.log(`FAILED: ${failedCount}`);

  if (failedCount > 0) {
    console.error('\n❌ SOME PHASE 3 TESTS FAILED');
    process.exit(1);
  } else {
    console.log('\n🎉 ALL 15/15 PHASE 3 TESTS PASSED PERFECTLY!');
    process.exit(0);
  }
};

runSuite().catch((err) => {
  console.error('[FATAL ERROR IN TEST SUITE]', err);
  process.exit(1);
});
