import {Module} from "@nestjs/common";
import {SABlogsController} from "./blogs.controller";
import {CqrsModule} from "@nestjs/cqrs";
import {MongooseModule} from "@nestjs/mongoose";
import {Blogs, BlogsSchema} from "../../public/blogs/entity/blogs.schema";
import {PaginationService} from "../../applications/pagination.service";
import {BindBlogByUserCommandHandler} from "./useCase/handler";
import {BlogsRepository} from "../../public/blogs/repo/blogs.repository";
import {UsersRepository} from "../../users/repo/users.repository";
import {Users, UsersSchema} from "../../users/entity/users.schema";
import {BlogsQueryRepository} from "../../public/blogs/repo/blogs.query-repository";

const CommandHandlers = [BindBlogByUserCommandHandler]
const Repository = [BlogsRepository, UsersRepository, BlogsQueryRepository]

@Module({
    imports: [
        CqrsModule,
        MongooseModule.forFeature([
            { name: Blogs.name, schema: BlogsSchema },
            { name: Users.name, schema: UsersSchema}
        ])
    ],
    controllers: [SABlogsController],
    providers: [
        PaginationService,
        ...Repository,
        ...CommandHandlers
    ]
})
export class SABlogsModule {}