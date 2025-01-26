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
  UseInterceptors,
  Header,
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
import { User } from '../../decorators/user.decorator';
import { UserDocument } from '../../mongooseSchemas/user.schema';
import { AppLogger } from '../../providers/logger.provider';
import { Public } from '../auth/strategies/jwt.strategy';
import { MultipartInterceptor } from '../../utility/multipart.interceptor';
import { Files } from '../../utility/files.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly logger: AppLogger) {}

  @Get()
  async getSelf(@User() user: UserDocument) {
    const userId = user._id;
    return await getHandler(userId, user);
  }

  @Get('is-taken')
  @Public()
  async isTaken(
    @Query('brainetTag') brainetTag: string,
    @Query('email') email: string
  ) {
    return await isTakenHandler(brainetTag, email);
  }

  @Get(':userId')
  async getById(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @User() user: UserDocument
  ) {
    return await getHandler(userId, user);
  }

  @Public()
  @Get('by-name/:brainetTag')
  async getByName(@Param('brainetTag') brainetTag: string) {
    return await getByNameHandler(brainetTag);
  }

  @Delete(':userId')
  async delete(@User() user: UserDocument) {
    return await deleteHandler(user);
  }

  @Patch(':userId')
  async update(@Body() body: UpdateDto, @User() user: UserDocument) {
    return await updateHandler(user, body);
  }

  @Get(':userId/get-credits')
  async getCredits(@User() user: UserDocument) {
    return await getCreditsHandler(user);
  }

  @Public()
  @Get(':userId/get-pfp')
  @Header('Content-Type', 'image/jpeg')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  async getPfp(@Param('userId', ParseObjectIdPipe) userId: Types.ObjectId) {
    return await getPfpHandler(userId);
  }

  @Patch(':userId/swap-primary-email')
  async swapPrimaryEmail(@User() user: UserDocument) {
    return await swapPrimaryEmailHandler(user);
  }

  @Put(':userId/upload-pfp')
  @UseInterceptors(
    MultipartInterceptor({ fileType: /jpeg|png/, maxFileSize: 1000_000 })
  )
  async uploadPfp(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Files() files: Record<string, Storage.MultipartFile[]>,
    @User() user: UserDocument
  ) {
    return await uploadPfpHandler(user, files);
  }

  @Post(':userId/followers')
  async follow(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @User() user: UserDocument
  ) {
    return await followHandler(userId, user);
  }

  @Delete(':userId/followers')
  async unfollow(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @User() user: UserDocument
  ) {
    return await unfollowHandler(userId, user);
  }

  @Delete(':userId/emails')
  async deleteEmail(
    @Query('emailType') emailType: string,
    @User() user: UserDocument
  ) {
    return await deleteEmailHandler(user, emailType);
  }

  @Patch(':userId/emails')
  async updateEmailHandler(
    @Body() body: UpdateEmailDto,
    @User() user: UserDocument
  ) {
    return await updateEmailHandler(user, body, this.logger);
  }
}
