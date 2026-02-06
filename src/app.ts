import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifySecureSession from '@fastify/secure-session';
import fastifyPassport from '@fastify/passport';
import multipart from '@fastify/multipart';

export async function createApp() {
  const app = (await NestFactory.create(
    AppModule,
    new FastifyAdapter() as any
  )) as any;

  await app.register(fastifyHelmet, {
    global: true,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });
  await app.register(fastifySecureSession, {
    key: process.env.SECRET_KEY as string,
  });
  await app.register(fastifyPassport.initialize());
  await app.register(fastifyPassport.secureSession());
  await app.register(multipart);

  const normalizeOrigin = (origin: string) => origin.replace(/\/+$/, '').trim();

  const rawOrigins =
    process.env.CORS_ALLOWED_ORIGINS ?? process.env.WHITEMIND_HOSTNAME ?? '';
  const allowedOrigins = rawOrigins
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);
  const allowAllInDev = process.env.NODE_ENV === 'development';

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void
    ) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowAllInDev) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = normalizeOrigin(origin);
      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin not allowed'), false);
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  return app;
}
