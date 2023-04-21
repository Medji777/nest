import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Model, Types } from 'mongoose';
import { PostInputModel } from '../types/posts';
import { LikeInfoModel } from '../types/likes';

export type PostsDocument = HydratedDocument<Posts>;
export type PostsModelType = Model<PostsDocument> & PostsModelStatic;

@Schema()
class ExtendedLikesInfo {
  @Prop({ default: 0 })
  likesCount: number;
  @Prop({ default: 0 })
  dislikesCount: number;
}

@Schema()
export class Posts extends Document {
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
  @Prop({ type: Types.ObjectId, ref: ExtendedLikesInfo.name })
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
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    };
    return new PostsModel(newPost);
  }
}

export const PostsSchema = SchemaFactory.createForClass(Posts);

PostsSchema.methods = {
  update: Posts.prototype.update,
  updateLikeInPost: Posts.prototype.updateLikeInPost,
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
