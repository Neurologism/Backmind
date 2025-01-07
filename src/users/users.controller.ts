// handlers
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

// dtos
import { UpdateEmailDto } from './dto/updateEmail.schema';
import { UpdateDto } from './dto/update.schema';

import {
  Controller,
  Get,
  Post,
  Res,
  Req,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
  Delete,
  Patch,
  Query,
  Put,
} from '@nestjs/common';
import { Request, Response } from 'express';
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
  isTaken(
    @Query('brainetTag') brainetTag: string,
    @Query('email') email: string,
    @Res() res: Response
  ) {
    return isTakenHandler(brainetTag, email, res);
  }

  @Get(':userId')
  get(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return getHandler(userId, req, res);
  }

  @Get('by-name/:brainetTag')
  getByName(
    @Param('brainetTag') brainetTag: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return getByNameHandler(brainetTag, req, res);
  }

  @Delete(':userId')
  delete(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return deleteHandler(userId, req, res);
  }

  @Patch(':userId')
  update(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Body() body: UpdateDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return updateHandler(userId, body, req, res);
  }

  @Get(':userId/get-credits')
  getCredits(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return getCreditsHandler(userId, req, res);
  }

  @Get(':userId/get-pfp')
  getPfp(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Res() res: Response
  ) {
    return getPfpHandler(userId, res);
  }

  @Patch(':userId/swap-primary-email')
  swapPrimaryEmail(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return swapPrimaryEmailHandler(userId, req, res);
  }

  @Put(':userId/upload-pfp')
  @UseInterceptors(FileInterceptor('pfp', pfpUploadMulter))
  uploadPfp(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    return uploadPfpHandler(userId, req, res, file);
  }

  @Post(':userId/followers')
  follow(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return followHandler(userId, req, res);
  }

  @Delete(':userId/followers')
  unfollow(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return unfollowHandler(userId, req, res);
  }

  @Delete(':userId/emails')
  deleteEmail(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Query('emailType') emailType: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return deleteEmailHandler(userId, emailType, req, res);
  }

  @Patch(':userId/emails')
  updateEmailHandler(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Body() body: UpdateEmailDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return updateEmailHandler(userId, body, req, res);
  }
}
