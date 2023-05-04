import {Module} from "@nestjs/common";
import {CqrsModule} from '@nestjs/cqrs';
import {
    CreateBlogCommandHandler,
    UpdateBlogCommandHandler,
    DeleteBlogCommandHandler,
    CreatePostForBlogCommandHandler,
    UpdatePostByBlogCommandHandler,
    DeletePostByBlogCommandHandler
} from "./useCase/handlers";
import {MongooseModule} from "@nestjs/mongoose";
import {BlogsRepository} from "../../blogs/blogs.repository";
import {Blogs, BlogsSchema} from "../../blogs/blogs.schema";
import {BlogsController} from "./blogs.controller";
import {PaginationService} from "../../applications/pagination.service";
import {BlogsQueryRepository} from "./blogs.query-repository";
import {PostsModule} from "../../posts/posts.module";
import {BloggerBlogsRepository} from "./blogs.repository";
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