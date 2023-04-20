import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Users } from './users.schema';
import { getSortNumber } from '../utils/sort';
import { transformPagination } from '../utils/transform';
import { Paginator, SortDirections } from '../types/types';
import { QueryUsers, UserViewModel } from '../types/users';

const projectionFilter = {
  _id: 0,
  passwordHash: 0,
  emailConfirmation: 0,
  passwordConfirmation: 0,
  __v: 0,
};

export class UsersQueryRepository {
  constructor(@InjectModel(Users.name) private UserModel: Model<Users>) {}
  async getAll(query: QueryUsers): Promise<Paginator<UserViewModel>> {
    const arrayFilters = [];
    const {
      searchLoginTerm = null,
      searchEmailTerm = null,
      sortBy,
      sortDirection = SortDirections.desc,
      pageNumber = 1,
      pageSize = 10,
    } = query;
    const sortNumber = getSortNumber(sortDirection);
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
    const skipNumber = (pageNumber - 1) * pageSize;

    const count = await this.UserModel.countDocuments(filter);
    const items = await this.UserModel.find(filter, projectionFilter)
      .sort({ [sortBy]: sortNumber })
      .skip(skipNumber)
      .limit(pageSize)
      .lean();

    return transformPagination<UserViewModel>(
      items,
      pageSize,
      pageNumber,
      count,
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
