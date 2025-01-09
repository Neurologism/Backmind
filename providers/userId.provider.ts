// src/providers/userId.provider.ts
import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class UserIdProvider {
  private userId: Types.ObjectId | undefined;

  setUserId(userId: Types.ObjectId): void {
    this.userId = userId;
  }

  getUserId(): Types.ObjectId {
    if (this.userId === undefined) {
      throw new HttpException('User ID not set', HttpStatus.UNAUTHORIZED);
    }
    return this.userId;
  }
}
