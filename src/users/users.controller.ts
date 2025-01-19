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
import { ParseObjectIdPipe } from '../../pipes/parseObjectId.pipe';
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
import { User } from '../../decorators/user.decorator';
import { UserDocument } from '../../mongooseSchemas/user.schema';
import { AppLogger } from '../../providers/logger.provider';

let pfpUploadMulter;

@Controller('users')
export class UsersController {
  constructor(private readonly logger: AppLogger) {}

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
  async get(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @User() user: UserDocument
  ) {
    try {
      return await getHandler(userId, user);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('by-name/:brainetTag')
  async getByName(@Param('brainetTag') brainetTag: string, @User() user: any) {
    try {
      return await getByNameHandler(brainetTag, user);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':userId')
  async delete(@User() user: any) {
    try {
      return await deleteHandler(user);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':userId')
  async update(@Body() body: UpdateDto, @User() user: any) {
    try {
      return await updateHandler(user, body);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':userId/get-credits')
  async getCredits(@User() user: any) {
    try {
      return await getCreditsHandler(user);
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
  async swapPrimaryEmail(@User() user: any) {
    try {
      return await swapPrimaryEmailHandler(user);
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
    @UploadedFile() file: Express.Multer.File,
    @User() user: any
  ) {
    try {
      return await uploadPfpHandler(user, file);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(':userId/followers')
  async follow(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @User() user: any
  ) {
    try {
      return await followHandler(userId, user);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':userId/followers')
  async unfollow(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @User() user: any
  ) {
    try {
      return await unfollowHandler(userId, user);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':userId/emails')
  async deleteEmail(@Query('emailType') emailType: string, @User() user: any) {
    try {
      return await deleteEmailHandler(user, emailType);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':userId/emails')
  async updateEmailHandler(@Body() body: UpdateEmailDto, @User() user: any) {
    try {
      return await updateEmailHandler(user, body, this.logger);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
