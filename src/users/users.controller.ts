import { Controller, Get, Post, Res, Req, Body } from '@nestjs/common';
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

import { DeleteEmailDto } from './dto/deleteEmail.schema';
import { DeleteDto } from './dto/delete.schema';
import { FollowDto } from './dto/follow.schema';
import { GetCreditsDto } from './dto/getCredits.schema';
import { GetDto } from './dto/get.schema';
import { GetPfpDto } from './dto/getPfp.schema';
import { IsTakenDto } from './dto/isTaken.schema';
import { SearchDto } from './dto/search.schema';
import { SwapPrimaryEmailDto } from './dto/swapPrimaryEmail.schema';
import { UnfollowDto } from './dto/unfollow.schema';
import { UpdateEmailDto } from './dto/updateEmail.schema';
import { UpdateDto } from './dto/update.schema';
import { UploadPfpDto } from './dto/uploadPfp.schema';

@Controller('user')
export class UsersController {
  @Post('delete-email')
  deleteEmail(
    @Body() body: DeleteEmailDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return deleteEmailHandler(req, res);
  }

  @Post('delete')
  delete(@Body() body: DeleteDto, @Req() req: Request, @Res() res: Response) {
    return deleteHandler(req, res);
  }

  @Post('follow')
  follow(@Body() body: FollowDto, @Req() req: Request, @Res() res: Response) {
    return followHandler(req, res);
  }

  @Post('get-credits')
  getCredits(
    @Body() body: GetCreditsDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return getCreditsHandler(req, res);
  }

  @Post('get')
  get(@Body() body: GetDto, @Req() req: Request, @Res() res: Response) {
    return getHandler(req, res);
  }

  @Get('get-pfp')
  getPfp(@Body() body: GetPfpDto, @Req() req: Request, @Res() res: Response) {
    return getPfpHandler(req, res);
  }

  @Post('is-taken')
  isTaken(@Body() body: IsTakenDto, @Req() req: Request, @Res() res: Response) {
    return isTakenHandler(req, res);
  }

  @Post('search')
  search(@Body() body: SearchDto, @Req() req: Request, @Res() res: Response) {
    return searchHandler(req, res);
  }

  @Post('swap-primary-email')
  swapPrimaryEmail(
    @Body() body: SwapPrimaryEmailDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return swapPrimaryEmailHandler(req, res);
  }

  @Post('unfollow')
  unfollow(
    @Body() body: UnfollowDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return unfollowHandler(req, res);
  }

  @Post('update-email')
  updateEmailHandler(
    @Body() body: UpdateEmailDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return updateEmailHandler(req, res);
  }

  @Post('update')
  update(@Body() body: UpdateDto, @Req() req: Request, @Res() res: Response) {
    return updateHandler(req, res);
  }

  @Post('upload-pfp')
  uploadPfp(
    @Body() body: UploadPfpDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return uploadPfpHandler(req, res);
  }
}
