import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { BlogsViewModel } from '../types/blogs';
import { BlogDocument } from './blogs.schema';
import { BlogsInputModelDTO } from './dto';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async create(payload: BlogsInputModelDTO): Promise<BlogsViewModel> {
    const createdBlog = this.blogsRepository.create(
      payload.name,
      payload.description,
      payload.websiteUrl,
      false,
    );
    await this.blogsRepository.save(createdBlog);
    return this._createMapBlogs(createdBlog);
  }
  async checkBlogById(id: string): Promise<boolean> {
    const blog = await this.blogsRepository.findBlogById(id);
    return !!blog
  }
  async update(id: string, payload: BlogsInputModelDTO): Promise<void> {
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
