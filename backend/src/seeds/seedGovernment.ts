import { ensureDbForSeed, closeDbForSeed } from './seedHelper';
import { productionGovernmentSchemes } from './production/governmentSchemes';
import { safeUpsertGovernmentScheme } from '../services/safeUpsert.service';

export const runSeedGovernment = async () => {
  console.log('[SEED GOVERNMENT] Ingesting Government Schemes...');
  await ensureDbForSeed();

  let inserted = 0;
  let updated = 0;
  for (const gov of productionGovernmentSchemes) {
    const res = await safeUpsertGovernmentScheme(gov);
    if (res.action === 'INSERTED') inserted++;
    else if (res.action === 'UPDATED') updated++;
  }

  console.log(`[SEED GOVERNMENT COMPLETE] Total: ${productionGovernmentSchemes.length}, Inserted: ${inserted}, Updated: ${updated}`);
};

if (require.main === module) {
  runSeedGovernment()
    .then(async () => {
      await closeDbForSeed();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[SEED GOVERNMENT ERROR]', err);
      await closeDbForSeed();
      process.exit(1);
    });
}
