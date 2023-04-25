import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { Users } from './users.schema';
import {
  EmailConfirmUserModel,
  PasswordConfirmUserModel,
  PasswordHash,
  UserViewModel,
} from '../types/users';
import { UserInputModelDto } from './dto';

type Cred = {
  check: boolean;
  user: Users | null;
};

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create(payload: UserInputModelDto, dto?) {
    const passwordHash = await this._createPasswordHash(payload.password);
    const doc = this.usersRepository.create(
      payload.login,
      payload.email,
      passwordHash,
      dto,
    );
    await this.usersRepository.save(doc);
    return doc;
  }
  async createUser(payload: UserInputModelDto): Promise<UserViewModel> {
    const doc = await this.create(payload);
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
    const user = await this.usersRepository.getUserByUniqueField(input);
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
  async confirmUser(code: string): Promise<void> {
    const user = await this.usersRepository.getUserByUniqueField(code);
    if (!user) {
      throw new BadRequestException();
    }
    user.updateConfirmation();
    await this.usersRepository.save(user);
  }
  async updateConfirmation(id: string): Promise<boolean> {
    const doc = await this.usersRepository.findById(id);
    if (!doc) return false;
    doc.updateConfirmation();
    await this.usersRepository.save(doc);
    return true;
  }
  async updateConfirmationData(
    email: string,
    payload: EmailConfirmUserModel,
  ): Promise<void> {
    const doc = await this.usersRepository.getUserByUniqueField(email);
    if (!doc) {
      throw new BadRequestException();
    }
    doc.updateConfirmationData(payload);
    await this.usersRepository.save(doc);
  }
  async updatePassword(code: string, newPassword: string): Promise<void> {
    const passwordHash = await this._createPasswordHash(newPassword);
    const doc = await this.usersRepository.getUserByUniqueField(code);
    if (!doc) {
      throw new BadRequestException();
    }
    doc.updatePassword({ passwordHash });
    await this.usersRepository.save(doc);
  }
  async updatePasswordConfirmationData(
    email: string,
    payload: PasswordConfirmUserModel,
  ): Promise<void> {
    const doc = await this.usersRepository.getUserByUniqueField(email);
    if (!doc) {
      throw new BadRequestException();
    }
    doc.updatePasswordConfirmationData(payload);
    await this.usersRepository.save(doc);
  }
  private async _createPasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
