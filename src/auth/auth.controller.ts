// handlers
import { loginHandler } from './handlers/loginHandler';
import { logoutAllHandler } from './handlers/logoutAllHandler';
import { logoutHandler } from './handlers/logoutHandler';
import { verifyEmailHandler } from './handlers/verifyEmailHandler';

// dtos
import { LoginDto } from './dto/login.schema';
import { RegisterDto } from './dto/register.schema';

import {
  Controller,
  Post,
  Body,
  Delete,
  Query,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppLogger } from '../../providers/logger.provider';
import { AuthService } from './auth.service';
import { Public } from './strategies/jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly logger: AppLogger,
    private readonly authService: AuthService
  ) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    try {
      return await loginHandler(body);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    try {
      return await this.authService.register(body, this.logger);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('logout-all')
  async logoutAll() {
    try {
      const userId = this.userIdProvider.getUserId();
      return await logoutAllHandler(userId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('logout')
  async logout(@Query('token') token: string) {
    try {
      const userId = this.userIdProvider.getUserId();
      return await logoutHandler(userId, token);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch('verify-email')
  async verifyEmail(@Query('token') token: string) {
    try {
      return await verifyEmailHandler(token);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
