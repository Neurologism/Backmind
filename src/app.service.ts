import { Injectable, Logger } from '@nestjs/common';
import { AppLogger } from './logger.service';

@Injectable()
export class AppService {
  private readonly logger: AppLogger;

  constructor(logger: AppLogger) {
    this.logger = logger;
  }

  getHello(): string {
    this.logger.log('Someone is looking for the root path');
    return "Heyo! You're probably looking for https://whitemind.net";
  }
}
