import { setEnv } from './env';
import fs from 'fs';

setEnv();
try {
  fs.mkdirSync('./logs');
} catch (err: any) {
  if (err.code !== 'EEXIST') throw logger.error(err);
}

const directories = ['./logs', './dataStorage', './dataStorage/pfp'];
for (const dir of directories) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

import { connectToDatabase } from './utility/connectToDatabase';
import { logger } from './middleware/loggingMiddleware';
import app from './app';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

async function main() {
  await connectToDatabase();
  app.listen(Number(process.env.EXPRESS_PORT), () => {
    logger.info(
      `Express server is running on port ${process.env.EXPRESS_PORT}`
    );
  });
}

main();
