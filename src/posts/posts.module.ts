import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostsSchema } from './posts.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PostsQueryRepository } from './posts.query-repository';
import { BlogsModule } from '../blogs/blogs.module';
import { CommentsModule } from '../comments/comments.module';
import { JwtAccessStrategy } from '../auth/strategies/jwt-access.strategy';
import { PostsLikeModule } from './like/postsLike.module';
import { LikeCalculateService } from '../applications/likeCalculate.service';
import { UsersModule } from '../users/users.module';
import { JwtService } from '../applications/jwt.service';
import { PaginationService } from '../applications/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
    forwardRef(() => BlogsModule),
    CommentsModule,
    PostsLikeModule,
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    JwtAccessStrategy,
    LikeCalculateService,
    JwtService,
    PaginationService,
  ],
  exports: [PostsService, PostsQueryRepository],
})
export class PostsModule {}
