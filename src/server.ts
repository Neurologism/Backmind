import { setEnv } from './env';
import fs from 'fs';
import { compileBrainet } from './brainetUtility/compileBrainet';

setEnv();
try {
  fs.mkdirSync('./logs');
} catch (err: any) {
  if (err.code !== 'EEXIST') throw err;
}

import app from './app';
import { connectToDatabase } from './database';
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
  app.listen(Number(process.env.EXPRESS_PORT), () => {
    logger.info(
      `Express server is running at http://localhost:${process.env.EXPRESS_PORT}`
    );
  });
}

main();
