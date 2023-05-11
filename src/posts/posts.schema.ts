import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { PostInputModel } from '../types/posts';
import { LikeInfoModel } from '../types/likes';
import { LikeStatus } from "../types/types";

export type PostsDocument = HydratedDocument<Posts>;
export type PostsModelType = Model<PostsDocument> & PostsModelStatic;

@Schema({ _id: false })
class ExtendedLikesInfo {
  @Prop({ default: 0 })
  likesCount: number;
  @Prop({ default: 0 })
  dislikesCount: number;
}

const ExtendedLikesInfoSchema = SchemaFactory.createForClass(ExtendedLikesInfo)

@Schema()
export class Posts {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  shortDescription: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  blogId: string;
  @Prop({ required: true })
  blogName: string;
  @Prop()
  createdAt?: string;
  @Prop({ type: ExtendedLikesInfoSchema, default: () => ({}) })
  extendedLikesInfo: ExtendedLikesInfo;

  update(payload: PostInputModel) {
    this.title = payload.title;
    this.shortDescription = payload.shortDescription;
    this.content = payload.content;
    this.blogId = payload.blogId;
  }
  updateLikeInPost(payload: LikeInfoModel) {
    this.extendedLikesInfo = payload;
  }

  updateLikesCount(
      statusLike: LikeStatus,
      isBanned: boolean
  ) {
    if (isBanned) {
      if (statusLike === LikeStatus.Like) {
        this.extendedLikesInfo.likesCount--;
      }
      if (statusLike === LikeStatus.Dislike) {
        this.extendedLikesInfo.dislikesCount--;
      }
    } else {
      if (statusLike === LikeStatus.Like) {
        this.extendedLikesInfo.likesCount++;
      }
      if (statusLike === LikeStatus.Dislike) {
        this.extendedLikesInfo.dislikesCount++;
      }
    }
  }

  static make(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    PostsModel: PostsModelType,
  ): PostsDocument {
    const date = new Date();
    const newPost = {
      id: `${+date}`,
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: blogName,
      createdAt: date.toISOString(),
    };
    return new PostsModel(newPost);
  }
}

export const PostsSchema = SchemaFactory.createForClass(Posts);

PostsSchema.methods = {
  update: Posts.prototype.update,
  updateLikeInPost: Posts.prototype.updateLikeInPost,
  updateLikesCount: Posts.prototype.updateLikesCount
};

const staticsMethods = {
  make: Posts.make,
};

PostsSchema.statics = staticsMethods;

export type PostsModelStatic = {
  make(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    PostsModel: PostsModelType,
  ): PostsDocument;
};
