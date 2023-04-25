import { forwardRef, Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { BlogsQueryRepository } from './blogs.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blogs, BlogsSchema } from './blogs.schema';
import { PostsModule } from '../posts/posts.module';
import {BasicStrategy} from "../auth/strategies/basic.strategy";
import {PaginationService} from "../applications/pagination.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blogs.name, schema: BlogsSchema }]),
    forwardRef(() => PostsModule),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    BasicStrategy,
    PaginationService
  ],
  exports: [BlogsService, BlogsQueryRepository],
})
export class BlogsModule {}
