import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument, Model, Types} from 'mongoose';
import { CommentInputModel } from '@type/comments';
import { LikeInfoModel } from '@type/likes';

export type CommentsDocument = HydratedDocument<Comments>;
export type CommentsModuleType = Model<CommentsDocument> &
  CommentsStaticMethods;
export type CommentsStaticMethods = {
  make: (
    content: string,
    postId: string,
    userId: string,
    userLogin: string,
    CommentsModel: CommentsModuleType,
  ) => CommentsDocument;
};

@Schema()
class CommentatorInfo {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  userLogin: string;
}

@Schema()
class LikesInfo {
  @Prop({ required: true })
  likesCount: number;
  @Prop({ required: true })
  dislikesCount: number;
}

@Schema()
export class Comments {
  @Prop()
  id: string;
  @Prop({ required: true })
  content: string;
  @Prop({ type: Types.ObjectId, ref: CommentatorInfo.name })
  commentatorInfo: CommentatorInfo;
  @Prop({ required: true })
  createdAt: string;
  @Prop({ required: true })
  postId: string;
  @Prop({ type: Types.ObjectId, ref: LikesInfo.name })
  likesInfo: LikesInfo;

  update(payload: CommentInputModel) {
    this.content = payload.content;
  }

  updateLikeInComment(payload: LikeInfoModel) {
    this.likesInfo.likesCount = payload.likesCount;
    this.likesInfo.dislikesCount = payload.dislikesCount;
  }

  static make(
    content: string,
    postId: string,
    userId: string,
    userLogin: string,
    CommentsModel: CommentsModuleType,
  ): CommentsDocument {
    const date = new Date();
    const newComment = {
      id: `${+date}`,
      content: content,
      postId: postId,
      commentatorInfo: {
        userId: userId,
        userLogin: userLogin,
      },
      createdAt: date.toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    };
    return new CommentsModel(newComment);
  }
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);

CommentsSchema.methods = {
  update: Comments.prototype.update,
  updateLikeInComment: Comments.prototype.updateLikeInComment,
};

const staticMethods: CommentsStaticMethods = {
  make: Comments.make,
};

CommentsSchema.statics = staticMethods;
