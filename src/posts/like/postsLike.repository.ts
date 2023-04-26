import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../../types/types';
import {
  PostsLike,
  PostsLikeDocument,
  PostsLikeModelType,
} from './postsLike.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostsLikeRepository {
  constructor(
    @InjectModel(PostsLike.name) private PostsLikeModel: PostsLikeModelType,
  ) {}
  create(
    userId: string,
    postId: string,
    login: string,
    likeStatus: LikeStatus,
  ): PostsLikeDocument {
    return this.PostsLikeModel.make(
      userId,
      postId,
      login,
      likeStatus,
      this.PostsLikeModel,
    );
  }
  async findByUserIdAndPostId(
    userId: string,
    postId: string,
  ): Promise<PostsLikeDocument> {
    return this.PostsLikeModel.findOne({ userId, postId });
  }
  async save(model: PostsLikeDocument): Promise<void> {
    await model.save();
  }
  async deleteAll(): Promise<void> {
    await this.PostsLikeModel.deleteMany({});
  }
}
