import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs, BlogsModelType } from './blogs.schema';
import { BlogsViewModel } from '../types/blogs';
import { Paginator } from '../types/types';
import { getSortNumber } from '../utils/sort';
import { transformPagination } from '../utils/transform';
import { QueryBlogsDTO } from './dto';
import {PaginationService} from "../applications/pagination.service";

const projection = { _id: 0, __v: 0 }

@Injectable()
export class BlogsQueryRepository {
  constructor(
      @InjectModel(Blogs.name) private BlogsModel: BlogsModelType,
      private readonly paginationService: PaginationService
  ) {}
  async getAll(query: QueryBlogsDTO): Promise<Paginator<BlogsViewModel>> {
    const { searchNameTerm, ...restQuery } = query;
    const filter = !searchNameTerm ? {} : { name: { $regex: new RegExp(searchNameTerm, 'gi') } };
    const pagination = await this.paginationService.createLean(restQuery,this.BlogsModel,projection,filter)
    return transformPagination<BlogsViewModel>(
        pagination.doc,
        pagination.pageSize,
        pagination.pageNumber,
        pagination.count,
    );
  }
  async findById(id: string): Promise<BlogsViewModel> {
    const blog = await this.BlogsModel.findOne({ id }, projection,).lean();
    if (!blog) {
      throw new NotFoundException('blog not found');
    }
    return blog;
  }
}
