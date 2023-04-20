import { Injectable, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { UsersQueryRepository } from './users.query-repository';
import { UserViewModel, UserInputModel } from '../types/users';
import { Users } from './users.schema';

type Cred = {
  check: boolean;
  user: Users | null;
};

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  async createUser(payload: UserInputModel): Promise<UserViewModel> {
    const passwordHash = await this._createPasswordHash(payload.password);
    const doc = this.usersRepository.create(
      payload.login,
      payload.email,
      passwordHash,
    );
    await this.usersRepository.save(doc);
    return {
      id: doc.id,
      login: doc.login,
      email: doc.email,
      createdAt: doc.createdAt,
    };
  }
  async deleteUser(id: string): Promise<void> {
    const isDeleted = await this.usersRepository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException('user not found');
    }
  }
  async deleteAll(): Promise<void> {
    await this.usersRepository.deleteAll();
  }
  async checkCredentials(input: string, password: string): Promise<Cred> {
    const user = await this.usersQueryRepository.getUserByLoginOrEmail(input);
    if (!user) {
      return {
        check: false,
        user: null,
      };
    } else {
      const check = await bcrypt.compare(password, user.passwordHash);
      return {
        check,
        user,
      };
    }
  }
  private async _createPasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
