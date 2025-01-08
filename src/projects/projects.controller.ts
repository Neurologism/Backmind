import { createHandler } from './handlers/createHandler';
import { deleteHandler } from './handlers/deleteHandler';
import { getHandler } from './handlers/getHandler';
import { isTakenHandler } from './handlers/isTakenHandler';
import { updateHandler } from './handlers/updateHandler';
import { CreateDto } from './dto/create.schema';
import { UpdateDto } from './dto/update.schema';
import {
  Controller,
  Post,
  Req,
  Body,
  Param,
  Delete,
  Get,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'pipes/parseObjectId.pipe';

@Controller('projects')
export class ProjectsController {
  @Get('is-taken')
  async isTaken(
    @Param('projectName') projectName: string,
    @Req() req: Request
  ) {
    try {
      return await isTakenHandler(projectName, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async create(@Body() body: CreateDto, @Req() req: Request) {
    try {
      return await createHandler(body, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':projectId')
  async get(
    @Param('projectId', ParseObjectIdPipe) projectId: Types.ObjectId,
    @Req() req: Request
  ) {
    try {
      return await getHandler(projectId, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':projectId')
  async delete(
    @Param('projectId', ParseObjectIdPipe) projectId: Types.ObjectId,
    @Req() req: Request
  ) {
    try {
      return await deleteHandler(projectId, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':projectId')
  async update(
    @Param('projectId', ParseObjectIdPipe) projectId: Types.ObjectId,
    @Body() body: UpdateDto,
    @Req() req: Request
  ) {
    try {
      return await updateHandler(projectId, body, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
