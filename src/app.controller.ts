import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Public } from './auth/strategies/jwt.strategy';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @UseGuards(ThrottlerGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
