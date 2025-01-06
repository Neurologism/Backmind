import {
  Controller,
  Post,
  Res,
  Req,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { deleteTaskHandler } from './handlers/deleteTaskHandler';
import { trainingStartHandler } from './handlers/trainingStartHandler';
import { trainingStatusHandler } from './handlers/trainingStatusHandler';
import { trainingStopHandler } from './handlers/trainingStopHandler';

import { DeleteTaskDto } from './dto/deleteTask.schema';
import { TrainingStartDto } from './dto/trainingStart.schema';
import { TrainingStatusDto } from './dto/trainingStatus.schema';
import { TrainingStopDto } from './dto/trainingStop.schema';
import { AccessProjectInterceptor } from 'interceptors/accessProject.interceptor';

@Controller('tasks')
export class TasksController {
  @Post('training-start')
  @UseInterceptors(AccessProjectInterceptor)
  trainingStart(
    @Body() body: TrainingStartDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return trainingStartHandler(body, req, res);
  }

  @Post('training-status')
  trainingStatus(
    @Body() body: TrainingStatusDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return trainingStatusHandler(body, req, res);
  }

  @Post('training-stop')
  trainingStop(
    @Body() body: TrainingStopDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return trainingStopHandler(body, req, res);
  }

  @Post('delete-task')
  deleteTask(
    @Body() body: DeleteTaskDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return deleteTaskHandler(body, req, res);
  }
}
