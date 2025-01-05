import { Controller, Post, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';

import { createHandler } from './handlers/createHandler';
import { deleteHandler } from './handlers/deleteHandler';
import { getHandler } from './handlers/getHandler';
import { isTakenHandler } from './handlers/isTakenHandler';
import { searchHandler } from './handlers/searchHandler';
import { updateHandler } from './handlers/updateHandler';

@Controller('projects')
export class ProjectsController {
  @Post('create')
  create(@Req() req: Request, @Res() res: Response) {
    return createHandler(req, res);
  }

  @Post('delete')
  delete(@Req() req: Request, @Res() res: Response) {
    return deleteHandler(req, res);
  }

  @Post('get')
  get(@Req() req: Request, @Res() res: Response) {
    return getHandler(req, res);
  }

  @Post('is-taken')
  isTaken(@Req() req: Request, @Res() res: Response) {
    return isTakenHandler(req, res);
  }

  @Post('search')
  search(@Req() req: Request, @Res() res: Response) {
    return searchHandler(req, res);
  }

  @Post('update')
  update(@Req() req: Request, @Res() res: Response) {
    return updateHandler(req, res);
  }
}
