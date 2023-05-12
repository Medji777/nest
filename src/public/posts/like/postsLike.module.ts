import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsLike, PostsLikeSchema } from './entity/postsLike.schema';
import { PostsLikeRepository } from './repo/postsLike.repository';
import { PostsLikeQueryRepository } from './repo/postsLike.query-repository';
import { PostsLikeService } from './postsLike.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PostsLike.name, schema: PostsLikeSchema }]),
  ],
  providers: [PostsLikeService, PostsLikeRepository, PostsLikeQueryRepository],
  exports: [PostsLikeService, PostsLikeRepository, PostsLikeQueryRepository],
})
export class PostsLikeModule {}
