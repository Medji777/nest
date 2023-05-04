import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {DeletePostByBlogCommand} from "../commands";
import {PostsRepository} from "../../../../posts/posts.repository";
import {BlogsRepository} from "../../../../blogs/blogs.repository";
import {NotFoundException} from "@nestjs/common";
import {BlogService} from "../../blog.service";

@CommandHandler(DeletePostByBlogCommand)
export class DeletePostByBlogCommandHandler implements ICommandHandler<DeletePostByBlogCommand> {
    constructor(
        private postsRepository: PostsRepository,
        private blogRepository: BlogsRepository,
        private blogService: BlogService
    ) {}
    async execute(command: DeletePostByBlogCommand): Promise<any> {
        const {blogId, postId, userId} = command;
        await this.blogService.checkExistAndGet(blogId, userId)
        const post = await this.postsRepository.findByIdAndBlogId(postId, blogId);
        if(!post) {
            throw new NotFoundException()
        }
        post.deleteOne()
        await this.postsRepository.save(post)
    }
}