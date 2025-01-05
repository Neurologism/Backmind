import { Controller, Get, Post, Res, Req, Body } from '@nestjs/common';
import { Request, Response } from 'express';

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
import { GetPfpDto } from './dto/getPfp.schema';
import { IsTakenDto } from './dto/isTaken.schema';
import { UnfollowDto } from './dto/unfollow.schema';
import { UpdateEmailDto } from './dto/updateEmail.schema';
import { UpdateDto } from './dto/update.schema';

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
  getPfp(@Body() body: GetPfpDto, @Req() req: Request, @Res() res: Response) {
    return getPfpHandler(body, req, res);
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
  uploadPfp(@Req() req: Request, @Res() res: Response) {
    return uploadPfpHandler(req, res);
  }
}
