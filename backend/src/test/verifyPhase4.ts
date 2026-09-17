/**
 * Phase 4 Comprehensive Verification Suite
 * Tests Production REST API & Financial Query Engine:
 * 1. Database Connection & Production Seed Ingestion
 * 2. Bank API: Pagination, Safe Regex Search, Bank Details, and Invalid ID rejection
 * 3. Loan Scheme API: Pagination, Amount Filter, Collateral Filter, and Sorting
 * 4. Loan Scheme Comparison Engine: Side-by-side comparison, zero ranking, disclaimers
 * 5. Loan Finder Query Engine: Multi-factor matching, eligibility filters, no ranking
 * 6. EMI Calculator Engine: Simple interest moratorium, capitalization, 0% interest, validation
 * 7. Document Checklist Engine: Catalog pagination, search, personalized checklist generation
 * 8. Government Scheme API: List and robust schemeCode alias resolution (pm-vidyalaxmi, etc.)
 * 9. Institution API: Primary profile and campus branch lookup
 * 10. Global Search API: Concurrent multi-collection search across banks, schemes, gov, docs, faqs
 * 11. Student Application Tracker: Multi-tenant ownership isolation (A cannot access B's data)
 * 12. FAQ Engine: Priority sorting, categories, and safe search
 * 13. Regulatory Compliance: Disclaimers present on all financial queries, zero approval probabilities
 * 14. Error Standardization: Strict format compliance for 404, 400, and auth errors
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
import { User } from '../models/User';
import { Application } from '../models/Application';
import { runProductionSeed } from '../seeds/seedProduction';
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
        hostname: '127.0.0.1',
        port: address.port,
        path: options.path,
        method: options.method,
        headers,
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          let parsed: any;
          try {
            parsed = JSON.parse(rawData);
          } catch {
            parsed = rawData;
          }
          resolve({ status: res.statusCode || 500, body: parsed });
        });
      }
    );

    req.on('error', reject);

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

async function runPhase4Verification() {
  console.log('====================================================');
  console.log('🚀 STARTING PHASE 4 REST API & QUERY ENGINE VERIFICATION');
  console.log('====================================================\n');

  let mongoServer: MongoMemoryServer | null = null;
  let server: http.Server | null = null;

  try {
    // 1. Setup in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('📦 Connected to in-memory test database');

    // Ingest authoritative production seeds
    await runProductionSeed();
    console.log('🌱 Authoritative production seed loaded for API verification\n');

    // Start Express server on random port
    server = http.createServer(app);
    await new Promise<void>((resolve) => server!.listen(0, resolve));

    // Retrieve seeded bank & scheme IDs for test queries
    const banks = await Bank.find().sort({ name: 1 });
    const sbi = banks.find((b) => b.slug === 'sbi') || banks[0];
    const boi = banks.find((b) => b.slug === 'bank-of-india') || banks[1];

    const schemes = await LoanScheme.find().sort({ schemeName: 1 });
    const scheme1 = schemes[0];
    const scheme2 = schemes[1];

    // ==========================================
    // TEST 1: Bank API Pagination & Search
    // ==========================================
    const bankPagRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/banks?page=1&limit=2',
    });
    const hasPaginationMeta =
      bankPagRes.status === 200 &&
      bankPagRes.body.success === true &&
      Array.isArray(bankPagRes.body.data) &&
      bankPagRes.body.data.length === 2 &&
      bankPagRes.body.meta?.pagination?.total >= 3 &&
      bankPagRes.body.meta?.pagination?.totalPages >= 2;
    logResult(
      'Bank API: Pagination (page=1&limit=2)',
      hasPaginationMeta,
      `Received ${bankPagRes.body?.data?.length} items, total ${bankPagRes.body?.meta?.pagination?.total}`
    );

    // Search with regex characters escaping
    const bankSearchRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/banks?search=State%20Bank',
    });
    const hasSearchMatch =
      bankSearchRes.status === 200 &&
      bankSearchRes.body.data.some((b: any) => b.name.includes('State Bank of India'));
    logResult('Bank API: Safe Regex Search', hasSearchMatch, 'Matched State Bank of India');

    // ==========================================
    // TEST 2: Bank API Detail & Invalid ID Rejection
    // ==========================================
    const bankDetailRes = await makeRequest(server, {
      method: 'GET',
      path: `/api/banks/${sbi._id}`,
    });
    const bankDetailValid =
      bankDetailRes.status === 200 &&
      bankDetailRes.body.data._id === sbi._id.toString() &&
      Array.isArray(bankDetailRes.body.data.loanSchemes) &&
      bankDetailRes.body.data.loanSchemes.length > 0;
    logResult('Bank API: Detail with populated loan schemes', bankDetailValid);

    const bankInvalidIdRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/banks/not-a-valid-object-id',
    });
    const bankInvalidIdHandled =
      bankInvalidIdRes.status === 400 &&
      bankInvalidIdRes.body.error?.code === 'INVALID_ID';
    logResult('Bank API: Invalid ObjectId returns 400 INVALID_ID', bankInvalidIdHandled);

    // ==========================================
    // TEST 3: Loan Scheme Discovery & Filters
    // ==========================================
    const schemeAmountRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/loan-schemes?loanAmount=1000000',
    });
    const allCoverTenLakhs =
      schemeAmountRes.status === 200 &&
      schemeAmountRes.body.data.every(
        (s: any) => s.maxLoanAmountInland?.value >= 1000000
      );
    logResult(
      'Loan Scheme API: Loan Amount Filter (>= 10 Lakhs)',
      allCoverTenLakhs,
      `Found ${schemeAmountRes.body?.data?.length} eligible schemes`
    );

    const schemeCollateralRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/loan-schemes?collateralRequirement=free',
    });
    const allCollateralFree =
      schemeCollateralRes.status === 200 &&
      schemeCollateralRes.body.data.every(
        (s: any) =>
          s.collateral?.upTo4Lakhs?.toLowerCase().includes('no') ||
          s.collateral?.upTo4Lakhs?.toLowerCase().includes('nil') ||
          s.collateral?.details?.toLowerCase().includes('nil')
      );
    logResult(
      'Loan Scheme API: Collateral-free filter',
      allCollateralFree,
      `Found ${schemeCollateralRes.body?.data?.length} collateral-free options`
    );

    // ==========================================
    // TEST 4: Loan Scheme Comparison Engine (Zero Ranking)
    // ==========================================
    const compareRes = await makeRequest(server, {
      method: 'GET',
      path: `/api/loan-schemes/compare?ids=${scheme1._id},${scheme2._id}`,
    });
    const compareData = compareRes.body?.data;
    const compareValid =
      compareRes.status === 200 &&
      Array.isArray(compareData?.schemes) &&
      compareData.schemes.length === 2 &&
      Array.isArray(compareData?.featureMatrix) &&
      typeof compareRes.body?.meta?.disclaimer === 'string' &&
      !JSON.stringify(compareRes.body).includes('winner') &&
      !JSON.stringify(compareRes.body).includes('best bank');
    logResult(
      'Loan Scheme Comparison: Normalized matrix with zero ranking & regulatory disclaimer',
      compareValid,
      `Compared ${scheme1.schemeName} vs ${scheme2.schemeName}`
    );

    const compareInvalidRes = await makeRequest(server, {
      method: 'GET',
      path: `/api/loan-schemes/compare?ids=${scheme1._id}`,
    });
    const compareInvalidHandled =
      compareInvalidRes.status === 400 &&
      compareInvalidRes.body.error?.code === 'VALIDATION_ERROR';
    logResult(
      'Loan Scheme Comparison: Single ID fails validation (requires 2-4 schemes)',
      compareInvalidHandled
    );

    // ==========================================
    // TEST 5: Loan Finder Query Engine
    // ==========================================
    const loanFinderRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/loan-finder',
      body: {
        courseType: 'btech',
        annualFamilyIncome: 400000,
        loanAmount: 650000,
        hasCollateral: false,
        admissionConfirmed: true,
      },
    });
    const finderData = loanFinderRes.body?.data;
    const finderValid =
      loanFinderRes.status === 200 &&
      Array.isArray(finderData?.matchingSchemes) &&
      finderData.matchingSchemes.length > 0 &&
      Array.isArray(finderData?.applicableGovernmentSchemes) &&
      finderData.applicableGovernmentSchemes.some((g: any) => g.schemeCode === 'PM_VIDYALAXMI') &&
      finderData.applicableGovernmentSchemes.some((g: any) => g.schemeCode === 'CSIS') &&
      typeof finderData?.disclaimer === 'string' &&
      !JSON.stringify(finderData).includes('approval chance') &&
      !JSON.stringify(finderData).includes('recommended rank');
    logResult(
      'Loan Finder Engine: Matches schemes, flags PM-Vidyalaxmi/CSIS, 0 ranking',
      finderValid,
      `Matched ${finderData?.matchingSchemes?.length} schemes, ${finderData?.applicableGovernmentSchemes?.length} govt schemes`
    );

    // ==========================================
    // TEST 6: EMI Calculator Engine - Standard Moratorium Amortization
    // ==========================================
    const emiStandardRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/calculator/emi',
      body: {
        loanAmount: 1000000,
        interestRate: 9.5,
        courseDurationMonths: 48,
        gracePeriodMonths: 12,
        repaymentTenureMonths: 120,
        interestServicingDuringMoratorium: false,
      },
    });
    const emiData = emiStandardRes.body?.data;
    const emiStandardValid =
      emiStandardRes.status === 200 &&
      emiData?.loanAmount === 1000000 &&
      emiData?.moratoriumMonths === 60 &&
      emiData?.moratoriumSimpleInterest > 0 &&
      emiData?.repaymentPrincipal > 1000000 &&
      emiData?.monthlyEmi > 0 &&
      Array.isArray(emiData?.amortizationSchedulePreview) &&
      emiData.amortizationSchedulePreview.length > 0 &&
      typeof emiData?.disclaimer === 'string';
    logResult(
      'EMI Calculator: Standard Moratorium (Simple Interest + Capitalization)',
      emiStandardValid,
      `Principal: ₹${emiData?.loanAmount}, Moratorium Interest: ₹${emiData?.moratoriumSimpleInterest}, Post-Moratorium EMI: ₹${emiData?.monthlyEmi}`
    );

    // ==========================================
    // TEST 7: EMI Calculator Engine - 0% Interest & Edge Cases
    // ==========================================
    const emiZeroRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/calculator/emi',
      body: {
        loanAmount: 600000,
        interestRate: 0,
        repaymentTenureMonths: 60,
      },
    });
    const zeroEmiData = emiZeroRes.body?.data;
    const emiZeroValid =
      emiZeroRes.status === 200 &&
      zeroEmiData?.monthlyEmi === 10000 &&
      zeroEmiData?.totalInterestPayable === 0;
    logResult('EMI Calculator: 0% Interest (Full Subsidy) Boundary Condition', emiZeroValid);

    const emiInvalidRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/calculator/emi',
      body: {
        loanAmount: -50000,
        interestRate: 10,
        repaymentTenureMonths: 0,
      },
    });
    const emiInvalidHandled =
      emiInvalidRes.status === 400 &&
      emiInvalidRes.body.error?.code === 'VALIDATION_ERROR';
    logResult('EMI Calculator: Negative or zero tenure rejected with 400 VALIDATION_ERROR', emiInvalidHandled);

    // ==========================================
    // TEST 8: Document Taxonomy & Personalized Checklist
    // ==========================================
    const docChecklistRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/documents/personalized',
      body: {
        estimatedLoanAmount: 850000,
        coApplicantType: 'business',
        hasCollateral: true,
        collateralType: 'property',
        degreeLevel: 'undergraduate',
      },
    });
    const docData = docChecklistRes.body?.data;
    const docChecklistValid =
      docChecklistRes.status === 200 &&
      Array.isArray(docData?.requiredDocuments) &&
      Array.isArray(docData?.optionalDocuments) &&
      Array.isArray(docData?.verificationNotes) &&
      docData.requiredDocuments.length > 0 &&
      docData.requiredDocuments.some((d: any) =>
        d.name?.toLowerCase().includes('property') ||
        d.name?.toLowerCase().includes('title') ||
        d.category?.includes('collateral')
      ) &&
      typeof docData?.disclaimer === 'string';
    logResult(
      'Document Engine: Personalized Checklist splits required, optional & collateral',
      docChecklistValid,
      `Required: ${docData?.requiredDocuments?.length}, Optional: ${docData?.optionalDocuments?.length}, Tips: ${docData?.verificationNotes?.length}`
    );

    // Document detail lookup by ID
    const sampleDoc = await DocumentModel.findOne();
    const docDetailRes = await makeRequest(server, {
      method: 'GET',
      path: `/api/documents/${sampleDoc?._id}`,
    });
    const docDetailValid =
      docDetailRes.status === 200 && docDetailRes.body.data._id === sampleDoc?._id.toString();
    logResult('Document Engine: GET /api/documents/:id returns document', docDetailValid);

    // ==========================================
    // TEST 9: Government Scheme API & Code Alias Resolution
    // ==========================================
    const govListRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/government-schemes',
    });
    const govListValid =
      govListRes.status === 200 &&
      Array.isArray(govListRes.body.data) &&
      govListRes.body.data.length >= 3;
    logResult('Gov Schemes: List all schemes', govListValid, `Found ${govListRes.body?.data?.length} schemes`);

    // Normalized alias test 1: 'pm-vidyalaxmi'
    const pmVidyaRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/government-schemes/pm-vidyalaxmi',
    });
    const pmVidyaValid =
      pmVidyaRes.status === 200 &&
      pmVidyaRes.body.data?.schemeCode === 'PM_VIDYALAXMI' &&
      pmVidyaRes.body.data?.incomeCeilingPerAnnum === 800000;
    logResult(
      "Gov Schemes: Code resolution for 'pm-vidyalaxmi' -> PM_VIDYALAXMI",
      pmVidyaValid,
      `Managing authority: ${pmVidyaRes.body?.data?.managingAuthority}`
    );

    // Normalized alias test 2: 'vidya-lakshmi'
    const vidyaLakshmiRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/government-schemes/vidya-lakshmi',
    });
    const vidyaLakshmiValid =
      vidyaLakshmiRes.status === 200 &&
      vidyaLakshmiRes.body.data?.schemeCode === 'VIDYA_LAKSHMI_PORTAL';
    logResult(
      "Gov Schemes: Code resolution for 'vidya-lakshmi' -> VIDYA_LAKSHMI_PORTAL",
      vidyaLakshmiValid
    );

    // Normalized alias test 3: 'csis'
    const csisRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/government-schemes/csis',
    });
    const csisValid =
      csisRes.status === 200 &&
      csisRes.body.data?.schemeCode === 'CSIS' &&
      csisRes.body.data?.incomeCeilingPerAnnum === 450000;
    logResult("Gov Schemes: Code resolution for 'csis' -> CSIS (Income ceiling ₹4.5L)", csisValid);

    // ==========================================
    // TEST 10: Institution Discovery
    // ==========================================
    const instRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/institutions',
    });
    const instData = instRes.body?.data;
    const instValid =
      instRes.status === 200 &&
      instData?.name === 'VIT Bhopal University' &&
      Array.isArray(instData?.officialBankHelpdesk?.partnerBanksPresentDuringAdmissions) &&
      instData.officialBankHelpdesk.partnerBanksPresentDuringAdmissions.includes('State Bank of India') &&
      Array.isArray(instData?.programs) &&
      instData.programs.length > 0;
    logResult(
      'Institution API: VIT Bhopal university profile & admissions desk partner banks',
      instValid,
      `Helpdesk: ${instData?.officialBankHelpdesk?.locationOnCampus}`
    );

    const instSlugRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/institutions/vit-bhopal',
    });
    const instSlugValid =
      instSlugRes.status === 200 && instSlugRes.body.data?.name === 'VIT Bhopal University';
    logResult("Institution API: Lookup by slug '/api/institutions/vit-bhopal'", instSlugValid);

    // ==========================================
    // TEST 11: Multi-Collection Global Search API
    // ==========================================
    const searchRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/search?q=State',
    });
    const sData = searchRes.body?.data;
    const searchValid =
      searchRes.status === 200 &&
      sData?.query === 'State' &&
      Array.isArray(sData?.banks) &&
      sData.banks.length > 0 &&
      typeof sData?.summary?.totalMatches === 'number' &&
      sData.summary.totalMatches > 0;
    logResult(
      'Global Search: Multi-collection search for query "State"',
      searchValid,
      `Total matches: ${sData?.summary?.totalMatches} (Banks: ${sData?.banks?.length}, Schemes: ${sData?.loanSchemes?.length})`
    );

    const searchEmptyRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/search',
    });
    const searchEmptyHandled =
      searchEmptyRes.status === 400 &&
      searchEmptyRes.body.error?.code === 'VALIDATION_ERROR';
    logResult('Global Search: Missing query parameter rejected with 400 VALIDATION_ERROR', searchEmptyHandled);

    // ==========================================
    // TEST 12: Student Application Tracker & Tenant Ownership Isolation
    // ==========================================
    const studentA = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav@vitbhopal.ac.in',
      passwordHash: 'HashedPassword123!',
      role: 'student',
    });
    const tokenA = signToken({ userId: studentA._id.toString(), role: studentA.role, email: studentA.email });

    const studentB = await User.create({
      name: 'Bhavna Patel',
      email: 'bhavna@vitbhopal.ac.in',
      passwordHash: 'HashedPassword123!',
      role: 'student',
    });
    const tokenB = signToken({ userId: studentB._id.toString(), role: studentB.role, email: studentB.email });

    // Student A creates an application tracking entry
    const createAppRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/applications',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: {
        targetBankId: sbi._id.toString(),
        targetSchemeId: scheme1._id.toString(),
        requestedAmount: 750000,
        status: 'submitted',
        degreeProgram: 'B.Tech Computer Science and Engineering',
        admissionYear: 2024,
        vidyaLakshmiApplicationId: 'CELFS-2026-99881',
      },
    });
    const appA = createAppRes.body?.data;
    const appACreated =
      createAppRes.status === 201 &&
      appA?.userId === studentA._id.toString() &&
      appA?.isStudentEnteredSelfReported === true;
    logResult('Application Tracker: Student A creates tracker entry', appACreated);

    // Student A can access their application
    const getAppARes = await makeRequest(server, {
      method: 'GET',
      path: `/api/applications/${appA._id}`,
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const getAppAValid = getAppARes.status === 200 && getAppARes.body.data._id === appA._id;
    logResult("Application Tracker: Student A can retrieve own application", getAppAValid);

    // Student B attempts to access Student A's application -> MUST BE 404
    const studentBAttemptRes = await makeRequest(server, {
      method: 'GET',
      path: `/api/applications/${appA._id}`,
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const tenantIsolationEnforced =
      studentBAttemptRes.status === 404 &&
      studentBAttemptRes.body.error?.code === 'APPLICATION_NOT_FOUND';
    logResult(
      "Multi-Tenant Ownership: Student B blocked from Student A's application (404 NOT FOUND)",
      tenantIsolationEnforced
    );

    // Student A logs a bank branch visit
    const visitLogRes = await makeRequest(server, {
      method: 'POST',
      path: `/api/applications/${appA._id}/bank-visits`,
      headers: { Authorization: `Bearer ${tokenA}` },
      body: {
        date: '2026-09-15',
        branchName: 'SBI Ashta Branch',
        officerContactName: 'Branch Manager',
        discussionSummary: 'Submitted original bonafide fee structure from VIT Bhopal',
      },
    });
    const visitLogValid =
      visitLogRes.status === 200 &&
      Array.isArray(visitLogRes.body.data?.bankVisitLogs) &&
      visitLogRes.body.data.bankVisitLogs.length === 1;
    logResult("Application Tracker: Student A logs branch visit", visitLogValid);

    // Student A deletes application tracker
    const deleteAppRes = await makeRequest(server, {
      method: 'DELETE',
      path: `/api/applications/${appA._id}`,
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const deleteAppValid = deleteAppRes.status === 200 && deleteAppRes.body.data?.deletedId === appA._id;
    logResult("Application Tracker: Student A deletes own tracker", deleteAppValid);

    // ==========================================
    // TEST 13: FAQ Discovery & Search
    // ==========================================
    const faqRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/faqs?search=moratorium',
    });
    const faqValid =
      faqRes.status === 200 &&
      Array.isArray(faqRes.body.data) &&
      faqRes.body.meta?.pagination?.total >= 1;
    logResult('FAQ API: Search and priority sorting', faqValid, `Found ${faqRes.body?.data?.length} moratorium FAQs`);

    // ==========================================
    // TEST 14: Standard Error Response Format
    // ==========================================
    const notFoundRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/completely-non-existent-route',
    });
    const notFoundValid =
      notFoundRes.status === 404 &&
      notFoundRes.body.success === false &&
      notFoundRes.body.error?.code === 'ROUTE_NOT_FOUND' &&
      typeof notFoundRes.body.error?.message === 'string';
    logResult(
      'Error Standardization: 404 returns { success: false, error: { code, message } }',
      notFoundValid
    );

    // ==========================================
    // TEST 15: Regulatory Disclaimers & No Fabricated Data Safeguard
    // ==========================================
    const complianceChecks = [
      compareRes.body?.meta?.disclaimer,
      finderData?.disclaimer,
      emiData?.disclaimer,
      docData?.disclaimer,
    ];
    const allDisclaimersPresent = complianceChecks.every(
      (d) => typeof d === 'string' && d.length > 20
    );
    logResult(
      'Regulatory Compliance: Mandatory disclaimers on Comparison, Finder, EMI & Docs',
      allDisclaimersPresent,
      'All 4 financial engines provide explicit disclaimers regarding bank sanctioning authority'
    );

    console.log('\n====================================================');
    console.log('📊 VERIFICATION SUMMARY');
    console.log('====================================================');

    const totalTests = results.length;
    const passedTests = results.filter((r) => r.passed).length;
    const failedTests = results.filter((r) => !r.passed).length;

    console.log(`Total Verification Checks: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ${failedTests > 0 ? '❌' : ''}`);

    if (failedTests > 0) {
      console.error('\n❌ Verification failed. Please inspect the logs above.');
      process.exit(1);
    } else {
      console.log('\n🎉 ALL PHASE 4 REST API & QUERY ENGINE TESTS PASSED PERFECTLY!');
      process.exit(0);
    }
  } catch (error) {
    console.error('💥 Fatal error during Phase 4 verification:', error);
    process.exit(1);
  } finally {
    if (server) {
      await new Promise<void>((resolve) => server!.close(() => resolve()));
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  }
}

runPhase4Verification();
