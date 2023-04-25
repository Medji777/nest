import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comments,
  CommentsDocument,
  CommentsModuleType,
} from './comments.schema';
import { CommentViewModel } from '../types/comments';
import { LikeStatus, Paginator, SortDirections } from '../types/types';
import { getSortNumber } from '../utils/sort';
import { transformPagination } from '../utils/transform';
import { QueryCommentsDto } from './dto';
import {CommentsLikeQueryRepository} from "./like/commentsLike.query-repository";
import {PaginationService} from "../applications/pagination.service";

const projection = { _id: 0, postId: 0, __v: 0 };

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comments.name) private CommentsModel: CommentsModuleType,
    private readonly commentsLikeQueryRepository: CommentsLikeQueryRepository,
    private readonly paginationService: PaginationService
  ) {}
  async findById(
    id: string,
    userId?: string,
  ): Promise<CommentViewModel> {
    const doc = await this.CommentsModel.findOne({ id }, projection);
    if (!doc) {
      throw new NotFoundException('comment not found');
    }
    const mappedResult = this._getOutputComment(doc);
    if (userId && mappedResult) {
      await this._setLike(userId, mappedResult);
    }
    return mappedResult;
  }
  async getCommentsByPostId(
    id: string,
    query: QueryCommentsDto,
    userId?: string,
  ): Promise<Paginator<CommentViewModel>> {
    const filter = { postId: id };
    const {
      doc,
      pageSize,
      pageNumber,
      count
    } = await this.paginationService.create(query, this.CommentsModel, projection, filter)

    const mappedComments = doc.map(this._getOutputComment);
    const mappedCommentsWithStatusLike = await this._setStatusLikeMapped(mappedComments, userId!)

    return transformPagination<CommentViewModel>(
        mappedCommentsWithStatusLike,
        pageSize,
        pageNumber,
        count,
    );
  }
  private _getOutputComment(comment: CommentsDocument): CommentViewModel {
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: LikeStatus.None,
      },
    };
  }
  private async _setStatusLikeMapped(comments: Array<CommentViewModel>, userId: string): Promise<Array<CommentViewModel>> {
    if (!userId) return comments
    await Promise.all(comments.map(async (comment: CommentViewModel) => {
      await this._setLike(userId, comment)
    }))
    return comments
  }
  private async _setLike(userId: string, model: CommentViewModel): Promise<void>{
    const like = await this.commentsLikeQueryRepository.getLike(userId, model.id)
    if (like) {
      model.likesInfo.myStatus = like.myStatus;
    }
  }
}
