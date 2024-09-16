import { setEnv } from './env';
import fs from 'fs';
import { trainingWorker } from './brainetUtility/trainingWorker';

setEnv();
try {
  fs.mkdirSync('./logs');
} catch (err: any) {
  if (err.code !== 'EEXIST') throw err;
}

import { compileBrainet } from './brainetUtility/compileBrainet';
import { connectToDatabase } from './utility/connectToDatabase';
import { logger } from './middleware/loggingMiddleware';

async function main() {
  if (process.env.RECOMPILE_BRAINET === 'true') {
    const code = await compileBrainet();
    if (code !== 0) {
      logger.error('Failed to compile Brainet');
      process.exit(1);
    }
  }
  await connectToDatabase();
  await trainingWorker();
}

main();
