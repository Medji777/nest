import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import {
  CommentatorInfo,
  CommentDBModel,
  CommentInputModel,
  CommentViewModel,
  PostId,
} from '@type/comments';
import { CommentsDocument } from './comments.schema';
import { LikeStatus } from '@type/types';
import { LikeInfoModel } from '@type/likes';

type CommentPayload = CommentInputModel & CommentatorInfo & PostId;

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}
  async create(payload: CommentPayload): Promise<CommentDBModel> {
    const doc = this.commentsRepository.create(
      payload.content,
      payload.postId,
      payload.userId,
      payload.userLogin,
    );
    await this.commentsRepository.save(doc);
    return this._mapComments(doc);
  }
  async update(id: string, payload: CommentInputModel): Promise<boolean> {
    const doc = await this.commentsRepository.findById(id);
    if (!doc) return false;
    doc.update(payload);
    await this.commentsRepository.save(doc);
    return true;
  }
  async delete(id: string): Promise<boolean> {
    return this.commentsRepository.delete(id);
  }
  async deleteAll(): Promise<void> {
    await this.commentsRepository.deleteAll();
  }
  private async updateLikeInComment(
    id: string,
    likesInfoDTO: LikeInfoModel,
  ): Promise<boolean> {
    const doc = await this.commentsRepository.findById(id);
    if (!doc) return false;
    doc.updateLikeInComment(likesInfoDTO);
    await this.commentsRepository.save(doc);
    return true;
  }
  private _mapComments(doc: CommentsDocument): CommentDBModel {
    return {
      id: doc.id,
      content: doc.content,
      commentatorInfo: doc.commentatorInfo,
      createdAt: doc.createdAt,
      likesInfo: {
        likesCount: doc.likesInfo.likesCount,
        dislikesCount: doc.likesInfo.dislikesCount,
      },
    };
  }
  private _likeCreateTransform(comment: CommentDBModel): CommentViewModel {
    return {
      ...comment,
      likesInfo: {
        ...comment.likesInfo,
        myStatus: LikeStatus.None,
      },
    };
  }
}
