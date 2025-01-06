import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { TutorialsModule } from './tutorials/tutorials.module';
import { UsersModule } from './users/users.module';

import { LoggerMiddleware } from 'middleware/logger.middleware';

import { AppController } from './app.controller';

import { AppService } from './app.service';
import { AuthGuard } from 'guards/auth.guard';

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
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware);
  }
}
