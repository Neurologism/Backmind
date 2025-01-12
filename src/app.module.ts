// src/app.module.ts
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  forwardRef,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { TutorialsModule } from './tutorials/tutorials.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppLogger } from '../providers/logger.provider';
import { UserIdProvider } from '../providers/userId.provider';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string, {
      dbName: process.env.DB_NAME as string,
    }),
    forwardRef(() => AuthModule),
    ProjectsModule,
    TasksModule,
    TutorialsModule,
    UsersModule,
    ThrottlerModule.forRoot([
      {
        ttl: 1,
        limit: 30,
      },
      {
        ttl: 10,
        limit: 100,
      },
      {
        ttl: 60,
        limit: 300,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppLogger,
    UserIdProvider,
  ],
  exports: [AppLogger],
})
export class AppModule implements NestModule {
  constructor(private readonly appLogger: AppLogger) {}

  configure(consumer: MiddlewareConsumer) {
    this.appLogger.log('AppModule configured');
  }
}
