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

  await app.register(fastifyHelmet, { global: true });
  await app.register(fastifySecureSession, {
    key: process.env.SECRET_KEY as string,
  });
  await app.register(fastifyPassport.initialize());
  await app.register(fastifyPassport.secureSession());
  await app.register(multipart);

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'development'
        ? '*'
        : (process.env.WHITEMIND_HOSTNAME as string),
    credentials: true,
  });

  return app;
}
