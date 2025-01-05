import { Controller, Post, Res, Req, Body } from '@nestjs/common';
import { Request, Response } from 'express';

import { deleteTaskHandler } from './handlers/deleteTaskHandler';
import { downloadHandler } from './handlers/downloadHandler';
import { queryHandler } from './handlers/queryHandler';
import { trainingStartHandler } from './handlers/trainingStartHandler';
import { trainingStatusHandler } from './handlers/trainingStatusHandler';
import { trainingStopHandler } from './handlers/trainingStopHandler';

import { DeleteTaskDto } from './dto/deleteTask.schema';
import { DownloadDto } from './dto/download.schema';
import { QueryDto } from './dto/query.schema';
import { TrainingStartDto } from './dto/trainingStart.schema';
import { TrainingStatusDto } from './dto/trainingStatus.schema';
import { TrainingStopDto } from './dto/trainingStop.schema';

@Controller('tasks')
export class TasksController {
  @Post('download')
  download(
    @Body() body: DownloadDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return downloadHandler(req, res);
  }

  @Post('query')
  query(@Body() body: QueryDto, @Req() req: Request, @Res() res: Response) {
    return queryHandler(req, res);
  }

  @Post('training-start')
  trainingStart(
    @Body() body: TrainingStartDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return trainingStartHandler(req, res);
  }

  @Post('training-status')
  trainingStatus(
    @Body() body: TrainingStatusDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return trainingStatusHandler(req, res);
  }

  @Post('training-stop')
  trainingStop(
    @Body() body: TrainingStopDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return trainingStopHandler(req, res);
  }

  @Post('delete-task')
  deleteTask(
    @Body() body: DeleteTaskDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return deleteTaskHandler(req, res);
  }
}
