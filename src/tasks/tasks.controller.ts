import { deleteTaskHandler } from './handlers/deleteTaskHandler';
import { trainingStartHandler } from './handlers/trainingStartHandler';
import { trainingStatusHandler } from './handlers/trainingStatusHandler';
import { trainingStopHandler } from './handlers/trainingStopHandler';
import { TrainingStartDto } from './dto/trainingStart.schema';
import {
  Controller,
  Post,
  Req,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { ParseObjectIdPipe } from 'pipes/parseObjectId.pipe';
import { Types } from 'mongoose';

@Controller('tasks')
export class TasksController {
  @Post()
  async trainingStart(@Body() body: TrainingStartDto, @Req() req: Request) {
    try {
      return await trainingStartHandler(body, req);
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
    @Req() req: Request
  ) {
    try {
      return await trainingStatusHandler(taskId, req);
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
    @Req() req: Request
  ) {
    try {
      return await trainingStopHandler(taskId, req);
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
    @Req() req: Request
  ) {
    try {
      return await deleteTaskHandler(taskId, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
