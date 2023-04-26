import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsLike, PostsLikeSchema } from './postsLike.schema';
import { PostsLikeRepository } from './postsLike.repository';
import { PostsLikeQueryRepository } from './postsLike.query-repository';
import { PostsLikeService } from './postsLike.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostsLike.name, schema: PostsLikeSchema },
    ]),
  ],
  providers: [PostsLikeService, PostsLikeRepository, PostsLikeQueryRepository],
  exports: [PostsLikeService, PostsLikeQueryRepository],
})
export class PostsLikeModule {}
