import { deleteTaskHandler } from './handlers/deleteTaskHandler';
import { trainingStartHandler } from './handlers/trainingStartHandler';
import { trainingStatusHandler } from './handlers/trainingStatusHandler';
import { trainingStopHandler } from './handlers/trainingStopHandler';
import { TrainingStartDto } from './dto/trainingStart.schema';
import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ParseObjectIdPipe } from 'pipes/parseObjectId.pipe';
import { Types } from 'mongoose';
import { User } from '../../decorators/user.decorator';
import { UserDocument } from '../../mongooseSchemas/user.schema';

@Controller('tasks')
export class TasksController {
  constructor() {}

  @Post()
  async trainingStart(
    @Body() body: TrainingStartDto,
    @User() user: UserDocument
  ) {
    try {
      return await trainingStartHandler(body, user);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':taskId')
  async trainingStatus(
    @Param('taskId', ParseObjectIdPipe) taskId: Types.ObjectId,
    @User() user: UserDocument
  ) {
    try {
      return await trainingStatusHandler(taskId, user);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':taskId')
  async trainingStop(
    @Param('taskId', ParseObjectIdPipe) taskId: Types.ObjectId,
    @User() user: UserDocument
  ) {
    try {
      return await trainingStopHandler(taskId, user);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':taskId')
  async deleteTask(
    @Param('taskId', ParseObjectIdPipe) taskId: Types.ObjectId,
    @User() user: UserDocument
  ) {
    try {
      return await deleteTaskHandler(taskId, user);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
