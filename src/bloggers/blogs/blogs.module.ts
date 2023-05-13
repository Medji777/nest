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
import {BlogsController} from "./blogs.controller";
import {BlogsQueryRepository} from "./repository/blogs.query-repository";
import {BlogService} from "./blog.service";
import {Blogs, BlogsSchema} from "../../public/blogs/entity/blogs.schema";
import {PaginationService} from "../../applications/pagination.service";
import {PostsModule} from "../../public/posts/posts.module";
import {BlogsModule} from "../../public/blogs/blogs.module";

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
        PostsModule,
        BlogsModule,
    ],
    controllers: [BlogsController],
    providers: [
        ...CommandHandlers,
        BlogService,
        BlogsQueryRepository,
        PaginationService,
    ]
})
export class BloggerBlogModule {}