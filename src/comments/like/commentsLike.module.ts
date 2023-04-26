import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsLike, CommentsLikeSchema } from './commentsLike.schema';
import { CommentsLikeService } from './commentsLike.service';
import { CommentsLikeRepository } from './commentsLike.repository';
import { CommentsLikeQueryRepository } from './commentsLike.query-repository';

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
