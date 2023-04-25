import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  SetMetadata,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { CommentsService} from "./comments.service";
import { CommentsQueryRepository } from './comments.query-repository';
import { CheckCommentsGuard } from "./guards/checkComments.guard";
import { CommentInputModel } from "../types/comments";
import { LikeInputModel } from "../types/likes";

@Controller('comments')
export class CommentsController {
  constructor(
      private readonly commentsService: CommentsService,
      private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getComments(@Param('id') id: string) {
    return this.commentsQueryRepository.findById(id);
  }

  @Put(':id')
  @UseGuards(CheckCommentsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComments(
      @Param('id') id: string,
      @Body() bodyDTO: CommentInputModel
  ) {
    await this.commentsService.update(id, bodyDTO);
  }

  @Put(':id/like-status')
  @SetMetadata('checkUser',true)
  @UseGuards(CheckCommentsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeAtComment(
      @Param('id') id: string,
      @Body() bodyDTO: LikeInputModel,
      @Req() req: Request
  ) {
    await this.commentsService.updateLike(id, req.user?.id, bodyDTO)
  }

  @Delete(':id')
  @UseGuards(CheckCommentsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComments(@Param('id') id: string) {
    await this.commentsService.delete(id)
  }
}
