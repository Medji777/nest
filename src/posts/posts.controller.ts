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
import { BlogsQueryRepository } from '../blogs/blogs.query-repository';
import { CommentDBModel } from '../types/comments';
import { CommentsService } from '../comments/comments.service';
import { CommentsQueryRepository } from '../comments/comments.query-repository';
import { PostInputModelDto, QueryPostsDto } from './dto';
import { CommentInputModelDto, QueryCommentsDto } from '../comments/dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getPosts(@Query() query: QueryPostsDto) {
    return this.postsQueryRepository.getAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPostById(@Param('id') id: string) {
    return await this.postsQueryRepository.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() bodyDTO: PostInputModelDto) {
    const blog = await this.blogsQueryRepository.findById(bodyDTO.blogId);
    return await this.postsService.create({
      ...bodyDTO,
      blogName: blog.name,
    });
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id') id: string,
    @Body() bodyDTO: PostInputModelDto,
  ) {
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
    @Query() query: QueryCommentsDto,
  ) {
    await this.postsQueryRepository.findById(id);
    return this.commentsQueryRepository.getCommentsByPostId(id, query);
  }

  @Post('/:id/comments')
  @HttpCode(HttpStatus.CREATED)
  async createCommentByPost(
    @Param('id') id: string,
    @Body() bodyDTO: CommentInputModelDto,
  ): Promise<CommentDBModel> {
    const post = await this.postsQueryRepository.findById(id);
    return this.commentsService.create({
      ...bodyDTO,
      postId: post.id,
      userId: '',
      userLogin: '',
    });
  }

  // @Put('/:id/like-status')
  // updateStatusLike() {}
  //
}
