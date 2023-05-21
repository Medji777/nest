import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {NotFoundException} from "@nestjs/common";
import {BanBlogCommand} from "../command";
import {BlogsRepository} from "../../../../public/blogs/repository/blogs.repository";
import {PostsRepository} from "../../../../public/posts/repository/posts.repository";

@CommandHandler(BanBlogCommand)
export class BanBlogCommandHandler implements ICommandHandler<BanBlogCommand> {
    constructor(
        private blogsRepository: BlogsRepository,
        private postsRepository: PostsRepository
    ) {}
    async execute(command: BanBlogCommand): Promise<any> {
        const {blogId, bodyDTO} = command;

        const blog = await this.blogsRepository.findById(blogId)
        if(!blog){
            throw new NotFoundException()
        }

        blog.updateBan(bodyDTO.isBanned)
        await this.blogsRepository.save(blog)
        await this.postsRepository.updateBanStatusAllPostByBlogId(blogId,bodyDTO.isBanned)
    }
}