import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts, PostsDocument, PostsModelType } from '../entity/posts.schema';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Posts.name) private PostsModel: PostsModelType) {}
  create(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ): PostsDocument {
    return this.PostsModel.make(
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      this.PostsModel,
    );
  }
  async findById(id: string): Promise<PostsDocument> {
    return this.PostsModel.findOne({ id });
  }
  async findByIdAndBlogId(id: string, blogId: string): Promise<PostsDocument> {
    return this.PostsModel.findOne({ id, blogId });
  }
  async deleteById(id: string): Promise<boolean> {
    const result = await this.PostsModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async deleteAll(): Promise<void> {
    await this.PostsModel.deleteMany();
  }
  async save(model: PostsDocument): Promise<void> {
    await model.save();
  }
}
