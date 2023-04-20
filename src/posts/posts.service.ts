import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import {
  BlogName,
  PostInputModel,
  PostsDBModel,
  PostsViewModel,
} from '../types/posts';
import { LikeInfoModel } from '../types/likes';
import { PostsDocument } from './posts.schema';
import { LikeStatus } from '@type/types';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
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
    const isDeleted = this.postsRepository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException('post not found');
    }
    await this.postsRepository.deleteById(id);
  }
  async deleteAll(): Promise<void> {
    await this.postsRepository.deleteAll();
  }
  private async _updateLikeInPost(
    id: string,
    likesInfo: LikeInfoModel,
  ): Promise<boolean> {
    const doc = await this.postsRepository.findById(id);
    if (!doc) return false;
    doc.updateLikeInPost(likesInfo);
    await this.postsRepository.save(doc);
    return true;
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
