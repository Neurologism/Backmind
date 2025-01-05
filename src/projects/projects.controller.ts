import { Controller, Post, Res, Req, Body } from '@nestjs/common';
import { Request, Response } from 'express';

import { createHandler } from './handlers/createHandler';
import { deleteHandler } from './handlers/deleteHandler';
import { getHandler } from './handlers/getHandler';
import { isTakenHandler } from './handlers/isTakenHandler';
import { searchHandler } from './handlers/searchHandler';
import { updateHandler } from './handlers/updateHandler';

import { CreateDto } from './dto/create.schema';
import { DeleteDto } from './dto/delete.schema';
import { GetDto } from './dto/get.schema';
import { IsTakenDto } from './dto/isTaken.schema';
import { SearchDto } from './dto/search.schema';
import { UpdateDto } from './dto/update.schema';

@Controller('projects')
export class ProjectsController {
  @Post('create')
  create(@Body() body: CreateDto, @Req() req: Request, @Res() res: Response) {
    return createHandler(req, res);
  }

  @Post('delete')
  delete(@Body() body: DeleteDto, @Req() req: Request, @Res() res: Response) {
    return deleteHandler(req, res);
  }

  @Post('get')
  get(@Body() body: GetDto, @Req() req: Request, @Res() res: Response) {
    return getHandler(req, res);
  }

  @Post('is-taken')
  isTaken(@Body() body: IsTakenDto, @Req() req: Request, @Res() res: Response) {
    return isTakenHandler(req, res);
  }

  @Post('search')
  search(@Body() body: SearchDto, @Req() req: Request, @Res() res: Response) {
    return searchHandler(req, res);
  }

  @Post('update')
  update(@Body() body: UpdateDto, @Req() req: Request, @Res() res: Response) {
    return updateHandler(req, res);
  }
}
