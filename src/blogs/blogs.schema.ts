import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BlogsInputModel, BlogsViewModelDTO } from '../types/blogs';
import { HydratedDocument, Model } from 'mongoose';

export type BlogDocument = HydratedDocument<Blogs>;
export type BlogsModelType = Model<BlogDocument> & BlogsModelStatic;

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

  update(payload: BlogsInputModel) {
    this.name = payload.name;
    this.description = payload.description;
    this.websiteUrl = payload.websiteUrl;
  }

  static make(
    name: string,
    description: string,
    websiteUrl: string,
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
    return new BlogsModel(newBlog);
  }
}

export const BlogsSchema = SchemaFactory.createForClass(Blogs);

BlogsSchema.methods = {
  update: Blogs.prototype.update,
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
    isMembership: boolean,
    BlogsModel: BlogsModelType,
  ) => BlogDocument;
};
