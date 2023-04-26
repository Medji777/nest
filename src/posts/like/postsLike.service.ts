import {Injectable, NotFoundException} from "@nestjs/common";
import {PostsLikeRepository} from "./postsLike.repository";
import {PostsLikeDocument} from "./postsLike.schema";
import {LikeStatus} from "../../types/types";

@Injectable()
export class PostsLikeService {
    constructor(private readonly postsLikeRepository: PostsLikeRepository) {}
    async create(userId: string, postId: string, login: string, likeStatus: LikeStatus): Promise<PostsLikeDocument> {
        const doc = this.postsLikeRepository.create(
            userId,
            postId,
            login,
            likeStatus
        )
        await this.postsLikeRepository.save(doc)
        return doc
    }
    async update(userId: string, postId: string, myStatus: LikeStatus): Promise<void> {
        const like = await this.postsLikeRepository.findByUserIdAndPostId(userId,postId)
        if(!like) {
            throw new NotFoundException()
        }
        like.myStatus = myStatus
        await this.postsLikeRepository.save(like)
    }
    async deleteAll(): Promise<void> {
        await this.postsLikeRepository.deleteAll()
    }
}