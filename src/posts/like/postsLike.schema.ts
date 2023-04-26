import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatus } from '../../types/types';
import { HydratedDocument, Model } from 'mongoose';
import { LikesPostsModelDTO } from '../../types/likes';

export type PostsLikeDocument = HydratedDocument<PostsLike>;
export type PostsLikeModelType = Model<PostsLikeDocument> &
  PostsLikeModelStatic;

@Schema()
export class PostsLike {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  postId: string;
  @Prop({
    type: String,
    enum: Object.values(LikeStatus),
    required: true,
  })
  myStatus: LikeStatus;
  @Prop({ required: true })
  login: string;
  @Prop({
    type: String,
    default: Date.now.toString,
  })
  addedAt: string;

  static make(
    userId: string,
    postId: string,
    login: string,
    likeStatus: LikeStatus,
    PostsLikeModel: PostsLikeModelType,
  ): PostsLikeDocument {
    const newLike = new LikesPostsModelDTO(
      userId,
      postId,
      login,
      new Date().toISOString(),
      likeStatus,
    );
    return new PostsLikeModel(newLike);
  }
}

export const PostsLikeSchema = SchemaFactory.createForClass(PostsLike);

const staticsMethods = {
  make: PostsLike.make,
};

PostsLikeSchema.statics = staticsMethods;

export type PostsLikeModelStatic = {
  make(
    userId: string,
    postId: string,
    login: string,
    likeStatus: LikeStatus,
    PostsLikeModel: PostsLikeModelType,
  ): PostsLikeDocument;
};