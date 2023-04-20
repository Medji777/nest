import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { BlogsInputModel, BlogsViewModel } from '../types/blogs';
import { BlogDocument } from './blogs.schema';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async create(payload: BlogsInputModel): Promise<BlogsViewModel> {
    const createdBlog = this.blogsRepository.create(
      payload.name,
      payload.description,
      payload.websiteUrl,
      false,
    );
    await this.blogsRepository.save(createdBlog);
    return this._createMapBlogs(createdBlog);
  }
  async update(id: string, payload: BlogsInputModel): Promise<void> {
    const blog = await this.blogsRepository.findBlogById(id);
    if (!blog) {
      throw new NotFoundException('blog not found');
    }
    blog.update(payload);
    await this.blogsRepository.save(blog);
  }
  async delete(id: string): Promise<void> {
    const isDeleted = await this.blogsRepository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException('blog not found');
    }
  }
  async deleteAll(): Promise<void> {
    await this.blogsRepository.deleteAll();
  }
  private _createMapBlogs(model: BlogDocument): BlogsViewModel {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      websiteUrl: model.websiteUrl,
      createdAt: model.createdAt,
      isMembership: model.isMembership,
    };
  }
}
