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
import { User } from '../../decorators/user.decorator';

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
      if (body.user.brainetTag) {
        await this.authService.validateUserByBrainetTag(
          body.user.brainetTag,
          body.user.plainPassword
        );
      } else if (body.user.email) {
        await this.authService.validateUserByEmail(
          body.user.email,
          body.user.plainPassword
        );
      } else {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }
      return await this.authService.login(body.user);
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
  async logoutAll(@User() user: any) {
    try {
      return await this.authService.logoutAll(user);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('logout')
  async logout(@Query('token') token: string, @User() user: any) {
    try {
      return await this.authService.logout(token, user);
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
      return await this.authService.verifyEmail(token);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
