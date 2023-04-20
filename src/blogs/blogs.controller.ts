import {
  Body,
  Controller,
  Param,
  Query,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './blogs.query-repository';
import { BlogsInputModel, QueryBlogs } from '../types/blogs';
import { PostInputModel } from "../types/posts";
import { PostsService } from "../posts/posts.service";
import { PostsQueryRepository } from "../posts/posts.query-repository";

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getBlogs(@Query() query: QueryBlogs) {
    return this.blogsQueryRepository.getAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBlogOnId(@Param('id') id: string) {
    return this.blogsQueryRepository.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() body: BlogsInputModel) {
    return this.blogsService.create(body);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param('id') id: string, @Body() body: BlogsInputModel) {
    await this.blogsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string) {
    await this.blogsService.delete(id);
  }

  @Get(':blogId/posts')
  async getPostByBlogIdWithQuery(@Param('blogId') id: string, @Query() query) {
    await this.blogsQueryRepository.findById(id);
    return this.postsQueryRepository.getPostsByBlogId(id,query)
  }

  @Post(':blogId/posts')
  async createPostForBlogId(@Param('blogId') id: string, @Body() bodyDTO: PostInputModel) {
    const blog = await this.blogsQueryRepository.findById(id);
    return await this.postsService.create({
      ...bodyDTO,
      blogId: id,
      blogName: blog.name
    })
  }
}
