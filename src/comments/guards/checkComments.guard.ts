import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentsQueryRepository } from '../comments.query-repository';
import { Reflector } from '@nestjs/core';

export class CheckCommentsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isUser = this.reflector.get<boolean>(
      'checkUser',
      context.getHandler(),
    );
    console.log('isUser: ', isUser);
    const req: Request = context.switchToHttp().getRequest();
    const comment = await this.commentsQueryRepository.findById(req.params.id);
    if (!comment) {
      throw new NotFoundException();
    }
    if (!!isUser && comment.commentatorInfo.userId !== req.user!.id) {
      throw new ForbiddenException();
    }
    return true;
  }
}
