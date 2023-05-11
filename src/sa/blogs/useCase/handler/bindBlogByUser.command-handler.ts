import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BadRequestException} from "@nestjs/common";
import {BindBlogByUserCommand} from "../command";
import {BlogsRepository} from "../../../../blogs/blogs.repository";
import {UsersRepository} from "../../../../users/users.repository";

@CommandHandler(BindBlogByUserCommand)
export class BindBlogByUserCommandHandler implements ICommandHandler<BindBlogByUserCommand> {
    constructor(
        private blogsRepository: BlogsRepository,
        private usersRepository: UsersRepository
    ) {}
    async execute(command: BindBlogByUserCommand): Promise<void> {
        const {blogId, userId} = command;

        const blog = await this.blogsRepository.findById(blogId);
        const user = await this.usersRepository.findById(userId);
        if(!blog || !user) {
            throw new BadRequestException('Request not corrected')
        }
        if(blog.checkBindUser()) {
            throw new BadRequestException('Request not corrected')
        }
        blog.updateBindUser(command.userId)
        await this.blogsRepository.save(blog);
    }
}