import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogDocument, Blogs, BlogsModelType } from './blogs.schema';
import { BlogsViewModel } from '../types/blogs';
import { Paginator } from '../types/types';
import { QueryBlogsDTO } from './dto';
import { PaginationService } from '../applications/pagination.service';

const projection = { _id: 0, __v: 0 };

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blogs.name) private BlogsModel: BlogsModelType,
    private readonly paginationService: PaginationService,
  ) {}
  async getAll(query: QueryBlogsDTO, proj = {}): Promise<Paginator<BlogsViewModel>> {
    const { searchNameTerm, ...restQuery } = query;
    let filter = {};
    if(searchNameTerm) {
      filter = { name: { $regex: new RegExp(searchNameTerm, 'gi') } }
    }
    const pagination = await this.paginationService.create<BlogsModelType,BlogDocument>(
        restQuery,
        this.BlogsModel,
        {...projection, ...proj},
        filter,
        true
    );
    return this.paginationService.transformPagination<BlogsViewModel,BlogDocument>(pagination);
  }
  async findById(id: string, proj = {}): Promise<BlogsViewModel> {
    const blog = await this.BlogsModel.findOne({ id }, {...projection, ...proj}).lean();
    if (!blog) {
      throw new NotFoundException('blog not found');
    }
    return blog;
  }
}
