import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsLike, CommentsLikeSchema } from './entity/commentsLike.schema';
import { CommentsLikeService } from './commentsLike.service';
import { CommentsLikeRepository } from './repo/commentsLike.repository';
import { CommentsLikeQueryRepository } from './repo/commentsLike.query-repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommentsLike.name, schema: CommentsLikeSchema },
    ]),
  ],
  providers: [
    CommentsLikeService,
    CommentsLikeRepository,
    CommentsLikeQueryRepository,
  ],
  exports: [CommentsLikeService, CommentsLikeQueryRepository],
})
export class CommentsLikeModule {}
