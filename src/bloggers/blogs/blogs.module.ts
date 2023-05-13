import {Module} from "@nestjs/common";
import {CqrsModule} from '@nestjs/cqrs';
import {MongooseModule} from "@nestjs/mongoose";
import {
    CreateBlogCommandHandler,
    UpdateBlogCommandHandler,
    DeleteBlogCommandHandler,
    CreatePostForBlogCommandHandler,
    UpdatePostByBlogCommandHandler,
    DeletePostByBlogCommandHandler
} from "./useCase/handlers";
import {BlogsRepository} from "../../public/blogs/repository/blogs.repository";
import {Blogs, BlogsSchema} from "../../public/blogs/entity/blogs.schema";
import {BlogsController} from "./blogs.controller";
import {PaginationService} from "../../applications/pagination.service";
import {BlogsQueryRepository} from "./repository/blogs.query-repository";
import {BloggerBlogsRepository} from "./repository/blogs.repository";
import {PostsModule} from "../../public/posts/posts.module";
import {BlogService} from "./blog.service";

const CommandHandlers = [
    CreateBlogCommandHandler,
    UpdateBlogCommandHandler,
    DeleteBlogCommandHandler,
    CreatePostForBlogCommandHandler,
    UpdatePostByBlogCommandHandler,
    DeletePostByBlogCommandHandler
]

@Module({
    imports: [
        CqrsModule,
        MongooseModule.forFeature([{ name: Blogs.name, schema: BlogsSchema }]),
        PostsModule
    ],
    controllers: [BlogsController],
    providers: [
        ...CommandHandlers,
        BlogService,
        BlogsRepository,
        BlogsQueryRepository,
        BloggerBlogsRepository,
        PaginationService,
    ]
})
export class BloggerBlogModule {}