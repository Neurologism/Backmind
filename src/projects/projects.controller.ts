// src/projects/projects.controller.ts
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
  Body,
  Param,
  Delete,
  Get,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from '../../pipes/parseObjectId.pipe';
import { User } from '../../decorators/user.decorator';
import { UserDocument } from '../../mongooseSchemas/user.schema';

@Controller('projects')
export class ProjectsController {
  @Get('is-taken/:projectName')
  async isTaken(
    @Param('projectName') projectName: string,
    @User() user: UserDocument
  ) {
    try {
      return await isTakenHandler(projectName, user);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async create(@Body() body: CreateDto, @User() user: UserDocument) {
    try {
      return await createHandler(user, body);
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
    @User() user: UserDocument
  ) {
    try {
      return await getHandler(projectId, user);
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
    @User() user: UserDocument
  ) {
    try {
      return await deleteHandler(projectId, user);
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
    @User() user: UserDocument
  ) {
    try {
      return await updateHandler(projectId, body, user);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
