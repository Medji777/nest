import { Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async checkBlogById(id: string): Promise<boolean> {
    const blog = await this.blogsRepository.findBlogById(id);
    return !!blog
  }
  async deleteAll(): Promise<void> {
    await this.blogsRepository.deleteAll();
  }
}
