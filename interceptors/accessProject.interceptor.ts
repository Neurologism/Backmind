import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProjectModel } from '../mongooseSchemas/project.schema';

@Injectable()
export class AccessProjectInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    if (!req.userId) {
      throw new UnauthorizedException(
        'You need to be authenticated to access this resource.'
      );
    }

    const dbProject = await ProjectModel.findOne({
      _id: req.body.project?._id,
    });

    if (!dbProject) {
      throw new NotFoundException(
        "There is no project with that id or you don't have access to it."
      );
    }

    const isProjectOwner =
      dbProject.ownerId?.toString() === req.userId.toString();
    const canUpdateProject =
      isProjectOwner ||
      dbProject.contributors.some(
        (contributor) => contributor._id.toString() === req.userId.toString()
      );

    if (!canUpdateProject) {
      throw new NotFoundException(
        "There is no project with that id or you don't have access to it."
      );
    }

    req.project = dbProject;
    req.middlewareParams = { isProjectOwner, canUpdateProject };

    return next.handle();
  }
}
