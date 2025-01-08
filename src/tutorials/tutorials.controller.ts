import {
  HttpException,
  HttpStatus,
  Controller,
  Get,
  Patch,
  Req,
  Body,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { ParseObjectIdPipe } from 'pipes/parseObjectId.pipe';
import { Types } from 'mongoose';
import { getHandler } from './handlers/getHandler';
import { getByNameHandler } from './handlers/getByNameHandler';
import { setStateHandler } from './handlers/setStateHandler';
import { SetStateDto } from './dto/setState.schema';

@Controller('tutorials')
export class TutorialsController {
  @Get(':tutorialId')
  async get(
    @Param('tutorialId', ParseObjectIdPipe) tutorialId: Types.ObjectId,
    @Req() req: Request
  ) {
    try {
      return await getHandler(tutorialId, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('by-name/:tutorialName')
  async getByName(
    @Param('tutorialName') tutorialName: string,
    @Req() req: Request
  ) {
    try {
      return await getByNameHandler(tutorialName, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':tutorialId')
  async setState(
    @Param('tutorialId', ParseObjectIdPipe) tutorialId: Types.ObjectId,
    @Body() body: SetStateDto,
    @Req() req: Request
  ) {
    try {
      return await setStateHandler(tutorialId, body, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
