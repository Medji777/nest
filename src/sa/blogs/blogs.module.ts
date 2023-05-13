import {Module} from "@nestjs/common";
import {CqrsModule} from "@nestjs/cqrs";
import {BindBlogByUserCommandHandler} from "./useCase/handler";
import {SABlogsController} from "./blogs.controller";
import {PaginationService} from "../../applications/pagination.service";
import {BlogsModule} from "../../public/blogs/blogs.module";
import {UsersModule} from "../../users/users.module";

@Module({
    imports: [
        CqrsModule,
        BlogsModule,
        UsersModule
    ],
    controllers: [SABlogsController],
    providers: [
        PaginationService,
        BindBlogByUserCommandHandler
    ]
})
export class SABlogsModule {}