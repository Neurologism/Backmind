import {
  Controller,
  Post,
  Res,
  Req,
  Body,
  Param,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';
import { Request, Response } from 'express';

// handlers
import { createHandler } from './handlers/createHandler';
import { deleteHandler } from './handlers/deleteHandler';
import { getHandler } from './handlers/getHandler';
import { isTakenHandler } from './handlers/isTakenHandler';
import { updateHandler } from './handlers/updateHandler';

// dtos
import { CreateDto } from './dto/create.schema';
import { UpdateDto } from './dto/update.schema';
import { ParseObjectIdPipe } from 'pipes/parseObjectId.pipe';

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
    @Param('projectId', ParseObjectIdPipe) projectId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return getHandler(projectId, req, res);
  }

  @Delete(':projectId')
  delete(
    @Param('projectId', ParseObjectIdPipe) projectId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return deleteHandler(projectId, req, res);
  }

  @Patch(':projectId')
  update(
    @Param('projectId', ParseObjectIdPipe) projectId: string,
    @Body() body: UpdateDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return updateHandler(projectId, body, req, res);
  }
}
