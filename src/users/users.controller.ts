import {
  Controller,
  Get,
  Post,
  Res,
  Req,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

import { deleteEmailHandler } from './handlers/deleteEmailHandler';
import { deleteHandler } from './handlers/deleteHandler';
import { followHandler } from './handlers/followHandler';
import { getCreditsHandler } from './handlers/getCreditsHandler';
import { getHandler } from './handlers/getHandler';
import { getPfpHandler } from './handlers/getPfpHandler';
import { isTakenHandler } from './handlers/isTakenHandler';
import { swapPrimaryEmailHandler } from './handlers/swapPrimaryEmailHandler';
import { unfollowHandler } from './handlers/unfollowHandler';
import { updateEmailHandler } from './handlers/updateEmailHandler';
import { updateHandler } from './handlers/updateHandler';
import { uploadPfpHandler } from './handlers/uploadPfpHandler';

import { DeleteEmailDto } from './dto/deleteEmail.schema';
import { FollowDto } from './dto/follow.schema';
import { GetDto } from './dto/get.schema';
import { IsTakenDto } from './dto/isTaken.schema';
import { UnfollowDto } from './dto/unfollow.schema';
import { UpdateEmailDto } from './dto/updateEmail.schema';
import { UpdateDto } from './dto/update.schema';

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

@Controller('user')
export class UsersController {
  @Post('delete-email')
  deleteEmail(
    @Body() body: DeleteEmailDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return deleteEmailHandler(body, req, res);
  }

  @Post('delete')
  delete(@Req() req: Request, @Res() res: Response) {
    return deleteHandler(req, res);
  }

  @Post('follow')
  follow(@Body() body: FollowDto, @Req() req: Request, @Res() res: Response) {
    return followHandler(body, req, res);
  }

  @Post('get-credits')
  getCredits(@Req() req: Request, @Res() res: Response) {
    return getCreditsHandler(req, res);
  }

  @Post('get')
  get(@Body() body: GetDto, @Req() req: Request, @Res() res: Response) {
    return getHandler(body, req, res);
  }

  @Get('get-pfp')
  getPfp(@Req() req: Request, @Res() res: Response) {
    return getPfpHandler(req, res);
  }

  @Post('is-taken')
  isTaken(@Body() body: IsTakenDto, @Req() req: Request, @Res() res: Response) {
    return isTakenHandler(body, req, res);
  }

  @Post('swap-primary-email')
  swapPrimaryEmail(@Req() req: Request, @Res() res: Response) {
    return swapPrimaryEmailHandler(req, res);
  }

  @Post('unfollow')
  unfollow(
    @Body() body: UnfollowDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return unfollowHandler(body, req, res);
  }

  @Post('update-email')
  updateEmailHandler(
    @Body() body: UpdateEmailDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return updateEmailHandler(body, req, res);
  }

  @Post('update')
  update(@Body() body: UpdateDto, @Req() req: Request, @Res() res: Response) {
    return updateHandler(body, req, res);
  }

  @Post('upload-pfp')
  @UseInterceptors(FileInterceptor('pfp', pfpUploadMulter))
  uploadPfp(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    return uploadPfpHandler(req, res, file);
  }
}
