import { Controller, Get, Post, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';

import { checkHandler } from './handlers/checkHandler';
import { loginHandler } from './handlers/loginHandler';
import { logoutAllHandler } from './handlers/logoutAllHandler';
import { logoutHandler } from './handlers/logoutHandler';
import { registerHandler } from './handlers/registerHandler';
import { verifyEmailHandler } from './handlers/verifyEmailHandler';

@Controller('auth')
export class AuthController {
  @Post('check')
  check(@Req() req: Request, @Res() res: Response) {
    return checkHandler(req, res);
  }

  @Post('login')
  login(@Req() req: Request, @Res() res: Response) {
    return loginHandler(req, res);
  }

  @Post('logout-all')
  logoutAll(@Req() req: Request, @Res() res: Response) {
    return logoutAllHandler(req, res);
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    return logoutHandler(req, res);
  }

  @Post('register')
  register(@Req() req: Request, @Res() res: Response) {
    return registerHandler(req, res);
  }

  @Post('verify-email')
  verifyEmail(@Req() req: Request, @Res() res: Response) {
    return verifyEmailHandler(req, res);
  }
}
