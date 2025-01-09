import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { UserIdProvider } from '../../providers/userId.provider';

@Module({
  controllers: [ProjectsController],
  providers: [UserIdProvider],
})
export class ProjectsModule {}
