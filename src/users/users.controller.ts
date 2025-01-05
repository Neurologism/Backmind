import { Controller, Get, Post, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';

import { deleteEmailHandler } from './handlers/deleteEmailHandler';
import { deleteHandler } from './handlers/deleteHandler';
import { followHandler } from './handlers/followHandler';
import { getCreditsHandler } from './handlers/getCreditsHandler';
import { getHandler } from './handlers/getHandler';
import { getPfpHandler } from './handlers/getPfpHandler';
import { isTakenHandler } from './handlers/isTakenHandler';
import { searchHandler } from './handlers/searchHandler';
import { swapPrimaryEmailHandler } from './handlers/swapPrimaryEmailHandler';
import { unfollowHandler } from './handlers/unfollowHandler';
import { updateEmailHandler } from './handlers/updateEmailHandler';
import { updateHandler } from './handlers/updateHandler';
import { uploadPfpHandler } from './handlers/uploadPfpHandler';

@Controller('user')
export class UsersController {
  @Post('delete-email')
  deleteEmail(@Req() req: Request, @Res() res: Response) {
    return deleteEmailHandler(req, res);
  }

  @Post('delete')
  delete(@Req() req: Request, @Res() res: Response) {
    return deleteHandler(req, res);
  }

  @Post('follow')
  follow(@Req() req: Request, @Res() res: Response) {
    return followHandler(req, res);
  }

  @Post('get-credits')
  getCredits(@Req() req: Request, @Res() res: Response) {
    return getCreditsHandler(req, res);
  }

  @Post('get')
  get(@Req() req: Request, @Res() res: Response) {
    return getHandler(req, res);
  }

  @Get('get-pfp')
  getPfp(@Req() req: Request, @Res() res: Response) {
    return getPfpHandler(req, res);
  }

  @Post('is-taken')
  isTaken(@Req() req: Request, @Res() res: Response) {
    return isTakenHandler(req, res);
  }

  @Post('search')
  search(@Req() req: Request, @Res() res: Response) {
    return searchHandler(req, res);
  }

  @Post('swap-primary-email')
  swapPrimaryEmail(@Req() req: Request, @Res() res: Response) {
    return swapPrimaryEmailHandler(req, res);
  }

  @Post('unfollow')
  unfollow(@Req() req: Request, @Res() res: Response) {
    return unfollowHandler(req, res);
  }

  @Post('update-email')
  updateEmailHandler(@Req() req: Request, @Res() res: Response) {
    return updateEmailHandler(req, res);
  }

  @Post('update')
  update(@Req() req: Request, @Res() res: Response) {
    return updateHandler(req, res);
  }

  @Post('upload-pfp')
  uploadPfp(@Req() req: Request, @Res() res: Response) {
    return uploadPfpHandler(req, res);
  }
}
