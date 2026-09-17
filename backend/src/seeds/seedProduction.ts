import { ensureDbForSeed, closeDbForSeed } from './seedHelper';
import { productionSources } from './production/sources';
import { productionBanks } from './production/banks';
import { getProductionLoanSchemes } from './production/loanSchemes';
import { productionGovernmentSchemes } from './production/governmentSchemes';
import { productionInstitutions } from './production/institutions';
import { productionDocuments } from './production/documents';
import { productionFAQs } from './production/faqs';
import {
  safeUpsertSource,
  safeUpsertBank,
  safeUpsertLoanScheme,
  safeUpsertGovernmentScheme,
  safeUpsertInstitution,
  safeUpsertDocument,
  safeUpsertFAQ,
} from '../services/safeUpsert.service';

export const runProductionSeed = async () => {
  console.log('====================================================');
  console.log('  EDU4LOAN PRODUCTION FINANCIAL DATA INGESTION');
  console.log('====================================================\n');

  const dbType = await ensureDbForSeed();

  const stats = {
    sources: { inserted: 0, updated: 0, skipped: 0 },
    banks: { inserted: 0, updated: 0, skipped: 0 },
    loanSchemes: { inserted: 0, updated: 0, skipped: 0 },
    governmentSchemes: { inserted: 0, updated: 0, skipped: 0 },
    institutions: { inserted: 0, updated: 0, skipped: 0 },
    documents: { inserted: 0, updated: 0, skipped: 0 },
    faqs: { inserted: 0, updated: 0, skipped: 0 },
  };

  // 1. Ingest Primary Sources
  console.log('--> Ingesting Authoritative Primary Sources...');
  for (const src of productionSources) {
    const res = await safeUpsertSource(src);
    if (res.action === 'INSERTED') stats.sources.inserted++;
    else if (res.action === 'UPDATED') stats.sources.updated++;
    else stats.sources.skipped++;
  }
  console.log(
    `    Sources: ${stats.sources.inserted} inserted, ${stats.sources.updated} updated, ${stats.sources.skipped} skipped`
  );

  // 2. Ingest Banks
  console.log('--> Ingesting Verified Partner/Public Banks...');
  const bankMap: Record<string, string> = {};
  for (const b of productionBanks) {
    const res = await safeUpsertBank(b);
    bankMap[res.record.slug] = res.record._id.toString();
    if (res.action === 'INSERTED') stats.banks.inserted++;
    else if (res.action === 'UPDATED') stats.banks.updated++;
    else stats.banks.skipped++;
  }
  console.log(
    `    Banks: ${stats.banks.inserted} inserted, ${stats.banks.updated} updated, ${stats.banks.skipped} skipped`
  );

  // 3. Ingest Loan Schemes
  console.log('--> Ingesting Authoritative Education Loan Schemes...');
  const schemes = getProductionLoanSchemes(bankMap);
  for (const s of schemes) {
    const res = await safeUpsertLoanScheme(s);
    if (res.action === 'INSERTED') stats.loanSchemes.inserted++;
    else if (res.action === 'UPDATED') stats.loanSchemes.updated++;
    else stats.loanSchemes.skipped++;
  }
  console.log(
    `    Loan Schemes: ${stats.loanSchemes.inserted} inserted, ${stats.loanSchemes.updated} updated, ${stats.loanSchemes.skipped} skipped`
  );

  // 4. Ingest Government Schemes
  console.log('--> Ingesting Government Schemes (PM-Vidyalaxmi, Vidya Lakshmi, CSIS)...');
  for (const g of productionGovernmentSchemes) {
    const res = await safeUpsertGovernmentScheme(g);
    if (res.action === 'INSERTED') stats.governmentSchemes.inserted++;
    else if (res.action === 'UPDATED') stats.governmentSchemes.updated++;
    else stats.governmentSchemes.skipped++;
  }
  console.log(
    `    Govt Schemes: ${stats.governmentSchemes.inserted} inserted, ${stats.governmentSchemes.updated} updated, ${stats.governmentSchemes.skipped} skipped`
  );

  // 5. Ingest Institutions (VIT Bhopal University)
  console.log('--> Ingesting Institution Data (VIT Bhopal University)...');
  for (const inst of productionInstitutions) {
    const res = await safeUpsertInstitution(inst);
    if (res.action === 'INSERTED') stats.institutions.inserted++;
    else if (res.action === 'UPDATED') stats.institutions.updated++;
    else stats.institutions.skipped++;
  }
  console.log(
    `    Institutions: ${stats.institutions.inserted} inserted, ${stats.institutions.updated} updated, ${stats.institutions.skipped} skipped`
  );

  // 6. Ingest Document Taxonomy
  console.log('--> Ingesting Document Taxonomy Checklist...');
  for (const doc of productionDocuments) {
    const res = await safeUpsertDocument(doc);
    if (res.action === 'INSERTED') stats.documents.inserted++;
    else if (res.action === 'UPDATED') stats.documents.updated++;
    else stats.documents.skipped++;
  }
  console.log(
    `    Documents: ${stats.documents.inserted} inserted, ${stats.documents.updated} updated, ${stats.documents.skipped} skipped`
  );

  // 7. Ingest Authoritative FAQs
  console.log('--> Ingesting Authoritative FAQs...');
  for (const faq of productionFAQs) {
    const res = await safeUpsertFAQ(faq);
    if (res.action === 'INSERTED') stats.faqs.inserted++;
    else if (res.action === 'UPDATED') stats.faqs.updated++;
    else stats.faqs.skipped++;
  }
  console.log(
    `    FAQs: ${stats.faqs.inserted} inserted, ${stats.faqs.updated} updated, ${stats.faqs.skipped} skipped`
  );

  console.log('\n====================================================');
  console.log('  PRODUCTION INGESTION SUMMARY');
  console.log('====================================================');
  console.log(`- Database Target: ${dbType}`);
  console.log(`- Sources: ${stats.sources.inserted + stats.sources.updated}`);
  console.log(`- Banks: ${stats.banks.inserted + stats.banks.updated}`);
  console.log(`- Loan Schemes: ${stats.loanSchemes.inserted + stats.loanSchemes.updated}`);
  console.log(`- Government Schemes: ${stats.governmentSchemes.inserted + stats.governmentSchemes.updated}`);
  console.log(`- Institutions: ${stats.institutions.inserted + stats.institutions.updated}`);
  console.log(`- Documents: ${stats.documents.inserted + stats.documents.updated}`);
  console.log(`- FAQs: ${stats.faqs.inserted + stats.faqs.updated}`);
  console.log('====================================================\n');

  return stats;
};

if (require.main === module) {
  runProductionSeed()
    .then(async () => {
      await closeDbForSeed();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[PRODUCTION SEED FATAL ERROR]', err);
      await closeDbForSeed();
      process.exit(1);
    });
}
