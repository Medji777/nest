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
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { PostsService } from './posts.service';
import { PostsQueryRepository } from './posts.query-repository';
import { BlogsQueryRepository } from '../blogs/blogs.query-repository';
import { CommentDBModel } from '../types/comments';
import { CommentsService } from '../comments/comments.service';
import { CommentsQueryRepository } from '../comments/comments.query-repository';
import { PostInputModelDto, QueryPostsDto, LikeInputModelDto } from './dto';
import { CommentInputModelDto, QueryCommentsDto } from '../comments/dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { GetUserInterceptor } from '../auth/interceptors/getUser.interceptor';
import { BasicGuard } from '../auth/guards/basic.guard';

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
  @UseInterceptors(GetUserInterceptor)
  @HttpCode(HttpStatus.OK)
  getPosts(@Query() query: QueryPostsDto, @Req() req: Request) {
    return this.postsQueryRepository.getAll(query, req.user?.id);
  }

  @Get(':id')
  @UseInterceptors(GetUserInterceptor)
  @HttpCode(HttpStatus.OK)
  async getPostById(@Param('id') id: string, @Req() req: Request) {
    return await this.postsQueryRepository.findById(id, req.user?.id);
  }

  @Post()
  @UseGuards(BasicGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() bodyDTO: PostInputModelDto) {
    const blog = await this.blogsQueryRepository.findById(bodyDTO.blogId);
    return await this.postsService.create({
      ...bodyDTO,
      blogName: blog.name,
    });
  }

  @Put(':id')
  @UseGuards(BasicGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id') id: string,
    @Body() bodyDTO: PostInputModelDto,
  ) {
    await this.postsService.update(id, bodyDTO);
  }

  @Delete(':id')
  @UseGuards(BasicGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    await this.postsService.delete(id);
  }

  @Get('/:id/comments')
  @UseInterceptors(GetUserInterceptor)
  @HttpCode(HttpStatus.OK)
  async getCommentByPost(
    @Param('id') id: string,
    @Query() query: QueryCommentsDto,
    @Req() req: Request,
  ) {
    await this.postsQueryRepository.findById(id, req.user?.id);
    return this.commentsQueryRepository.getCommentsByPostId(
      id,
      query,
      req.user?.id,
    );
  }

  @Post('/:id/comments')
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  async createCommentByPost(
    @Param('id') id: string,
    @Body() bodyDTO: CommentInputModelDto,
    @Req() req: Request,
  ): Promise<CommentDBModel> {
    const post = await this.postsQueryRepository.findById(id, req.user.id);
    return this.commentsService.create({
      ...bodyDTO,
      postId: post.id,
      userId: '',
      userLogin: '',
    });
  }

  @Put('/:id/like-status')
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateStatusLike(
    @Param('id') id: string,
    @Body() bodyDTO: LikeInputModelDto,
    @Req() req: Request,
  ) {
    await this.postsService.updateStatusLike(
      req.user.id,
      req.user.login,
      id,
      bodyDTO,
    );
  }
}
