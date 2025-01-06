import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name, { timestamp: true });

  getHello(): string {
    this.logger.log('Someone is looking for the root path');
    return "Heyo! You're probably looking for https://whitemind.net";
  }
}
