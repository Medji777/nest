import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Get,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsQueryRepository } from './posts.query-repository';
import { PostInputModel, QueryPosts } from '../types/posts';
import { BlogsQueryRepository } from '../blogs/blogs.query-repository';
import { CommentInputModel, QueryComments } from '../types/comments';
import { CommentsService } from '../comments/comments.service';
import { CommentsQueryRepository } from '../comments/comments.query-repository';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    // private readonly commentsService: CommentsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getPosts(@Query() query: QueryPosts) {
    return this.postsQueryRepository.getAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPostById(@Param('id') id: string) {
    return await this.postsQueryRepository.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() bodyDTO: PostInputModel) {
    const blog = await this.blogsQueryRepository.findById(bodyDTO.blogId);
    return await this.postsService.create({
      ...bodyDTO,
      blogName: blog.name,
    });
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param('id') id: string, @Body() bodyDTO: PostInputModel) {
    await this.postsService.update(id, bodyDTO);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    await this.postsService.delete(id);
  }

  @Get('/:id/comments')
  @HttpCode(HttpStatus.OK)
  async getCommentByPost(
    @Param('id') id: string,
    @Query() query: QueryComments,
  ) {
    await this.postsQueryRepository.findById(id);
    return this.commentsQueryRepository.getCommentsByPostId(id, query);
  }

  @Post('/:id/comments')
  @HttpCode(HttpStatus.CREATED)
  async createCommentByPost(
    @Param('id') id: string,
    @Body() bodyDTO: CommentInputModel,
  ) {
    return this.postsService.createCommentByPost(id, '', '', bodyDTO);
  }

  // @Put('/:id/like-status')
  // updateStatusLike() {}
  //
}
