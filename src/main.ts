import { setEnv } from './env';
import fs from 'fs';

setEnv();

const directories = [
  './logs',
  process.env.FILES_DIRECTORY,
  process.env.PFP_DIRECTORY,
  process.env.MODEL_DIRECTORY,
];

directories.forEach((dir) => {
  if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

import { connectToDatabase } from '../utility/connectToDatabase';
import { createApp } from './app';

async function bootstrap() {
  await connectToDatabase();
  const app = await createApp();
  await app.listen(Number(process.env.PORT));
}

bootstrap();
