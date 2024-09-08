import { setEnv } from './env';
setEnv();
try {
  fs.mkdirSync('./logs');
} catch (err: any) {
  if (err.code !== 'EEXIST') throw err;
}
import app from './app';
import { connectToDatabase } from './database';
import fs from 'fs';
import { logger } from './middleware/loggingMiddleware';

connectToDatabase().then(() =>
  app.listen(Number(process.env.EXPRESS_PORT), () => {
    logger.info(
      `Express server is running at http://localhost:${process.env.EXPRESS_PORT}`
    );
  })
);
