import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './comments.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentsSchema } from './comments.schema';
import { CommentsQueryRepository } from './comments.query-repository';
import { JwtAccessStrategy } from "../auth/strategies/jwt-access.strategy";
import { CommentsLikeModule } from "./like/commentsLike.module";
import { LikeCalculateService } from "../applications/likeCalculate.service";
import { UsersModule } from "../users/users.module";
import { PaginationService } from "../applications/pagination.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Comments.name, schema: CommentsSchema},
    ]),
    CommentsLikeModule,
    UsersModule
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    JwtAccessStrategy,
    LikeCalculateService,
    PaginationService
  ],
  exports: [CommentsService, CommentsQueryRepository],
})
export class CommentsModule {}
