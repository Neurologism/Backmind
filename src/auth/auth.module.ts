import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AppModule } from '../app.module';

@Module({
  controllers: [AuthController],
  providers: [],
  imports: [forwardRef(() => AppModule)],
})
export class AuthModule {}
