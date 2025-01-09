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
import { UserIdProvider } from 'providers/userId.provider';

@Controller('tutorials')
export class TutorialsController {
  constructor(private userIdProvider: UserIdProvider) {}

  @Get(':tutorialId')
  async get(
    @Param('tutorialId', ParseObjectIdPipe) tutorialId: Types.ObjectId
  ) {
    try {
      const userId = this.userIdProvider.getUserId();
      return await getHandler(tutorialId, userId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('by-name/:tutorialName')
  async getByName(@Param('tutorialName') tutorialName: string) {
    try {
      const userId = this.userIdProvider.getUserId();
      return await getByNameHandler(tutorialName, userId);
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
    @Body() body: SetStateDto
  ) {
    try {
      const userId = this.userIdProvider.getUserId();
      return await setStateHandler(tutorialId, body, userId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
