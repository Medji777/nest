import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs, BlogsModelType } from './blogs.schema';
import { BlogsViewModel, QueryBlogs } from '../types/blogs';
import {Paginator, SortDirections} from '../types/types';
import { getSortNumber } from '../utils/sort';
import { transformPagination } from '../utils/transform';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blogs.name) private BlogsModel: BlogsModelType) {}
  async getAll(query: QueryBlogs): Promise<Paginator<BlogsViewModel>> {
    const { searchNameTerm = null, sortBy, sortDirection = SortDirections.desc, pageNumber = 1, pageSize = 10 } =
      query;
    const sortNumber = getSortNumber(sortDirection);
    const filter = !searchNameTerm
      ? {}
      : { name: { $regex: new RegExp(searchNameTerm, 'gi') } };
    const skipNumber = (pageNumber - 1) * pageSize;
    const count = await this.BlogsModel.countDocuments(filter);
    const data = await this.BlogsModel.find(filter, { _id: 0, __v: 0 })
      .sort({ [sortBy]: sortNumber })
      .skip(skipNumber)
      .limit(pageSize)
      .lean();
    return transformPagination<BlogsViewModel>(
      data,
      pageSize,
      pageNumber,
      count,
    );
  }
  async findById(id: string): Promise<BlogsViewModel> {
    const blog = await this.BlogsModel.findOne({ id }, { _id: 0, __v: 0 }).lean();
    if (!blog) {
      throw new NotFoundException('blog not found');
    }
    return blog;
  }
}
