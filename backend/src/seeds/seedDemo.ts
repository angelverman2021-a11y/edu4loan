import { ensureDbForSeed, closeDbForSeed } from './seedHelper';
import { demoBanks } from './demo/banks.demo';
import { getDemoLoanSchemes } from './demo/loanSchemes.demo';
import { demoGovernmentSchemes } from './demo/governmentSchemes.demo';
import { demoInstitutions } from './demo/institutions.demo';
import { demoDocuments } from './demo/documents.demo';
import {
  safeUpsertBank,
  safeUpsertLoanScheme,
  safeUpsertGovernmentScheme,
  safeUpsertInstitution,
  safeUpsertDocument,
} from '../services/safeUpsert.service';

export const runDemoSeed = async () => {
  console.log('====================================================');
  console.log('  EDU4LOAN DEMO DATASET INGESTION [DEMO ONLY]');
  console.log('  All records tagged: isDemo = true');
  console.log('====================================================\n');

  await ensureDbForSeed();

  const stats = {
    banks: 0,
    loanSchemes: 0,
    governmentSchemes: 0,
    institutions: 0,
    documents: 0,
  };

  // 1. Ingest Demo Banks
  const bankMap: Record<string, string> = {};
  for (const b of demoBanks) {
    const res = await safeUpsertBank(b);
    bankMap[res.record.slug] = res.record._id.toString();
    stats.banks++;
  }

  // 2. Ingest Demo Loan Schemes
  const schemes = getDemoLoanSchemes(bankMap);
  for (const s of schemes) {
    await safeUpsertLoanScheme(s);
    stats.loanSchemes++;
  }

  // 3. Ingest Demo Government Schemes
  for (const g of demoGovernmentSchemes) {
    await safeUpsertGovernmentScheme(g);
    stats.governmentSchemes++;
  }

  // 4. Ingest Demo Institutions
  for (const inst of demoInstitutions) {
    await safeUpsertInstitution(inst);
    stats.institutions++;
  }

  // 5. Ingest Demo Documents
  for (const doc of demoDocuments) {
    await safeUpsertDocument(doc);
    stats.documents++;
  }

  console.log('--> Ingested Demo Records:');
  console.log(`    Demo Banks: ${stats.banks}`);
  console.log(`    Demo Loan Schemes: ${stats.loanSchemes}`);
  console.log(`    Demo Government Schemes: ${stats.governmentSchemes}`);
  console.log(`    Demo Institutions: ${stats.institutions}`);
  console.log(`    Demo Documents: ${stats.documents}`);
  console.log('\n[DEMO SEED COMPLETE]\n');

  return stats;
};

if (require.main === module) {
  runDemoSeed()
    .then(async () => {
      await closeDbForSeed();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[DEMO SEED ERROR]', err);
      await closeDbForSeed();
      process.exit(1);
    });
}
