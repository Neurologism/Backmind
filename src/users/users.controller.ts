// src/users/users.controller.ts
import {
  Controller,
  Get,
  Param,
  Delete,
  Patch,
  Body,
  Query,
  Put,
  Post,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'pipes/parseObjectId.pipe';
import { UpdateDto } from './dto/update.schema';
import { UpdateEmailDto } from './dto/updateEmail.schema';
import { deleteHandler } from './handlers/deleteHandler';
import { followHandler } from './handlers/followHandler';
import { getCreditsHandler } from './handlers/getCreditsHandler';
import { getHandler } from './handlers/getHandler';
import { getByNameHandler } from './handlers/getByNameHandler';
import { getPfpHandler } from './handlers/getPfpHandler';
import { isTakenHandler } from './handlers/isTakenHandler';
import { swapPrimaryEmailHandler } from './handlers/swapPrimaryEmailHandler';
import { unfollowHandler } from './handlers/unfollowHandler';
import { updateEmailHandler } from './handlers/updateEmailHandler';
import { updateHandler } from './handlers/updateHandler';
import { uploadPfpHandler } from './handlers/uploadPfpHandler';
import { deleteEmailHandler } from './handlers/deleteEmailHandler';
import { FileInterceptor } from '@nestjs/platform-express';

let pfpUploadMulter;

@Controller('users')
export class UsersController {
  constructor(private userIdProvider: UserIdProvider) {}

  @Private()
  @Get('is-taken')
  async isTaken(
    @Query('brainetTag') brainetTag: string,
    @Query('email') email: string
  ) {
    try {
      return await isTakenHandler(brainetTag, email);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':userId')
  async get(@Param('userId', ParseObjectIdPipe) userId: Types.ObjectId) {
    try {
      const loggedInUserId = this.userIdProvider.getUserId();
      return await getHandler(userId, loggedInUserId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('by-name/:brainetTag')
  async getByName(@Param('brainetTag') brainetTag: string) {
    try {
      const loggedInUserId = this.userIdProvider.getUserId();
      return await getByNameHandler(brainetTag, loggedInUserId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':userId')
  async delete() {
    try {
      const loggedInUserId = this.userIdProvider.getUserId();
      return await deleteHandler(loggedInUserId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':userId')
  async update(@Body() body: UpdateDto) {
    try {
      const loggedInUserId = this.userIdProvider.getUserId();
      return await updateHandler(loggedInUserId, body);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':userId/get-credits')
  async getCredits() {
    try {
      const loggedInUserId = this.userIdProvider.getUserId();
      return await getCreditsHandler(loggedInUserId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':userId/get-pfp')
  async getPfp(@Param('userId', ParseObjectIdPipe) userId: Types.ObjectId) {
    try {
      return await getPfpHandler(userId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':userId/swap-primary-email')
  async swapPrimaryEmail() {
    try {
      const loggedInUserId = this.userIdProvider.getUserId();
      return await swapPrimaryEmailHandler(loggedInUserId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':userId/upload-pfp')
  @UseInterceptors(FileInterceptor('pfp', pfpUploadMulter))
  async uploadPfp(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      const loggedInUserId = this.userIdProvider.getUserId();
      return await uploadPfpHandler(loggedInUserId, file);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(':userId/followers')
  async follow(@Param('userId', ParseObjectIdPipe) userId: Types.ObjectId) {
    try {
      const loggedInUserId = this.userIdProvider.getUserId();
      return await followHandler(userId, loggedInUserId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':userId/followers')
  async unfollow(@Param('userId', ParseObjectIdPipe) userId: Types.ObjectId) {
    try {
      const loggedInUserId = this.userIdProvider.getUserId();
      return await unfollowHandler(userId, loggedInUserId);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':userId/emails')
  async deleteEmail(@Query('emailType') emailType: string) {
    try {
      const loggedInUserId = this.userIdProvider.getUserId();
      return await deleteEmailHandler(loggedInUserId, emailType);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':userId/emails')
  async updateEmailHandler(@Body() body: UpdateEmailDto) {
    try {
      const loggedInUserId = this.userIdProvider.getUserId();
      return await updateEmailHandler(loggedInUserId, body);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
