import {
  HttpException,
  HttpStatus,
  Controller,
  Get,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { ParseObjectIdPipe } from 'pipes/parseObjectId.pipe';
import { Types } from 'mongoose';
import { getHandler } from './handlers/getHandler';
import { getByNameHandler } from './handlers/getByNameHandler';
import { setStateHandler } from './handlers/setStateHandler';
import { SetStateDto } from './dto/setState.schema';
import { UserDocument } from '../../mongooseSchemas/user.schema';
import { User } from '../../decorators/user.decorator';

@Controller('tutorials')
export class TutorialsController {
  constructor() {}

  @Get(':tutorialId')
  async get(
    @Param('tutorialId', ParseObjectIdPipe) tutorialId: Types.ObjectId,
    @User() user: UserDocument
  ) {
    try {
      return await getHandler(tutorialId, user);
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
    @User() user: UserDocument
  ) {
    try {
      return await getByNameHandler(tutorialName, user);
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
    @User() user: UserDocument
  ) {
    try {
      return await setStateHandler(tutorialId, body, user);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
