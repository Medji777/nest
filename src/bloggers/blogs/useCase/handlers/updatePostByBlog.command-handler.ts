import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {NotFoundException} from "@nestjs/common";
import {UpdatePostByBlogCommand} from "../commands";
import {BlogsRepository} from "../../../../blogs/blogs.repository";
import {PostsRepository} from "../../../../posts/posts.repository";
import {BlogService} from "../../blog.service";

@CommandHandler(UpdatePostByBlogCommand)
export class UpdatePostByBlogCommandHandler implements ICommandHandler<UpdatePostByBlogCommand> {
    constructor(
        private postsRepository: PostsRepository,
        private blogRepository: BlogsRepository,
        private blogService: BlogService
    ) {}
    async execute(command: UpdatePostByBlogCommand): Promise<any> {
        const {blogId, postId, userId, bodyDTO} = command;
        await this.blogService.checkExistAndGet(blogId, userId);
        const post = await this.postsRepository.findByIdAndBlogId(postId, blogId);
        if(!post) {
            throw new NotFoundException()
        }
        post.update({...bodyDTO, blogId})
        await this.postsRepository.save(post)
    }
}