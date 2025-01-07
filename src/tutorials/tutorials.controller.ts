import { Controller, Get, Patch, Res, Req, Body, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { ParseObjectIdPipe } from 'pipes/parseObjectId.pipe';
import { Types } from 'mongoose';

// handlers
import { getHandler } from './handlers/getHandler';
import { getByNameHandler } from './handlers/getByNameHandler';
import { setStateHandler } from './handlers/setStateHandler';

// dtos
import { SetStateDto } from './dto/setState.schema';

@Controller('tutorials')
export class TutorialsController {
  @Get(':tutorialId')
  get(
    @Param('tutorialId', ParseObjectIdPipe) tutorialId: Types.ObjectId,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return getHandler(tutorialId, req, res);
  }

  @Get('by-name/:tutorialName')
  getByName(
    @Param('tutorialName') tutorialName: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return getByNameHandler(tutorialName, req, res);
  }

  @Patch(':tutorialId')
  setState(
    @Param('tutorialId', ParseObjectIdPipe) tutorialId: Types.ObjectId,
    @Body() body: SetStateDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return setStateHandler(tutorialId, body, req, res);
  }
}
