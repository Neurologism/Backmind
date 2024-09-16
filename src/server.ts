import { setEnv } from './env';
import fs from 'fs';

setEnv();
try {
  fs.mkdirSync('./logs');
} catch (err: any) {
  if (err.code !== 'EEXIST') throw err;
}

import { compileBrainet } from './brainetUtility/compileBrainet';
import { connectToDatabase } from './utility/connectToDatabase';
import { logger } from './middleware/loggingMiddleware';
import { trainingWorker } from './brainetUtility/trainingWorker';
import app from './app';

async function main() {
  if (process.env.RECOMPILE_BRAINET === 'true') {
    const code = await compileBrainet();
    if (code !== 0) {
      logger.error('Failed to compile Brainet');
      process.exit(1);
    }
  }
  await connectToDatabase();
  if (process.env.START_TRAINING_WORKER_AS_SERVER) {
    console.log('Starting training worker as server');
    trainingWorker();
  }
  app.listen(Number(process.env.EXPRESS_PORT), () => {
    logger.info(
      `Express server is running at http://localhost:${process.env.EXPRESS_PORT}`
    );
  });
}

main();
