import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Users } from '../../users/users.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<{ id: string }> {
    const checkData = await this.usersService.checkCredentials(
      loginOrEmail,
      password,
    );
    if (!checkData.user || !checkData.check) {
      throw new UnauthorizedException();
    }
    if (!checkData.user.emailConfirmation.isConfirmed) {
      throw new UnauthorizedException();
    }
    return checkData.user;
  }
}
