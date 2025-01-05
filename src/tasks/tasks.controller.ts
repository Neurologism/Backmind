import { Controller, Post, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';

import { deleteTaskHandler } from './handlers/deleteTaskHandler';
import { downloadHandler } from './handlers/downloadHandler';
import { queryHandler } from './handlers/queryHandler';
import { trainingStartHandler } from './handlers/trainingStartHandler';
import { trainingStatusHandler } from './handlers/trainingStatusHandler';
import { trainingStopHandler } from './handlers/trainingStopHandler';

@Controller('tasks')
export class TasksController {
  @Post('download')
  download(@Req() req: Request, @Res() res: Response) {
    return downloadHandler(req, res);
  }

  @Post('query')
  query(@Req() req: Request, @Res() res: Response) {
    return queryHandler(req, res);
  }

  @Post('training-start')
  trainingStart(@Req() req: Request, @Res() res: Response) {
    return trainingStartHandler(req, res);
  }

  @Post('training-status')
  trainingStatus(@Req() req: Request, @Res() res: Response) {
    return trainingStatusHandler(req, res);
  }

  @Post('training-stop')
  trainingStop(@Req() req: Request, @Res() res: Response) {
    return trainingStopHandler(req, res);
  }

  @Post('delete-task')
  deleteTask(@Req() req: Request, @Res() res: Response) {
    return deleteTaskHandler(req, res);
  }
}
