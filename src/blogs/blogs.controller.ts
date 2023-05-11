import {
  Controller,
  Param,
  Query,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './blogs.query-repository';
import { PostsService } from '../posts/posts.service';
import { PostsQueryRepository } from '../posts/posts.query-repository';
import {
  QueryBlogsDTO,
  QueryPostsDto,
} from './dto';
import { GetUserInterceptor } from '../auth/interceptors/getUser.interceptor';
import {User} from "../utils/decorators";
import {Users} from "../users/users.schema";

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
    return this.blogsQueryRepository.getAll(query,{ blogOwnerInfo: false });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBlogOnId(@Param('id') id: string) {
    return this.blogsQueryRepository.findById(id,{ blogOwnerInfo: false });
  }

  @Get(':blogId/posts')
  @UseInterceptors(GetUserInterceptor)
  async getPostByBlogIdWithQuery(
    @Param('blogId') id: string,
    @Query() query: QueryPostsDto,
    @User() user: Users,
  ) {
    await this.blogsQueryRepository.findById(id);
    return this.postsQueryRepository.getPostsByBlogId(id, query, user?.id);
  }
}
