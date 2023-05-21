import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {NotFoundException} from "@nestjs/common";
import {CreateCommentByPostCommand} from "../command";
import {PostsRepository} from "../../repository/posts.repository";
import {CommentsService} from "../../../comments/comments.service";
import {CommentDBModel} from "../../../../types/comments";

@CommandHandler(CreateCommentByPostCommand)
export class CreateCommentByPostCommandHandler implements ICommandHandler<CreateCommentByPostCommand> {
    constructor(
        private readonly postsRepository: PostsRepository,
        private readonly commentsService: CommentsService,
    ) {}
    async execute(command: CreateCommentByPostCommand): Promise<CommentDBModel> {
        const {userId, userLogin, postId, bodyDTO} = command;

        const post = await this.postsRepository.findById(postId);
        if (!post) {
            throw new NotFoundException('post not found');
        }

        return this.commentsService.create({
            ...bodyDTO,
            postId: post.id,
            userId: userId,
            userLogin: userLogin,
            bloggerId: post.postOwnerInfo.userId
        })
    }
}