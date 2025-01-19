import { Injectable } from '@nestjs/common';
import { AppLogger } from '../providers/logger.provider';

@Injectable()
export class AppService {
  private readonly logger: AppLogger;

  constructor(logger: AppLogger) {
    this.logger = logger;
  }

  getHello(): string {
    this.logger.verbose('Someone is looking for the root path');
    return "Heyo! You're probably looking for https://whitemind.net";
  }
}
