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
import { UserIdProvider } from 'providers/userId.provider';

@Controller('tasks')
export class TasksController {
  constructor(private userIdProvider: UserIdProvider) {}

  @Post()
  async trainingStart(@Body() body: TrainingStartDto) {
    try {
      const userId = this.userIdProvider.getUserId();
      return await trainingStartHandler(body, userId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':taskId')
  async trainingStatus(
    @Param('taskId', ParseObjectIdPipe) taskId: Types.ObjectId
  ) {
    try {
      const userId = this.userIdProvider.getUserId();
      return await trainingStatusHandler(taskId, userId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':taskId')
  async trainingStop(
    @Param('taskId', ParseObjectIdPipe) taskId: Types.ObjectId
  ) {
    try {
      const userId = this.userIdProvider.getUserId();
      return await trainingStopHandler(taskId, userId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':taskId')
  async deleteTask(@Param('taskId', ParseObjectIdPipe) taskId: Types.ObjectId) {
    try {
      const userId = this.userIdProvider.getUserId();
      return await deleteTaskHandler(taskId, userId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
