import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { TutorialsModule } from './tutorials/tutorials.module';
import { UsersModule } from './users/users.module';

import { AppController } from './app.controller';

import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'guards/auth.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppLogger } from './logger.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string, {
      dbName: process.env.DB_NAME as string,
    }),
    AuthModule,
    ProjectsModule,
    TasksModule,
    TutorialsModule,
    UsersModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppLogger,
  ],
  exports: [AppLogger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ThrottlerModule).forRoutes('*');
  }
}
