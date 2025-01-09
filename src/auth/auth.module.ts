import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AppModule } from '../app.module';
import { UserIdProvider } from '../../providers/userId.provider';

@Module({
  controllers: [AuthController],
  providers: [UserIdProvider],
  imports: [forwardRef(() => AppModule)],
})
export class AuthModule {}
