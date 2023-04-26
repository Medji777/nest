import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './users.schema';
import { PassHashService } from '../applications/passHash.service';
import {
  EmailConfirmUserModel,
  PasswordConfirmUserModel,
  UserViewModel,
} from '../types/users';
import { UserInputModelDto } from './dto';
import { ErrorResponse } from '../types/types';

type Cred = {
  check: boolean;
  user: Users | null;
};

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passHashService: PassHashService,
  ) {}
  async create(payload: UserInputModelDto, dto?) {
    const passwordHash = await this.passHashService.create(payload.password);
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

  async checkConfirmCode(code: string): Promise<ErrorResponse> {
    const user = await this.usersRepository.getUserByUniqueField(code);
    if (!user) {
      return {
        check: false,
        message: "user with this code don't exist in the DB",
      };
    }
    const resp = await user.checkValidCode();
    if (!resp.check && resp.code === 'confirm') {
      return {
        check: resp.check,
        message: 'email is already confirmed',
      };
    }
    if (!resp.check && resp.code === 'expired') {
      return {
        check: resp.check,
        message: 'code expired',
      };
    }
    return { check: true };
  }
  async checkRegEmail(email: string): Promise<ErrorResponse> {
    const user = await this.usersRepository.getUserByUniqueField(email);
    if (!user) {
      return {
        check: false,
        message: "user with this code don't exist in the DB",
      };
    }
    const resp = await user.checkValidCode(true);
    if (!resp.check && resp.code === 'confirm') {
      return {
        check: resp.check,
        message: 'email is already confirmed',
      };
    }
    return { check: true };
  }
  async checkRecoveryCode(code: string): Promise<ErrorResponse> {
    const user = await this.usersRepository.getUserByUniqueField(code);
    if (!user) {
      return {
        check: false,
        message: "user with this code don't exist in the DB",
      };
    }
    const resp = await user.checkValidRecoveryCode();
    if (!resp.check && resp.code === 'expired') {
      return {
        check: resp.check,
        message: 'code expired',
      };
    }
    return { check: true };
  }

  async checkCredentials(input: string, password: string): Promise<Cred> {
    const user = await this.usersRepository.getUserByUniqueField(input);
    if (!user) {
      return {
        check: false,
        user: null,
      };
    } else {
      const check = await this.passHashService.validate(
        password,
        user.passwordHash,
      );
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
    const passwordHash = await this.passHashService.create(newPassword);
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
}
