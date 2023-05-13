import {CqrsModule} from "@nestjs/cqrs";
import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {SAUsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {
    CreateUserCommandHandler,
    DeleteUserCommandHandler,
    BanUserCommandHandler
} from "./useCase/handlers";
import {CommandRepository} from "./repository/command.repository";
import {PassHashService} from "../../applications/passHash.service";
import {Users, UsersSchema} from "../../users/entity/users.schema";
import {PaginationService} from "../../applications/pagination.service";
import {BasicStrategy} from "../../public/auth/strategies/basic.strategy";
import {UsersRepository} from "../../users/repo/users.repository";
import {UsersQueryRepository} from "../../users/repo/users.query-repository";
import {SecurityRepository} from "../../public/security/repository/security.repository";
import {Security, SecuritySchema} from "../../public/security/entity/security.schema";
import {Comments, CommentsSchema} from "../../public/comments/entity/comments.schema";
import {CommentsLike, CommentsLikeSchema} from "../../public/comments/like/entity/commentsLike.schema";
import {PostsLike, PostsLikeSchema} from "../../public/posts/like/entity/postsLike.schema";
import {CommentsRepository} from "../../public/comments/repository/comments.repository";
import {PostsRepository} from "../../public/posts/repository/posts.repository";
import {Posts, PostsSchema} from "../../public/posts/entity/posts.schema";
import {LikeCalculateService} from "../../applications/likeCalculate.service";

const CommandHandlers = [CreateUserCommandHandler, DeleteUserCommandHandler, BanUserCommandHandler]
const Repository = [
    UsersRepository,
    UsersQueryRepository,
    SecurityRepository,
    CommentsRepository,
    PostsRepository,
    CommandRepository,
]

@Module({
    imports: [
        CqrsModule,
        MongooseModule.forFeature([
            { name: Users.name, schema: UsersSchema },
            { name: Security.name, schema: SecuritySchema },
            { name: Comments.name, schema: CommentsSchema },
            { name: CommentsLike.name, schema: CommentsLikeSchema },
            { name: Posts.name, schema: PostsSchema },
            { name: PostsLike.name, schema: PostsLikeSchema }
        ]),
    ],
    controllers: [SAUsersController],
    providers: [
        PaginationService,
        PassHashService,
        LikeCalculateService,
        UsersService,
        BasicStrategy,
        ...Repository,
        ...CommandHandlers
    ]
})
export class SAUsersModule {}