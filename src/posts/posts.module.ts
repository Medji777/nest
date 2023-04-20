import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostsSchema } from './posts.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PostsQueryRepository } from './posts.query-repository';
// import { CommentsService } from '../comments/comments.service';
// import { BlogsQueryRepository } from '../blogs/blogs.query-repository';
// import { CommentsQueryRepository } from '../comments/comments.query-repository';
// import { CommentsRepository } from '../comments/comments.repository';
import { BlogsModule } from '../blogs/blogs.module';
import { CommentsModule } from '../comments/comments.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
    forwardRef(() => BlogsModule),
    forwardRef(() => CommentsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    // CommentsService,
    // BlogsQueryRepository,
    // CommentsRepository,
    // CommentsQueryRepository,
  ],
  exports: [PostsService],
})
export class PostsModule {}
