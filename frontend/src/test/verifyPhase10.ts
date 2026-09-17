import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { applicationService } from '../services/applicationService';
import { StudentApplicationItem, ApplicationStage } from '../types';

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

// In-memory localStorage mock for Node test environment
const memoryStore: Record<string, string> = {};
const mockStorage = {
  getItem: (key: string) => memoryStore[key] || null,
  setItem: (key: string, val: string) => {
    memoryStore[key] = val;
  },
  removeItem: (key: string) => {
    delete memoryStore[key];
  },
  clear: () => {
    Object.keys(memoryStore).forEach((k) => delete memoryStore[k]);
  },
};
(global as any).window = {
  localStorage: mockStorage,
};
(global as any).localStorage = mockStorage;

console.log('====================================================');
console.log('🧪 RUNNING EDU4LOAN PHASE 10 VERIFICATION SUITE');
console.log('====================================================\n');

async function runTests() {
  // ----------------------------------------------------
  // 1. APPLICATION LIFECYCLE & STORAGE
  // ----------------------------------------------------
  const initialApps = await applicationService.fetchMyApplications();
  assert(
    initialApps.length > 0,
    '1.1 Default starter application loaded on first access',
    `Count: ${initialApps.length}, First: ${initialApps[0]?.targetBankName}`
  );

  const initialCount = initialApps.length;

  const newApp = await applicationService.createApplication({
    targetBankName: 'Indian Bank',
    targetSchemeName: 'IB Vidya Scheme',
    requestedAmount: 850000,
    status: 'draft',
    degreeProgram: 'B.Tech in Artificial Intelligence',
    admissionYear: 2026,
    notes: 'Applying through VIT Bhopal campus branch desk',
  });

  assert(
    Boolean(newApp._id && newApp._id.startsWith('app_')),
    '1.2 Created new application tracker entry with generated ID',
    `ID: ${newApp._id}`
  );

  const allAppsAfterCreate = await applicationService.fetchMyApplications();
  assert(
    allAppsAfterCreate.length === initialCount + 1,
    '1.3 Application persisted to storage and increments list count',
    `Total: ${allAppsAfterCreate.length}`
  );

  // ----------------------------------------------------
  // 2. STAGE PROGRESSION & STATUS UPDATES
  // ----------------------------------------------------
  const updatedStage: ApplicationStage = 'bank_verification';
  const updated = await applicationService.updateApplication(newApp._id, {
    status: updatedStage,
    vidyaLakshmiApplicationId: 'CELFS-2026-VITB-4412',
    nextAction: 'Attend OSV meeting with branch credit manager',
  });

  assert(
    updated.status === 'bank_verification',
    '2.1 Application stage successfully progressed to bank_verification'
  );

  assert(
    updated.vidyaLakshmiApplicationId === 'CELFS-2026-VITB-4412',
    '2.2 Vidya Lakshmi Portal CELFS ID recorded and saved'
  );

  // ----------------------------------------------------
  // 3. BANK BRANCH VISIT & OSV INTERACTION LOGS
  // ----------------------------------------------------
  const visitLog = await applicationService.addBankVisitLog(newApp._id, {
    date: '2026-09-10',
    branchName: 'Indian Bank VIT Bhopal Branch',
    officerContactName: 'Mr. S. K. Verma',
    officerDesignation: 'Branch Manager',
    discussionSummary: 'Verified Bonafide Fee Certificate and signed OSV forms.',
    pendingRequirementsGiven: [
      'Original 12th Marks Sheet photocopy with self attestation',
      'Joint photograph of student with co-borrower',
    ],
    followUpDate: '2026-09-24',
  });

  assert(
    Boolean(visitLog.id && visitLog.branchName === 'Indian Bank VIT Bhopal Branch'),
    '3.1 Branch visit log created with officer details and date',
    `Log ID: ${visitLog.id}`
  );

  assert(
    visitLog.pendingRequirementsGiven.length === 2,
    '3.2 Action items checklist captured in visit log',
    `Items: ${visitLog.pendingRequirementsGiven.join('; ')}`
  );

  const appsWithLog = await applicationService.fetchMyApplications();
  const refreshedApp = appsWithLog.find((a) => a._id === newApp._id);
  assert(
    Boolean(
      refreshedApp?.bankVisitLogs?.length &&
        refreshedApp.bankVisitLogs.length > 0 &&
        refreshedApp.nextAction?.includes('2026-09-24')
    ),
    '3.3 Application nextAction updated with committed follow-up date',
    `Next Action: ${refreshedApp?.nextAction}`
  );

  // ----------------------------------------------------
  // 4. DASHBOARD METRICS AGGREGATION ENGINE
  // ----------------------------------------------------
  const testApps: StudentApplicationItem[] = [
    {
      _id: 'test_1',
      targetBankName: 'SBI',
      targetSchemeName: 'Scholar',
      requestedAmount: 1200000,
      status: 'sanctioned',
      degreeProgram: 'B.Tech',
      admissionYear: 2026,
      documentReadiness: { totalRequired: 14, completedCount: 14 },
      notes: '',
      bankVisitLogs: [
        {
          id: 'log_a',
          date: '2026-09-01',
          branchName: 'SBI Ashta',
          discussionSummary: 'Sanction letter issued',
          pendingRequirementsGiven: [],
          followUpDate: '2026-09-25',
        },
      ],
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    },
    {
      _id: 'test_2',
      targetBankName: 'PNB',
      targetSchemeName: 'Pratibha',
      requestedAmount: 800000,
      status: 'under_review',
      degreeProgram: 'B.Tech',
      admissionYear: 2026,
      documentReadiness: { totalRequired: 14, completedCount: 10 },
      notes: '',
      bankVisitLogs: [
        {
          id: 'log_b',
          date: '2026-09-05',
          branchName: 'PNB Kothri',
          discussionSummary: 'Underwriting query',
          pendingRequirementsGiven: [],
          followUpDate: '2026-09-20',
        },
      ],
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    },
  ];

  const summary = applicationService.getDashboardSummary(testApps);

  assert(
    summary.activeApplicationsCount === 2,
    '4.1 Dashboard aggregates total active applications count (2)',
    `Count: ${summary.activeApplicationsCount}`
  );

  assert(
    summary.totalRequestedAmount === 2000000,
    '4.2 Dashboard aggregates total requested loan quantum (₹20,00,000)',
    `Total: ₹${summary.totalRequestedAmount}`
  );

  assert(
    summary.sanctionedAmount === 1200000,
    '4.3 Dashboard isolates sanctioned quantum from under-review applications (₹12,00,000)',
    `Sanctioned: ₹${summary.sanctionedAmount}`
  );

  assert(
    summary.nextFollowUp?.date === '2026-09-20' && summary.nextFollowUp.branchName === 'PNB Kothri',
    '4.4 Dashboard selects earliest pending follow-up date across branch logs (2026-09-20 @ PNB Kothri)'
  );

  // ----------------------------------------------------
  // 5. APPLICATION DELETION
  // ----------------------------------------------------
  await applicationService.deleteApplication(newApp._id);
  const appsAfterDelete = await applicationService.fetchMyApplications();
  assert(
    !appsAfterDelete.some((a) => a._id === newApp._id),
    '5.1 Deleted application cleanly removed from storage'
  );

  // ----------------------------------------------------
  // 6. COMPONENT EXPORTS INTEGRITY
  // ----------------------------------------------------
  const trackerIndexPath = path.resolve(__dirname, '../components/tracker/index.ts');
  const trackerIndexContent = fs.readFileSync(trackerIndexPath, 'utf-8');

  const requiredTrackerComponents = [
    'ApplicationStageStepper',
    'BankVisitLogManager',
    'ApplicationFormModal',
  ];

  const allTrackerComponentsExported = requiredTrackerComponents.every((comp) =>
    trackerIndexContent.includes(comp)
  );

  assert(
    allTrackerComponentsExported,
    '6.1 All tracker components exported from components/tracker/index.ts',
    `Exported: ${requiredTrackerComponents.join(', ')}`
  );

  // ----------------------------------------------------
  // 7. CONTENT SAFETY & ZERO RANKING AUDIT
  // ----------------------------------------------------
  const phase10Files = [
    '../pages/ApplicationTrackerPage.tsx',
    '../pages/DashboardPage.tsx',
    '../components/tracker/ApplicationStageStepper.tsx',
    '../components/tracker/BankVisitLogManager.tsx',
    '../components/tracker/ApplicationFormModal.tsx',
    '../services/applicationService.ts',
    '../types/application.ts',
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

  for (const relPath of phase10Files) {
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
    '7.1 Content Safety Audit: Zero prohibited ranking terms found across all Phase 10 files',
    `Violations: ${prohibitedViolations}`
  );

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`Phase 10 Verification Completed: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL PHASE 10 REQUIREMENTS VERIFIED & PASSING!\n');
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Unhandled test runner error:', err);
  process.exit(1);
});
