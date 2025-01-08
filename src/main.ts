import { setEnv } from './env';
import fs from 'fs';

setEnv();
try {
  fs.mkdirSync('./logs');
} catch (err: any) {
  if (err.code !== 'EEXIST') throw err;
}

const directories = [
  './logs',
  process.env.FILES_DIRECTORY as string,
  process.env.PFP_DIRECTORY as string,
  process.env.MODEL_DIRECTORY as string,
];
for (const dir of directories) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

import { connectToDatabase } from '../utility/connectToDatabase';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import rateLimit from 'express-rate-limit';
import { AppLogger } from './logger.service';

async function bootstrap() {
  await connectToDatabase();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appLogger = app.get(AppLogger);
  app.useLogger(appLogger);

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'development'
        ? '*'
        : (process.env.WHITEMIND_HOSTNAME as string),
    credentials: true,
  });
  app.use(
    rateLimit({
      windowMs: 60 * 1000 * Number(process.env.RATE_LIMIT_DURATION), // 5 min
      max: Number(process.env.RATE_LIMIT_REQUESTS),
      message: "You're sending too many requests.",
    })
  );

  await app.listen(Number(process.env.EXPRESS_PORT));
}

bootstrap();
