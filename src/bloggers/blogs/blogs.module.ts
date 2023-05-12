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
import {BlogsRepository} from "../../public/blogs/repo/blogs.repository";
import {Blogs, BlogsSchema} from "../../public/blogs/entity/blogs.schema";
import {BlogsController} from "./blogs.controller";
import {PaginationService} from "../../applications/pagination.service";
import {BlogsQueryRepository} from "./repo/blogs.query-repository";
import {PostsModule} from "../../public/posts/posts.module";
import {BloggerBlogsRepository} from "./repo/blogs.repository";
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