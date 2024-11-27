import { setEnv } from './env';
import fs from 'fs';
import path from 'path';

setEnv();
try {
  fs.mkdirSync('./logs');
} catch (err: any) {
  if (err.code !== 'EEXIST') throw err;
}

const directories = ['./logs', './dataStorage', './dataStorage/pfp'];
for (const dir of directories) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
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
