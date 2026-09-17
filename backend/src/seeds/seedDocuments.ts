import { ensureDbForSeed, closeDbForSeed } from './seedHelper';
import { productionDocuments } from './production/documents';
import { safeUpsertDocument } from '../services/safeUpsert.service';

export const runSeedDocuments = async () => {
  console.log('[SEED DOCUMENTS] Ingesting Document Taxonomy Checklist...');
  await ensureDbForSeed();

  let inserted = 0;
  let updated = 0;
  for (const doc of productionDocuments) {
    const res = await safeUpsertDocument(doc);
    if (res.action === 'INSERTED') inserted++;
    else if (res.action === 'UPDATED') updated++;
  }

  console.log(`[SEED DOCUMENTS COMPLETE] Total: ${productionDocuments.length}, Inserted: ${inserted}, Updated: ${updated}`);
};

if (require.main === module) {
  runSeedDocuments()
    .then(async () => {
      await closeDbForSeed();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[SEED DOCUMENTS ERROR]', err);
      await closeDbForSeed();
      process.exit(1);
    });
}
