import {
  Controller,
  Post,
  Get,
  Res,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { checkHandler } from './handlers/checkHandler';
import { loginHandler } from './handlers/loginHandler';
import { logoutAllHandler } from './handlers/logoutAllHandler';
import { logoutHandler } from './handlers/logoutHandler';
import { registerHandler } from './handlers/registerHandler';
import { verifyEmailHandler } from './handlers/verifyEmailHandler';

import { LoginDto } from './dto/login.schema';
import { RegisterDto } from './dto/register.schema';
import { SkipAuth } from 'decorators/skipAuth.decorator';

@Controller('auth')
export class AuthController {
  @Get('check')
  check(@Req() req: Request, @Res() res: Response) {
    return checkHandler(req, res);
  }

  @SkipAuth()
  @Post('login')
  login(@Body() body: LoginDto, @Req() req: Request, @Res() res: Response) {
    return loginHandler(body, req, res);
  }

  @Post('logout-all')
  logoutAll(@Req() req: Request, @Res() res: Response) {
    return logoutAllHandler(req, res);
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    return logoutHandler(req, res);
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

  @Post('verify-email')
  verifyEmail(@Req() req: Request, @Res() res: Response) {
    return verifyEmailHandler(req, res);
  }
}
