import {
  HttpException,
  HttpStatus,
  Controller,
  Get,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '../../pipes/parseObjectId.pipe';
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
    return await getHandler(tutorialId, user);
  }

  @Get('by-name/:tutorialName')
  async getByName(
    @Param('tutorialName') tutorialName: string,
    @User() user: UserDocument
  ) {
    return await getByNameHandler(tutorialName, user);
  }

  @Patch(':tutorialId')
  async setState(
    @Param('tutorialId', ParseObjectIdPipe) tutorialId: Types.ObjectId,
    @Body() body: SetStateDto,
    @User() user: UserDocument
  ) {
    return await setStateHandler(tutorialId, body, user);
  }
}
