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
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyHelmet from '@fastify/helmet';

async function bootstrap() {
  await connectToDatabase();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  await app.register(fastifyHelmet, { global: true });

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'development'
        ? '*'
        : (process.env.WHITEMIND_HOSTNAME as string),
    credentials: true,
  });

  await app.listen(Number(process.env.EXPRESS_PORT));
}

bootstrap();
