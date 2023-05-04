import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Users, UsersModelType } from './users.schema';
import { transformPagination } from '../utils/transform';
import { Paginator } from '../types/types';
import { UserViewModel } from '../types/users';
import { QueryUsersDto } from './dto';
import { PaginationService } from '../applications/pagination.service';

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
    private readonly paginationService: PaginationService,
  ) {}
  async getAll(query: QueryUsersDto): Promise<Paginator<UserViewModel>> {
    const arrayFilters = [];
    const { searchLoginTerm, searchEmailTerm, ...restQuery } = query;
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

    const pagination = await this.paginationService.create(
        restQuery,
        this.UserModel,
        projectionFilter,
        filter,
        true
    );

    return transformPagination<UserViewModel>(
      pagination.doc,
      pagination.pageSize,
      pagination.pageNumber,
      pagination.count,
    );
  }
  async getUserByLoginOrEmail(input: string): Promise<Users> {
    const user = this._getUserByLoginOrEmail(input);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  async getIsUniqueUserByLoginOrEmail(input: string): Promise<boolean> {
    const user = this._getUserByLoginOrEmail(input);
    return !user;
  }
  async getIsUniqueUserByLogin(login: string): Promise<boolean> {
    const user = await this.UserModel.findOne({ login }).lean()
    return !user;
  }
  async getIsUniqueUserByEmail(email: string): Promise<boolean> {
    const user = await this.UserModel.findOne({ email }).lean()
    return !user;
  }
  async getUserByUserId(userId: string): Promise<Users | null> {
    return this.UserModel.findOne({ id: userId }).lean();
  }
  private async _getUserByLoginOrEmail(input: string): Promise<Users> {
    return this.UserModel.findOne(
      { $or: [{ login: input }, { email: input }] },
      { _id: 0, __v: 0 },
    ).lean();
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
