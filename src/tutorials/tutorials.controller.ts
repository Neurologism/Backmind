import { Controller, Get, Post, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';

import { getHandler } from './handlers/getHandler';
import { setStateHandler } from './handlers/setStateHandler';

@Controller('tutorials')
export class TutorialsController {
  @Post('get')
  get(@Req() req: Request, @Res() res: Response) {
    return getHandler(req, res);
  }

  @Post('set-state')
  setState(@Req() req: Request, @Res() res: Response) {
    return setStateHandler(req, res);
  }
}
