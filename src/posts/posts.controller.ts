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
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { CommandBus } from "@nestjs/cqrs";
import { UpdateStatusLikeCommand } from "./useCase/command";
import { PostsQueryRepository } from './posts.query-repository';
import { CommentDBModel } from '../types/comments';
import { CommentsService } from '../comments/comments.service';
import { CommentsQueryRepository } from '../comments/comments.query-repository';
import { QueryPostsDto, LikeInputModelDto } from './dto';
import { CommentInputModelDto, QueryCommentsDto } from '../comments/dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { GetUserInterceptor } from '../auth/interceptors/getUser.interceptor';

@Controller('posts')
export class PostsController {
  constructor(
      private commandBus: CommandBus,
      private readonly postsQueryRepository: PostsQueryRepository,
      private readonly commentsService: CommentsService,
      private readonly commentsQueryRepository: CommentsQueryRepository,
      //private readonly postsService: PostsService,
      //private readonly blogsQueryRepository: BlogsQueryRepository,
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

  // @Post()
  // @UseGuards(BasicGuard)
  // @HttpCode(HttpStatus.CREATED)
  // async createPost(@Body() bodyDTO: PostInputModelDto) {
  //   const blog = await this.blogsQueryRepository.findById(bodyDTO.blogId);
  //   return await this.postsService.create({
  //     ...bodyDTO,
  //     blogName: blog.name,
  //   });
  // }

  // @Put(':id')
  // @UseGuards(BasicGuard)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async updatePost(
  //   @Param('id') id: string,
  //   @Body() bodyDTO: PostInputModelDto,
  // ) {
  //   await this.postsService.update(id, bodyDTO);
  // }

  // @Delete(':id')
  // @UseGuards(BasicGuard)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async deletePost(@Param('id') id: string) {
  //   await this.postsService.delete(id);
  // }

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
      userId: req.user.id,
      userLogin: req.user.login,
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
    await this.commandBus.execute(new UpdateStatusLikeCommand(
        req.user.id,
        req.user.login,
        id,
        bodyDTO,
    ))
  }
}
