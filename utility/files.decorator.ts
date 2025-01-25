// files.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as fastify from 'fastify';

export const Files = createParamDecorator(
  async (
    _data: unknown,
    ctx: ExecutionContext
  ): Promise<null | Record<string, Storage.MultipartFile[]>> => {
    const req = ctx.switchToHttp().getRequest() as fastify.FastifyRequest;
    return req.storedFiles;
  }
);
