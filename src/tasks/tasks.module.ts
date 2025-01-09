import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { UserIdProvider } from '../../providers/userId.provider';

@Module({
  controllers: [TasksController],
  providers: [UserIdProvider],
})
export class TasksModule {}
