import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BlogsInputModel, BlogsViewModelDTO } from '../types/blogs';
import {HydratedDocument, Model, Types} from 'mongoose';

export type BlogDocument = HydratedDocument<Blogs>;
export type BlogsModelType = Model<BlogDocument> & BlogsModelStatic;

@Schema({ _id: false })
class BlogOwnerInfo {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userLogin: string;

  @Prop({ default: false })
  isBanned: boolean;
}

const BlogOwnerInfoSchema = SchemaFactory.createForClass(BlogOwnerInfo)

@Schema()
export class Blogs {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop()
  createdAt?: string;

  @Prop()
  isMembership?: boolean;

  @Prop({ type: BlogOwnerInfoSchema })
  blogOwnerInfo: BlogOwnerInfo

  update(payload: BlogsInputModel) {
    this.name = payload.name;
    this.description = payload.description;
    this.websiteUrl = payload.websiteUrl;
  }

  checkIncludeUser(userId: string): boolean {
    return this.blogOwnerInfo.userId === userId
  }

  static make(
    name: string,
    description: string,
    websiteUrl: string,
    userId: string,
    userLogin: string,
    isMembership: boolean,
    BlogsModel: BlogsModelType,
  ): BlogDocument {
    const date = new Date();
    const newBlog = new BlogsViewModelDTO(
      `${+date}`,
      name,
      description,
      websiteUrl,
      date.toISOString(),
      isMembership,
    );
    return new BlogsModel({
      ...newBlog,
      blogOwnerInfo: {
        userId,
        userLogin
      }
    });
  }
}

export const BlogsSchema = SchemaFactory.createForClass(Blogs);

BlogsSchema.methods = {
  update: Blogs.prototype.update,
  checkIncludeUser: Blogs.prototype.checkIncludeUser
};

const blogsStaticMethods: BlogsModelStatic = {
  make: Blogs.make,
};

BlogsSchema.statics = blogsStaticMethods;

export type BlogsModelStatic = {
  make: (
    name: string,
    description: string,
    websiteUrl: string,
    userId: string,
    userLogin: string,
    isMembership: boolean,
    BlogsModel: BlogsModelType,
  ) => BlogDocument;
};
