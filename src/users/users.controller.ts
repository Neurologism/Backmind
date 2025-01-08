import { deleteEmailHandler } from './handlers/deleteEmailHandler';
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
import { UpdateEmailDto } from './dto/updateEmail.schema';
import { UpdateDto } from './dto/update.schema';
import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
  Delete,
  Patch,
  Query,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { ParseObjectIdPipe } from 'pipes/parseObjectId.pipe';
import { Types } from 'mongoose';
import { SkipAuth } from 'decorators/skipAuth.decorator';

export const pfpUploadMulter = {
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
    const allowedMimeTypes = [
      'image/webp',
      'image/jpg',
      'image/jpeg',
      'image/png',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type.'));
    }
    cb(null, true);
  },
};

@Controller('users')
export class UsersController {
  @Get('is-taken')
  @SkipAuth()
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
    @Req() req: Request
  ) {
    try {
      return await getHandler(userId, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('by-name/:brainetTag')
  async getByName(
    @Param('brainetTag') brainetTag: string,
    @Req() req: Request
  ) {
    try {
      return await getByNameHandler(brainetTag, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':userId')
  async delete(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Req() req: Request
  ) {
    try {
      return await deleteHandler(userId, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':userId')
  async update(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Body() body: UpdateDto,
    @Req() req: Request
  ) {
    try {
      return await updateHandler(userId, body, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':userId/get-credits')
  async getCredits(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Req() req: Request
  ) {
    try {
      return await getCreditsHandler(userId, req);
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
  async swapPrimaryEmail(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Req() req: Request
  ) {
    try {
      return await swapPrimaryEmailHandler(userId, req);
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
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      return await uploadPfpHandler(userId, req, file);
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
    @Req() req: Request
  ) {
    try {
      return await followHandler(userId, req);
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
    @Req() req: Request
  ) {
    try {
      return await unfollowHandler(userId, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':userId/emails')
  async deleteEmail(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Query('emailType') emailType: string,
    @Req() req: Request
  ) {
    try {
      return await deleteEmailHandler(userId, emailType, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':userId/emails')
  async updateEmailHandler(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Body() body: UpdateEmailDto,
    @Req() req: Request
  ) {
    try {
      return await updateEmailHandler(userId, body, req);
    } catch (error) {
      throw new HttpException(
        (error as any).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
