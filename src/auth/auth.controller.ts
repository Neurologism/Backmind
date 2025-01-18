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
import { UserDocument } from '../../mongooseSchemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    if (!body.user || (!body.user.brainetTag && !body.user.email)) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    let user: UserDocument;
    if (body.user.brainetTag) {
      user = await this.authService.validateUserByBrainetTag(
        body.user.brainetTag,
        body.user.plainPassword
      );
    } else if (body.user.email) {
      user = await this.authService.validateUserByEmail(
        body.user.email,
        body.user.plainPassword
      );
    } else {
      throw new HttpException(
        'Provide email or brainetTag',
        HttpStatus.BAD_REQUEST
      );
    }
    return await this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Delete('logout-all')
  async logoutAll(@User() user: UserDocument) {
    return await this.authService.logoutAll(user);
  }

  @Delete('logout')
  async logout(@Query('token') token: string, @User() user: UserDocument) {
    return await this.authService.logout(user, token);
  }

  @Public()
  @Patch('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return await this.authService.verifyEmail(token);
  }
}
