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
import {PaginationService} from "../../applications/pagination.service";
import {BasicStrategy} from "../../public/auth/strategies/basic.strategy";
import {Comments, CommentsSchema} from "../../public/comments/entity/comments.schema";
import {CommentsLike, CommentsLikeSchema} from "../../public/comments/like/entity/commentsLike.schema";
import {PostsLike, PostsLikeSchema} from "../../public/posts/like/entity/postsLike.schema";
import {LikeCalculateService} from "../../applications/likeCalculate.service";
import {UsersModule} from "../../users/users.module";
import {SecurityModule} from "../../public/security/security.module";
import {CommentsModule} from "../../public/comments/comments.module";
import {PostsModule} from "../../public/posts/posts.module";

const CommandHandlers = [
    CreateUserCommandHandler,
    DeleteUserCommandHandler,
    BanUserCommandHandler
]

@Module({
    imports: [
        CqrsModule,
        UsersModule,
        SecurityModule,
        CommentsModule,
        PostsModule,
        MongooseModule.forFeature([
            { name: Comments.name, schema: CommentsSchema },
            { name: CommentsLike.name, schema: CommentsLikeSchema },
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
        CommandRepository,
        ...CommandHandlers
    ]
})
export class SAUsersModule {}