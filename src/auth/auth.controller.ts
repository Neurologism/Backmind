// dtos
import { LoginDto } from './dto/login.schema';
import { RegisterDto } from './dto/register.schema';

import {
  Controller,
  Post,
  Body,
  Delete,
  Query,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './strategies/jwt.strategy';
import { User } from '../../decorators/user.decorator';
import { UserDocument } from '../../mongooseSchemas/user.schema';
import { Color, sendToDiscord } from '../../utility/sendToDiscord';
// import { AuthGuard } from '@nestjs/passport';
// import fastifyPassport from '@fastify/passport';
// import { GithubAuthGuard } from './github-auth.guard';
// import { Request, Response } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    if (!body.user || (!body.user.brainetTag && !body.user.email)) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    let user: UserDocument;
    if (body.user.brainetTag) {
      user = await this.authService.validateUserByBrainetTag(
        body.user.brainetTag,
        body.user.plainPassword
      );
    } else if (body.user.email) {
      user = await this.authService.validateUserByEmail(
        body.user.email,
        body.user.plainPassword
      );
    } else {
      throw new HttpException(
        'Provide email or brainetTag',
        HttpStatus.BAD_REQUEST
      );
    }
    const response = await this.authService.login(user);

    const embed = {
      title: 'User logged in',
      description: `**Server**: ${process.env.BACKMIND_HOSTNAME}\n**emails:** ${user.emails.map((email) => email.address)}\n**brainetTag:** ${user.brainetTag}`,
      color: Color.BLUE,
    };
    await sendToDiscord(embed, process.env.WEBHOOK_URL_LOGIN);

    return response;
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Delete('logout-all')
  async logoutAll(@User() user: UserDocument) {
    return await this.authService.logoutAll(user);
  }

  // @Public()
  // @Get('github')
  // async github(@Request() req: Request, @Response() res: Response) {
  //   // This method will be intercepted by the guard
  //   fastifyPassport.authenticate('github')(req, res);
  // }
  //
  // @Public()
  // @Get('github/callback')
  // async githubCallback() {
  //   // This method will be intercepted by the guard
  //   fastifyPassport.authenticate('github', { failureRedirect: '/login' });
  //   let user: UserDocument;
  //
  // }

  @Delete('logout')
  async logout(@Query('token') token: string, @User() user: UserDocument) {
    return await this.authService.logout(user, token);
  }

  @Public()
  @Patch('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return await this.authService.verifyEmail(token);
  }
}
