import {
  Controller,
  Post,
  Res,
  Req,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { createHandler } from './handlers/createHandler';
import { deleteHandler } from './handlers/deleteHandler';
import { getHandler } from './handlers/getHandler';
import { isTakenHandler } from './handlers/isTakenHandler';
import { updateHandler } from './handlers/updateHandler';

import { CreateDto } from './dto/create.schema';
import { DeleteDto } from './dto/delete.schema';
import { GetDto } from './dto/get.schema';
import { IsTakenDto } from './dto/isTaken.schema';
import { UpdateDto } from './dto/update.schema';

import { AccessProjectInterceptor } from 'interceptors/accessProject.interceptor';

@Controller('projects')
export class ProjectsController {
  @Post('create')
  create(@Body() body: CreateDto, @Req() req: Request, @Res() res: Response) {
    return createHandler(body, req, res);
  }

  @Post('delete')
  delete(@Body() body: DeleteDto, @Req() req: Request, @Res() res: Response) {
    return deleteHandler(body, req, res);
  }

  @Post('get')
  get(@Body() body: GetDto, @Req() req: Request, @Res() res: Response) {
    return getHandler(body, req, res);
  }

  @Post('is-taken')
  isTaken(@Body() body: IsTakenDto, @Req() req: Request, @Res() res: Response) {
    return isTakenHandler(body, req, res);
  }

  @Post('update')
  @UseInterceptors(AccessProjectInterceptor)
  update(@Body() body: UpdateDto, @Req() req: Request, @Res() res: Response) {
    return updateHandler(body, req, res);
  }
}
