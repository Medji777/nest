import {
  Controller,
  Param,
  Query,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors, Req,
} from '@nestjs/common';
import { Request } from "express";
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './blogs.query-repository';
import { PostsService } from '../posts/posts.service';
import { PostsQueryRepository } from '../posts/posts.query-repository';
import {
  QueryBlogsDTO,
  QueryPostsDto,
} from './dto';
import { GetUserInterceptor } from '../auth/interceptors/getUser.interceptor';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getBlogs(@Query() query: QueryBlogsDTO) {
    return this.blogsQueryRepository.getAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBlogOnId(@Param('id') id: string) {
    return this.blogsQueryRepository.findById(id);
  }

  @Get(':blogId/posts')
  @UseInterceptors(GetUserInterceptor)
  async getPostByBlogIdWithQuery(
    @Param('blogId') id: string,
    @Query() query: QueryPostsDto,
    @Req() req: Request
  ) {
    await this.blogsQueryRepository.findById(id);
    return this.postsQueryRepository.getPostsByBlogId(id, query, req.user?.id);
  }

  // @Post()
  // @UseGuards(BasicGuard)
  // @HttpCode(HttpStatus.CREATED)
  // async createBlog(@Body() body: BlogsInputModelDTO) {
  //   return this.blogsService.create(body);
  // }

  // @Put(':id')
  // @UseGuards(BasicGuard)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async updateBlog(
  //   @Param('id') id: string,
  //   @Body() bodyDTO: BlogsInputModelDTO,
  // ) {
  //   await this.blogsService.update(id, bodyDTO);
  // }

  // @Delete(':id')
  // @UseGuards(BasicGuard)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async deleteBlog(@Param('id') id: string) {
  //   await this.blogsService.delete(id);
  // }

  // @Post(':blogId/posts')
  // @UseGuards(BasicGuard)
  // async createPostForBlogId(
  //   @Param('blogId') id: string,
  //   @Body() bodyDTO: BlogPostInputModelDto,
  // ) {
  //   const blog = await this.blogsQueryRepository.findById(id);
  //   return await this.postsService.create({
  //     ...bodyDTO,
  //     blogId: id,
  //     blogName: blog.name,
  //   });
  // }
}
