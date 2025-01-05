import { Controller, Get, Post, Res, Req, Body } from '@nestjs/common';
import { Request, Response } from 'express';

import { getHandler } from './handlers/getHandler';
import { setStateHandler } from './handlers/setStateHandler';

import { GetDto } from './dto/get.schema';
import { SetStateDto } from './dto/setState.schema';

@Controller('tutorials')
export class TutorialsController {
  @Post('get')
  get(@Body() body: GetDto, @Req() req: Request, @Res() res: Response) {
    return getHandler(body, req, res);
  }

  @Post('set-state')
  setState(
    @Body() body: SetStateDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return setStateHandler(body, req, res);
  }
}
