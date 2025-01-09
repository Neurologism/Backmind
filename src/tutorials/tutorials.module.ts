import { Module } from '@nestjs/common';
import { TutorialsController } from './tutorials.controller';
import { UserIdProvider } from '../../providers/userId.provider';

@Module({
  controllers: [TutorialsController],
  providers: [UserIdProvider],
})
export class TutorialsModule {}
