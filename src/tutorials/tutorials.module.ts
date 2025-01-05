import { Module } from '@nestjs/common';
import { TutorialsController } from './tutorials.controller';

@Module({
  controllers: [TutorialsController],
  providers: [],
})
export class TutorialsModule {}
