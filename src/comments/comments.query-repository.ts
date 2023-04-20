import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comments,
  CommentsDocument,
  CommentsModuleType,
} from './comments.schema';
import { CommentViewModel, QueryComments } from '../types/comments';
import { LikeStatus, Paginator } from '../types/types';
import { getSortNumber } from '../utils/sort';
import { transformPagination } from '../utils/transform';

const projection = { _id: 0, postId: 0, __v: 0 };

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comments.name) private CommentsModel: CommentsModuleType,
  ) {}
  async findById(
    id: string,
    // userId?: string,
  ): Promise<CommentViewModel> {
    const doc = await this.CommentsModel.findOne(
      { id },
      { _id: 0, postId: 0, __v: 0 },
    );
    if (!doc) {
      throw new NotFoundException('comment not found');
    }
    const mappedResult = this._getOutputComment(doc);
    // if (userId && mappedResult) {
    //   await this._setLike(userId, mappedResult);
    // }
    return mappedResult;
  }
  async getCommentsByPostId(
    id: string,
    query: QueryComments,
    //userId?: string,
  ): Promise<Paginator<CommentViewModel>> {
    const filter = { postId: id };
    const { sortBy, sortDirection, pageNumber, pageSize } = query;
    const sortNumber = getSortNumber(sortDirection);
    const skipNumber = (pageNumber - 1) * pageSize;
    const count = await this.CommentsModel.countDocuments(filter);
    const doc = await this.CommentsModel.find(filter, projection)
      .sort({ [sortBy]: sortNumber })
      .skip(skipNumber)
      .limit(pageSize);

    const mappedComments = doc.map(this._getOutputComment);
    //const mappedCommentsWithStatusLike = await this._setStatusLikeMapped(mappedComments, userId!)

    return transformPagination<CommentViewModel>(
      mappedComments,
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
  // private async _setLike(userId: string, model: CommentViewModel): Promise<void>{
  //   const like = await this.commentsLikeQueryRepository.getLike(userId, model.id)
  //   if (like) {
  //     model.likesInfo.myStatus = like.myStatus;
  //   }
  // }
}
