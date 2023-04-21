import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs, BlogsModelType } from './blogs.schema';
import { BlogsViewModel } from '../types/blogs';
import { Paginator } from '../types/types';
import { getSortNumber } from '../utils/sort';
import { transformPagination } from '../utils/transform';
import { QueryBlogsDTO } from './dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blogs.name) private BlogsModel: BlogsModelType) {}
  async getAll(query: QueryBlogsDTO): Promise<Paginator<BlogsViewModel>> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
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
    const blog = await this.BlogsModel.findOne(
      { id },
      { _id: 0, __v: 0 },
    ).lean();
    if (!blog) {
      throw new NotFoundException('blog not found');
    }
    return blog;
  }
}
