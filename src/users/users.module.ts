import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserIdProvider } from '../../providers/userId.provider';

@Module({
  controllers: [UsersController],
  providers: [UserIdProvider],
})
export class UsersModule {}
