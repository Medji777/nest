import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './repository/blogs.repository';
import { BlogsQueryRepository } from './repository/blogs.query-repository';
import { Blogs, BlogsSchema } from './entity/blogs.schema';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../../users/users.module';
import { BasicStrategy } from '../auth/strategies/basic.strategy';
import { PaginationService } from '../../applications/pagination.service';
import { JwtService } from '../../applications/jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blogs.name, schema: BlogsSchema }]),
    forwardRef(() => PostsModule),
    UsersModule,
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    BasicStrategy,
    PaginationService,
    JwtService,
  ],
  exports: [BlogsService, BlogsQueryRepository],
})
export class BlogsModule {}
