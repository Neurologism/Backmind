// handlers
import { checkHandler } from './handlers/checkHandler';
import { loginHandler } from './handlers/loginHandler';
import { logoutAllHandler } from './handlers/logoutAllHandler';
import { logoutHandler } from './handlers/logoutHandler';
import { registerHandler } from './handlers/registerHandler';
import { verifyEmailHandler } from './handlers/verifyEmailHandler';

// dtos
import { LoginDto } from './dto/login.schema';
import { RegisterDto } from './dto/register.schema';

import {
  Controller,
  Post,
  Get,
  Req,
  Body,
  Delete,
  Query,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { SkipAuth } from 'decorators/skipAuth.decorator';
import { AppLogger } from '../logger.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly logger: AppLogger) {}

  @Get('check')
  async check(@Req() req: Request) {
    try {
      return await checkHandler(req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @SkipAuth()
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

  @SkipAuth()
  @Post('register')
  async register(@Body() body: RegisterDto, @Req() req: Request) {
    try {
      return await registerHandler(body, req, this.logger);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('logout-all')
  async logoutAll(@Req() req: Request) {
    try {
      return await logoutAllHandler(req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('logout')
  async logout(@Req() req: Request) {
    try {
      return await logoutHandler(req);
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
