import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {NotFoundException} from "@nestjs/common";
import {HydratedDocument} from "mongoose";
import {BanUserCommand} from "../command";
import {UsersRepository} from "../../../../users/users.repository";
import {SecurityRepository} from "../../../../security/security.repository";
import {CommandRepository} from "../../repo/command.repository";
import {CommentsRepository} from "../../../../comments/comments.repository";
import {PostsRepository} from "../../../../posts/posts.repository";
import {LikeCalculateService} from "../../../../applications/likeCalculate.service";

@CommandHandler(BanUserCommand)
export class BanUserCommandHandler implements ICommandHandler<BanUserCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private securityRepository: SecurityRepository,
        private commandRepository: CommandRepository,
        private commentsRepository: CommentsRepository,
        private postsRepository: PostsRepository,
        private likeCalculate: LikeCalculateService
    ) {}
    async execute(command: BanUserCommand): Promise<any> {
        const {userId, bodyDTO} = command;

        const commentLikes = await this.commandRepository.findLikeCommentsByUserId(userId)
        const postLikes = await this.commandRepository.findLikePostsByUserId(userId)

        await Promise.all([
            this.ban(userId, bodyDTO),
            this.killAllSessionsUser(userId),
            this.banUserAtComments(userId, bodyDTO.isBanned),
            this.banUserAtCommentLikes(userId, bodyDTO.isBanned),
            this.banUserAtPostLikes(userId, bodyDTO.isBanned),
            this.changeCountLikes(commentLikes,bodyDTO.isBanned,this.commentsRepository,'commentId'),
            this.changeCountLikes(postLikes,bodyDTO.isBanned,this.postsRepository,'postId')
        ])
    }

    private async ban(userId: string, bodyDTO): Promise<void> {
        const user = await this.usersRepository.findById(userId);
        if(!user){
            throw new NotFoundException()
        }
        user.updateBan(bodyDTO)
        await this.usersRepository.save(user)
    }
    private async killAllSessionsUser(userId: string): Promise<void> {
        await this.securityRepository.deleteAllByUserId(userId)
    }
    private async banUserAtComments(userId: string, isBanned: boolean): Promise<void> {
        await this.commandRepository.updateAllBanInfoUserAtComments(userId, isBanned)
    }
    private async banUserAtCommentLikes(userId: string, isBanned: boolean): Promise<void> {
        await this.commandRepository.updateAllBanInfoUserAtCommentsLike(userId, isBanned)
    }
    private async banUserAtPostLikes(userId: string, isBanned: boolean): Promise<void> {
        await this.commandRepository.updateAllBanInfoUserAtPostsLike(userId, isBanned)
    }
    private async changeCountLikes<M extends HydratedDocument<any>[],R>(
        modelLikes: M,
        isBanned: boolean,
        repo: R | any,
        prop: 'commentId' | 'postId',
    ): Promise<void> {
        for (let i = 0; i < modelLikes.length; i++) {
            const model = await repo.findById(modelLikes[i][prop]);
            const statusLike = modelLikes[i].myStatus;
            model.updateLikesCount(statusLike, isBanned, this.likeCalculate.updateLikesBanCount);
            await repo.save(model);
        }
    }
}