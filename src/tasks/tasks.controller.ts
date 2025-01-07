import {
  Controller,
  Post,
  Res,
  Req,
  Body,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { Request, Response } from 'express';

// handlers
import { deleteTaskHandler } from './handlers/deleteTaskHandler';
import { trainingStartHandler } from './handlers/trainingStartHandler';
import { trainingStatusHandler } from './handlers/trainingStatusHandler';
import { trainingStopHandler } from './handlers/trainingStopHandler';

// dtos
import { TrainingStartDto } from './dto/trainingStart.schema';
import { ParseObjectIdPipe } from 'pipes/parseObjectId.pipe';

@Controller('tasks')
export class TasksController {
  @Post()
  trainingStart(
    @Body() body: TrainingStartDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return trainingStartHandler(body, req, res);
  }

  @Get(':taskId')
  trainingStatus(
    @Param('taskId', ParseObjectIdPipe) taskId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return trainingStatusHandler(taskId, req, res);
  }

  @Patch(':taskId')
  trainingStop(
    @Param('taskId', ParseObjectIdPipe) taskId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return trainingStopHandler(taskId, req, res);
  }

  @Delete(':taskId')
  deleteTask(
    @Param('taskId', ParseObjectIdPipe) taskId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return deleteTaskHandler(taskId, req, res);
  }
}
