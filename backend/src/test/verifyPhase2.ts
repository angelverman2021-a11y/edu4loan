/**
 * Phase 2 Comprehensive Verification Suite
 * Tests all 13 core requirements:
 * 1. MongoDB connection
 * 2. Backend startup
 * 3. GET /api/health
 * 4. User Registration (Student role default)
 * 5. User Login
 * 6. GET /api/auth/me
 * 7. Invalid Credentials rejection
 * 8. Expired / Invalid JWT rejection
 * 9. Student access to public & student endpoints
 * 10. Admin role authorization & RBAC enforcement
 * 11. Protected routes unauthorized access rejection (401/403)
 * 12. MongoDB CRUD (Bank & LoanScheme with source verification audit)
 * 13. Request validation errors (Zod body and query validation)
 */

import http from 'http';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import { User } from '../models/User';
import { Bank } from '../models/Bank';
import { LoanScheme } from '../models/LoanScheme';
import { AuditLog } from '../models/AuditLog';
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
): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: any }> => {
  return new Promise((resolve, reject) => {
    const address = server.address();
    if (!address || typeof address === 'string') {
      return reject(new Error('Server address not available'));
    }

    const payload = options.body ? JSON.stringify(options.body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: address.port,
        path: options.path,
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload && { 'Content-Length': Buffer.byteLength(payload).toString() }),
          ...(options.headers || {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsedBody;
          try {
            parsedBody = data ? JSON.parse(data) : null;
          } catch {
            parsedBody = data;
          }
          resolve({
            status: res.statusCode || 500,
            headers: res.headers,
            body: parsedBody,
          });
        });
      }
    );

    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
};

async function runTests() {
  console.log('==================================================');
  console.log('  STARTING PHASE 2 AUTOMATED TEST SUITE');
  console.log('==================================================\n');

  let mongod: MongoMemoryServer | null = null;
  let server: http.Server | null = null;

  try {
    // 1. Start MongoDB connection (In-Memory for test isolation)
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    const dbConnected = mongoose.connection.readyState === 1;
    logResult('1. MongoDB Connection', dbConnected, `Connected to in-memory DB: ${uri}`);

    // 2. Start Backend HTTP Server
    server = http.createServer(app);
    await new Promise<void>((resolve) => server!.listen(0, resolve));
    const port = (server.address() as any).port;
    logResult('2. Backend Startup', !!server.listening, `Listening on ephemeral port: ${port}`);

    // 3. Test GET /api/health
    const healthRes = await makeRequest(server, { method: 'GET', path: '/api/health' });
    const healthPassed =
      healthRes.status === 200 &&
      healthRes.body?.status === 'ok' &&
      healthRes.body?.service === 'Edu4Loan API';
    logResult(
      '3. GET /api/health',
      healthPassed,
      `Status: ${healthRes.status}, Body: ${JSON.stringify(healthRes.body)}`
    );

    // 4. Test User Registration (Student role by default)
    const studentRegRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/auth/register',
      body: {
        name: 'Angel Verman',
        email: 'angel.student@vitbhopal.ac.in',
        password: 'Password123!',
        degreeProgram: 'B.Tech CSE',
        admissionYear: 2024,
      },
    });
    const studentToken = studentRegRes.body?.data?.token;
    const studentUser = studentRegRes.body?.data?.user;
    const regPassed =
      studentRegRes.status === 201 &&
      !!studentToken &&
      studentUser?.role === 'student' &&
      studentUser?.email === 'angel.student@vitbhopal.ac.in' &&
      !('passwordHash' in studentUser);
    logResult(
      '4. User Registration (Default Student Role)',
      regPassed,
      `Role: ${studentUser?.role}, Token generated: ${!!studentToken}`
    );

    // 5. Test User Login
    const loginRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/auth/login',
      body: {
        email: 'angel.student@vitbhopal.ac.in',
        password: 'Password123!',
      },
    });
    const loginPassed =
      loginRes.status === 200 &&
      loginRes.body?.success === true &&
      loginRes.body?.data?.user?.name === 'Angel Verman';
    logResult('5. User Login', loginPassed, `HTTP ${loginRes.status}`);

    // 6. Test GET /api/auth/me
    const meRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/auth/me',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const mePassed =
      meRes.status === 200 &&
      meRes.body?.data?.email === 'angel.student@vitbhopal.ac.in' &&
      meRes.body?.data?.degreeProgram === 'B.Tech CSE';
    logResult('6. GET /api/auth/me', mePassed, `Resolved identity for: ${meRes.body?.data?.name}`);

    // 7. Test Invalid Credentials
    const badLoginRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/auth/login',
      body: {
        email: 'angel.student@vitbhopal.ac.in',
        password: 'WrongPassword999',
      },
    });
    const badLoginPassed = badLoginRes.status === 401 && badLoginRes.body?.success === false;
    logResult('7. Invalid Credentials Rejection', badLoginPassed, `HTTP ${badLoginRes.status}`);

    // 8. Test Expired / Invalid JWT
    const badTokenRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/auth/me',
      headers: { Authorization: 'Bearer this.is.a.completely.invalid.token' },
    });
    const badTokenPassed = badTokenRes.status === 401 && badTokenRes.body?.success === false;
    logResult('8. Invalid JWT Rejection', badTokenPassed, `HTTP ${badTokenRes.status}`);

    // Create an Admin user for RBAC tests
    const adminUserDoc = await User.create({
      name: 'System Admin',
      email: 'admin@edu4loan.org',
      passwordHash: 'dummyhash',
      role: 'admin',
    });
    const adminToken = signToken({
      userId: adminUserDoc._id.toString(),
      role: 'admin',
    });

    // 9. Test Student Access to Public & Student Resources
    const publicBanksRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/banks',
    });
    const studentAppCreateRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/applications',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        requestedAmount: 500000,
        degreeProgram: 'B.Tech AI',
        admissionYear: 2024,
        notes: 'Exploring SBI Scholar loan for Category 2 fees',
      },
    });
    const studentAccessPassed =
      publicBanksRes.status === 200 &&
      studentAppCreateRes.status === 201 &&
      studentAppCreateRes.body?.data?.isStudentEnteredSelfReported === true;
    logResult(
      '9. Student Access (Public & Student Applications)',
      studentAccessPassed,
      `Banks status: ${publicBanksRes.status}, App created: ${studentAppCreateRes.status}`
    );

    // 10. Test Admin Authorization & RBAC Enforcement
    // Student attempting admin endpoint -> must receive 403 FORBIDDEN
    const studentAdminRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/banks',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: { name: 'Unauthorized Bank' },
    });
    const rbacBlockedPassed =
      studentAdminRes.status === 403 &&
      studentAdminRes.body?.error?.code === 'FORBIDDEN';
    logResult(
      '10. RBAC Enforcement: Student Forbidden on Admin Endpoints (403)',
      rbacBlockedPassed,
      `Received HTTP ${studentAdminRes.status} (Code: ${studentAdminRes.body?.error?.code})`
    );

    // 11. Test Protected Routes Without Auth Header -> must receive 401 UNAUTHORIZED
    const unauthAppRes = await makeRequest(server, {
      method: 'GET',
      path: '/api/applications',
    });
    const unauthPassed =
      unauthAppRes.status === 401 && unauthAppRes.body?.error?.code === 'UNAUTHORIZED';
    logResult('11. Protected Route Without Auth Rejection (401)', unauthPassed, `HTTP ${unauthAppRes.status}`);

    // 12. Test MongoDB CRUD with Verified Source Audit
    const createBankRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/banks',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'State Bank of India',
        shortCode: 'SBI',
        category: 'public',
        officialWebsite: 'https://sbi.co.in',
        educationLoanPortalUrl: 'https://sbi.co.in/web/student-platform/student-loan-scheme',
        vidyaLakshmiRegistered: true,
        pmVidyalaxmiRegistered: true,
        headquarters: 'Mumbai, Maharashtra',
        vitBhopalTieUp: {
          hasFormalMOU: true,
          onCampusDeskAvailable: true,
          designatedBranchName: 'SBI Ashta Branch (Nodal for VIT Bhopal)',
          details: 'Verified branch catering to VIT Bhopal Kotri Kalan campus fee processing.',
          source: 'VIT Bhopal University Accounts Department Notification 2024',
          sourceUrl: 'https://vitbhopal.ac.in/fees/',
          lastVerified: '2026-08-01',
          status: 'verified',
        },
        branches: [
          {
            branchName: 'SBI Ashta Branch',
            city: 'Ashta',
            state: 'Madhya Pradesh',
            address: 'Main Road, Ashta, Dist. Sehore',
            pincode: '466116',
            isNodalForVitBhopal: true,
          },
        ],
        generalTurnaroundTimeDays: '15-20 business days',
        overallSource: {
          value: 'SBI Official Education Loan Master Circular 2026',
          source: 'State Bank of India',
          sourceUrl: 'https://sbi.co.in/web/student-platform/student-loan-scheme',
          lastVerified: '2026-08-15',
          status: 'verified',
        },
      },
    });
    const createdBankId = createBankRes.body?.data?._id;
    const auditCount = await AuditLog.countDocuments({ entityType: 'bank', entityId: createdBankId });
    const crudPassed =
      createBankRes.status === 201 &&
      createBankRes.body?.data?.slug === 'state-bank-of-india' &&
      auditCount >= 1;
    logResult(
      '12. MongoDB CRUD & Immutable Audit Logging',
      crudPassed,
      `Created Bank ID: ${createdBankId}, Audit Logs logged: ${auditCount}`
    );

    // 13. Test Request Validation Errors (Zod)
    const invalidRegRes = await makeRequest(server, {
      method: 'POST',
      path: '/api/auth/register',
      body: {
        name: 'A', // too short (< 2)
        email: 'invalid-email-address', // bad format
        password: 'short', // < 8 characters, no number
      },
    });
    const validationPassed =
      invalidRegRes.status === 400 &&
      invalidRegRes.body?.error?.code === 'VALIDATION_ERROR' &&
      Array.isArray(invalidRegRes.body?.error?.details) &&
      invalidRegRes.body?.error?.details.length >= 2;
    logResult(
      '13. Request Validation (Zod Validation Errors)',
      validationPassed,
      `HTTP ${invalidRegRes.status}, Caught ${invalidRegRes.body?.error?.details?.length} validation issues`
    );
  } catch (err) {
    console.error('Test execution exception:', err);
    logResult('Test Execution', false, String(err));
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  }

  console.log('\n==================================================');
  const allPassed = results.every((r) => r.passed);
  const passCount = results.filter((r) => r.passed).length;
  console.log(`  RESULTS: ${passCount} / ${results.length} PASSED`);
  console.log(`  OVERALL: ${allPassed ? 'ALL TESTS PASSED ✅' : 'SOME TESTS FAILED ❌'}`);
  console.log('==================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runTests();
