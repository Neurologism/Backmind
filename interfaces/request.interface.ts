import mongoose from 'mongoose';

declare global {
  namespace Fastify {
    export interface FastifyRequest {
      userId?: mongoose.Types.ObjectId | null;
    }
  }
}
