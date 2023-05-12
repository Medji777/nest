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
import {CommandRepository} from "./repo/command.repository";
import {PassHashService} from "../../applications/passHash.service";
import {Users, UsersSchema} from "../../users/users.schema";
import {PaginationService} from "../../applications/pagination.service";
import {BasicStrategy} from "../../auth/strategies/basic.strategy";
import {UsersRepository} from "../../users/users.repository";
import {UsersQueryRepository} from "../../users/users.query-repository";
import {SecurityRepository} from "../../security/security.repository";
import {Security, SecuritySchema} from "../../security/security.schema";
import {Comments, CommentsSchema} from "../../comments/comments.schema";
import {CommentsLike, CommentsLikeSchema} from "../../comments/like/commentsLike.schema";
import {PostsLike, PostsLikeSchema} from "../../posts/like/postsLike.schema";
import {CommentsRepository} from "../../comments/comments.repository";
import {PostsRepository} from "../../posts/posts.repository";
import {Posts, PostsSchema} from "../../posts/posts.schema";
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