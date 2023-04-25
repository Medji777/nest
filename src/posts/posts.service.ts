import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import {
  BlogName,
  PostInputModel,
  PostsDBModel,
  PostsViewModel,
} from '../types/posts';
import {LikeInfoModel, LikeInputModel} from '../types/likes';
import { PostsDocument } from './posts.schema';
import { LikeStatus } from '../types/types';
import {PostsLikeService} from "./like/postsLike.service";
import {PostsLikeQueryRepository} from "./like/postsLike.query-repository";
import {LikeCalculateService} from "../applications/likeCalculate.service";

@Injectable()
export class PostsService {
  constructor(
      private readonly postsRepository: PostsRepository,
      private readonly postsLikeService: PostsLikeService,
      private readonly postsLikeQueryRepository: PostsLikeQueryRepository,
      private readonly likeCalculateService: LikeCalculateService
  ) {}
  async create(payload: PostInputModel & BlogName): Promise<PostsViewModel> {
    const createPost = this.postsRepository.create(
      payload.title,
      payload.shortDescription,
      payload.content,
      payload.blogId,
      payload.blogName,
    );
    await this.postsRepository.save(createPost);
    return this._likeCreateTransform(this._mappedPostModel(createPost));
  }
  async update(id: string, payload: PostInputModel): Promise<void> {
    const doc = await this.postsRepository.findById(id);
    if (!doc) {
      throw new NotFoundException('post not found');
    }
    doc.update(payload);
    await this.postsRepository.save(doc);
  }
  async delete(id: string): Promise<void> {
    const isDeleted = await this.postsRepository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException('post not found');
    }
    await this.postsRepository.deleteById(id);
  }
  async deleteAll(): Promise<void> {
    await this.postsRepository.deleteAll();
  }
  async updateStatusLike(userId: string, login: string, postId: string, newStatus: LikeInputModel ): Promise<void> {
    let lastStatus: LikeStatus = LikeStatus.None
    const post = await this.postsRepository.findById(postId)
    if (!post) {
      throw new NotFoundException()
    }
    const likeInfo = await this.postsLikeQueryRepository.getLike(userId, postId)
    if (!likeInfo) {
      await this.postsLikeService.create(userId, postId, login, newStatus.likeStatus)
    } else {
      await this.postsLikeService.update(userId, postId, newStatus.likeStatus)
      lastStatus = likeInfo.myStatus
    }
    const newLikesInfo = await this.likeCalculateService.getUpdatedLike(
        {
          likesCount: post.extendedLikesInfo.likesCount,
          dislikesCount: post.extendedLikesInfo.dislikesCount
        },
        lastStatus,
        newStatus.likeStatus
    )
    await this._updateLikeInPost(post.id, newLikesInfo)
  }

  private async _updateLikeInPost(id: string, likesInfo: LikeInfoModel): Promise<void> {
    const doc = await this.postsRepository.findById(id);
    if (!doc) {
      throw new NotFoundException()
    }
    doc.updateLikeInPost(likesInfo);
    await this.postsRepository.save(doc);
  }
  private _likeCreateTransform(post: PostsDBModel): PostsViewModel {
    return {
      ...post,
      extendedLikesInfo: {
        ...post.extendedLikesInfo,
        myStatus: LikeStatus.None,
        newestLikes: [],
      },
    };
  }
  private _mappedPostModel(model: PostsDocument): PostsDBModel {
    return {
      id: model.id,
      title: model.title,
      shortDescription: model.shortDescription,
      content: model.content,
      blogId: model.blogId,
      blogName: model.blogName,
      createdAt: model.createdAt,
      extendedLikesInfo: model.extendedLikesInfo,
    };
  }
}
