import { ensureDbForSeed, closeDbForSeed } from './seedHelper';
import { Bank } from '../models/Bank';
import { LoanScheme } from '../models/LoanScheme';
import { GovernmentScheme } from '../models/GovernmentScheme';
import { Institution } from '../models/Institution';
import { DocumentModel } from '../models/Document';
import { Source } from '../models/Source';
import { logAuditAction } from '../services/audit.service';

export interface ResetDemoResult {
  deletedBanks: number;
  deletedLoanSchemes: number;
  deletedGovernmentSchemes: number;
  deletedInstitutions: number;
  deletedDocuments: number;
  deletedSources: number;
  totalDeleted: number;
}

export const executeResetDemo = async (actor?: {
  id: string;
  email: string;
  role: string;
}): Promise<ResetDemoResult> => {
  const currentActor = {
    id: actor?.id || 'SYSTEM_DEMO_RESET_ENGINE',
    email: actor?.email || 'admin@edu4loan.org',
    role: actor?.role || 'admin',
  };

  console.log('[DEMO RESET] Initiating safe cleanup of DEMO data...');

  // CRITICAL SAFETY ASSURANCES:
  // 1. Every delete operation strictly targets { isDemo: true }.
  // 2. Collections for User, AuditLog, and Application are never touched.
  const [bRes, lsRes, gsRes, iRes, dRes, sRes] = await Promise.all([
    Bank.deleteMany({ isDemo: true }),
    LoanScheme.deleteMany({ isDemo: true }),
    GovernmentScheme.deleteMany({ isDemo: true }),
    Institution.deleteMany({ isDemo: true }),
    DocumentModel.deleteMany({ isDemo: true }),
    Source.deleteMany({ isDemo: true }),
  ]);

  const result: ResetDemoResult = {
    deletedBanks: bRes.deletedCount || 0,
    deletedLoanSchemes: lsRes.deletedCount || 0,
    deletedGovernmentSchemes: gsRes.deletedCount || 0,
    deletedInstitutions: iRes.deletedCount || 0,
    deletedDocuments: dRes.deletedCount || 0,
    deletedSources: sRes.deletedCount || 0,
    totalDeleted:
      (bRes.deletedCount || 0) +
      (lsRes.deletedCount || 0) +
      (gsRes.deletedCount || 0) +
      (iRes.deletedCount || 0) +
      (dRes.deletedCount || 0) +
      (sRes.deletedCount || 0),
  };

  // Record audit log for demo reset
  await logAuditAction({
    userId: currentActor.id,
    userEmail: currentActor.email,
    userRole: currentActor.role,
    action: 'DELETE',
    entityType: 'bank',
    entityId: 'ALL_DEMO_RECORDS',
    reason: `Safe Demo Reset: Cleaned up ${result.totalDeleted} demo records. Production data and users untouched.`,
    newValue: result,
  });

  console.log(`[DEMO RESET COMPLETE] Successfully removed ${result.totalDeleted} demo records.`);
  console.log(`  - Banks: ${result.deletedBanks}`);
  console.log(`  - Loan Schemes: ${result.deletedLoanSchemes}`);
  console.log(`  - Government Schemes: ${result.deletedGovernmentSchemes}`);
  console.log(`  - Institutions: ${result.deletedInstitutions}`);
  console.log(`  - Documents: ${result.deletedDocuments}`);
  console.log(`  - Sources: ${result.deletedSources}`);

  return result;
};

if (require.main === module) {
  ensureDbForSeed()
    .then(async () => {
      await executeResetDemo();
      await closeDbForSeed();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[DEMO RESET ERROR]', err);
      await closeDbForSeed();
      process.exit(1);
    });
}
