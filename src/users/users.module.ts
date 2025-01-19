import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AppModule } from '../app.module';

@Module({
  controllers: [UsersController],
  providers: [],
  imports: [forwardRef(() => AppModule)],
})
export class UsersModule {}
