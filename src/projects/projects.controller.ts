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
import { ParseObjectIdPipe } from 'pipes/parseObjectId.pipe';
import { UserIdProvider } from 'providers/userId.provider';

@Controller('projects')
export class ProjectsController {
  constructor(private userIdProvider: UserIdProvider) {}

  @Get('is-taken/:projectName')
  async isTaken(@Param('projectName') projectName: string) {
    try {
      const userId = this.userIdProvider.getUserId();
      return await isTakenHandler(projectName, userId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async create(@Body() body: CreateDto) {
    try {
      const userId = this.userIdProvider.getUserId();
      return await createHandler(userId, body);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':projectId')
  async get(@Param('projectId', ParseObjectIdPipe) projectId: Types.ObjectId) {
    try {
      const userId = this.userIdProvider.getUserId();
      return await getHandler(projectId, userId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':projectId')
  async delete(
    @Param('projectId', ParseObjectIdPipe) projectId: Types.ObjectId
  ) {
    try {
      const userId = this.userIdProvider.getUserId();
      return await deleteHandler(projectId, userId);
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
    @Body() body: UpdateDto
  ) {
    try {
      const userId = this.userIdProvider.getUserId();
      return await updateHandler(projectId, body, userId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
