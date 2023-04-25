import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import {Users, UsersModelType} from './users.schema';
import { transformPagination } from '../utils/transform';
import { Paginator } from '../types/types';
import { UserViewModel } from '../types/users';
import { QueryUsersDto } from './dto';
import {PaginationService} from "../applications/pagination.service";

const projectionFilter = {
  _id: 0,
  passwordHash: 0,
  emailConfirmation: 0,
  passwordConfirmation: 0,
  __v: 0,
};

export class UsersQueryRepository {
  constructor(
      @InjectModel(Users.name) private UserModel: UsersModelType,
      private readonly paginationService: PaginationService
  ) {}
  async getAll(query: QueryUsersDto): Promise<Paginator<UserViewModel>> {
    const arrayFilters = [];
    const {
      searchLoginTerm,
      searchEmailTerm,
      ...restQuery
    } = query;
    if (!!searchLoginTerm) {
      arrayFilters.push({
        login: { $regex: new RegExp(searchLoginTerm, 'gi') },
      });
    }
    if (!!searchEmailTerm) {
      arrayFilters.push({
        email: { $regex: new RegExp(searchEmailTerm, 'gi') },
      });
    }
    const filter = !arrayFilters.length ? {} : { $or: arrayFilters };

    const pagination = await this.paginationService.createLean(restQuery,this.UserModel,projectionFilter,filter)

    return transformPagination<UserViewModel>(
        pagination.doc,
        pagination.pageSize,
        pagination.pageNumber,
        pagination.count,
    );
  }
  async getUserByLoginOrEmail(input: string): Promise<Users> {
    const user = await this.UserModel.findOne(
      { $or: [{ login: input }, { email: input }] },
      { _id: 0, __v: 0 },
    ).lean();
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  async getUserByUserId(userId: string): Promise<Users | null> {
    return this.UserModel.findOne({ id: userId }).lean();
  }
  async getUserByCode(code: string): Promise<Users | null> {
    return this.UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    }).lean();
  }
  async getUserByRecoveryCode(code: string): Promise<Users | null> {
    return this.UserModel.findOne({
      'passwordConfirmation.confirmationCode': code,
    }).lean();
  }
}
