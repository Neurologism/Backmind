import {
  Controller,
  Post,
  Res,
  Req,
  Body,
  UseInterceptors,
  Param,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { createHandler } from './handlers/createHandler';
import { deleteHandler } from './handlers/deleteHandler';
import { getHandler } from './handlers/getHandler';
import { isTakenHandler } from './handlers/isTakenHandler';
import { updateHandler } from './handlers/updateHandler';

import { CreateDto } from './dto/create.schema';
import { DeleteDto } from './dto/delete.schema';
import { UpdateDto } from './dto/update.schema';

import { AccessProjectInterceptor } from 'interceptors/accessProject.interceptor';

@Controller('projects')
export class ProjectsController {
  @Get('is-taken')
  isTaken(
    @Param('projectName') projectName: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return isTakenHandler(projectName, req, res);
  }

  @Post()
  create(@Body() body: CreateDto, @Req() req: Request, @Res() res: Response) {
    return createHandler(body, req, res);
  }

  @Get(':projectId')
  get(
    @Param('projectId') projectId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return getHandler(projectId, req, res);
  }

  @Delete(':projectId')
  @UseInterceptors(AccessProjectInterceptor)
  delete(
    @Param('projectId') projectId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return deleteHandler(projectId, req, res);
  }

  @Patch(':projectId')
  @UseInterceptors(AccessProjectInterceptor)
  update(
    @Param('projectId') projectId: string,
    @Body() body: UpdateDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return updateHandler(projectId, body, req, res);
  }
}
