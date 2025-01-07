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
  Res,
  Req,
  Body,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SkipAuth } from 'decorators/skipAuth.decorator';

@Controller('auth')
export class AuthController {
  @SkipAuth()
  @Get('check')
  check(@Req() req: Request, @Res() res: Response) {
    return checkHandler(req, res);
  }

  @SkipAuth()
  @Post('login')
  login(@Body() body: LoginDto, @Res() res: Response) {
    return loginHandler(body, res);
  }

  @SkipAuth()
  @Post('register')
  register(
    @Body() body: RegisterDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return registerHandler(body, req, res);
  }

  @Delete('logout-all')
  logoutAll(@Req() req: Request, @Res() res: Response) {
    return logoutAllHandler(req, res);
  }

  @Delete('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    return logoutHandler(req, res);
  }

  @Patch('verify-email')
  verifyEmail(@Query('token') token: string, @Res() res: Response) {
    return verifyEmailHandler(token, res);
  }
}
