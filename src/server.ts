import { setEnv } from './env';
import fs from 'fs';

setEnv();
try {
  fs.mkdirSync('./logs');
} catch (err: any) {
  if (err.code !== 'EEXIST') throw err;
}

import { connectToDatabase } from './utility/connectToDatabase';
import { logger } from './middleware/loggingMiddleware';
import app from './app';

async function main() {
  await connectToDatabase();
  app.listen(Number(process.env.EXPRESS_PORT), () => {
    logger.info(
      `Express server is running at http://localhost:${process.env.EXPRESS_PORT}`
    );
  });
}

main();
