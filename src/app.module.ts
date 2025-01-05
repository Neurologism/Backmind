import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { ProjectController } from './project/project.controller';
import { TutorialController } from './tutorial/tutorial.controller';
import { TaskController } from './task/task.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    UserController,
    ProjectController,
    TutorialController,
    TaskController,
  ],
  providers: [AppService],
})
export class AppModule {}
