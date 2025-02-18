import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UserModel } from '../../../mongooseSchemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true, // Pass the request to the callback
    });
  }

  async validate(req: FastifyRequest, payload: any) {
    const user = await UserModel.findById(payload._id);
    if (!user) {
      throw new UnauthorizedException();
    }

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const userToken = user.tokens.find((t) => t.token === token);
    if (!userToken) {
      throw new UnauthorizedException();
    }

    const ip = req.ip;
    const userAgent = req.headers['user-agent'] || '';
    const endpoint = req.originalUrl;
    const dateRequested = { $date: new Date() };

    if (ip === undefined || userAgent === undefined) {
      throw new UnauthorizedException();
    }

    // Log the IP and user agent
    if (!userToken.ips.includes(ip)) {
      userToken.ips.push(ip);
    }
    if (!userToken.userAgents.includes(userAgent)) {
      userToken.userAgents.push(userAgent);
    }

    // Log the request
    user.requests.push({ endpoint, dateRequested });

    await user.save();

    return user;
  }
}

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
