import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../mongooseSchemas/user.schema';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH_KEY } from 'decorators/skipAuth.decorator';
import { Types } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const token = req.header('Authorization')?.split(' ')[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      const userId = new Types.ObjectId(decoded._id as string);
      if (!userId) {
        throw new UnauthorizedException();
      }
      const user = await UserModel.findOne({ _id: userId });

      if (user === null) {
        throw new UnauthorizedException();
      }

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      user.tokens = user.tokens.filter((t) => {
        return t.dateAdded > oneMonthAgo;
      }) as any;

      await user.save();

      if (!user.tokens.find((t) => t.token === token)) {
        throw new UnauthorizedException();
      }

      req.userId = userId;
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      } else if (err instanceof jwt.JsonWebTokenError) {
        req.userId = undefined;
        return true;
      } else {
        // req.logger.error(err);
        throw err;
      }
    }
  }
}
