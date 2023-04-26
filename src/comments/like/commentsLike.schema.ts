import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { LikeStatus } from '../../types/types';
import { LikesCommentModelDTO } from '../../types/likes';

export type CommentsLikeDocument = HydratedDocument<CommentsLike>;
export type CommentsLikeModelType = Model<CommentsLikeDocument> &
  CommentsLikeMethodsStatic;

@Schema()
export class CommentsLike {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  commentId: string;
  @Prop({
    type: String,
    enum: Object.values(LikeStatus),
    required: true,
  })
  myStatus: LikeStatus;

  update(myStatus: LikeStatus) {
    this.myStatus = myStatus;
  }

  static make(
    userId: string,
    commentId: string,
    likeStatus: LikeStatus,
    CommentsLike: CommentsLikeModelType,
  ): CommentsLikeDocument {
    const newComment = new LikesCommentModelDTO(userId, commentId, likeStatus);
    return new CommentsLike(newComment);
  }
}

export const CommentsLikeSchema = SchemaFactory.createForClass(CommentsLike);

CommentsLikeSchema.methods = {
  update: CommentsLike.prototype.update,
};

const staticMethod: CommentsLikeMethodsStatic = {
  make: CommentsLike.make,
};

CommentsLikeSchema.statics = staticMethod;

export type CommentsLikeMethodsStatic = {
  make(
    userId: string,
    commentId: string,
    likeStatus: LikeStatus,
    CommentsLike: CommentsLikeModelType,
  ): CommentsLikeDocument;
};
