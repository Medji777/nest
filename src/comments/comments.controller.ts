import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CommentsQueryRepository } from './comments.query-repository';

@Controller()
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getComments(@Param('id') id: string) {
    return await this.commentsQueryRepository.findById(id);
  }
}
