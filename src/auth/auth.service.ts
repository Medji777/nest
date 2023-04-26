import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SecurityService } from '../security/security.service';
import { UsersService } from '../users/users.service';
import { EmailAdapter } from '../adapters/email.adapter';
import { ActiveCodeAdapter } from '../adapters/activeCode.adapter';
import {
  NewPasswordRecoveryInputModel,
  RegistrationConfirmationCodeModel,
  RegistrationEmailResending,
  TokenPayload,
} from '../types/auth';
import { UserInputModel } from '../types/users';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly securityService: SecurityService,
    private readonly usersService: UsersService,
    private readonly emailAdapter: EmailAdapter,
    private readonly activeCodeAdapter: ActiveCodeAdapter,
  ) {}
  async createAuth(payload: any): Promise<TokenPayload> {
    const deviceId = this.activeCodeAdapter.generateId();
    const accessToken = await this.jwtService.signAsync(
      { userId: payload.id },
      { expiresIn: '1h' },
    );
    const refreshToken = await this.jwtService.signAsync(
      { userId: payload.id, deviceId },
      { expiresIn: '1d' },
    );
    await this.securityService.createSession(
      refreshToken,
      payload.deviceName,
      payload.ip,
    );
    return {
      token: {
        accessToken,
      },
      refreshToken,
      options: {
        httpOnly: true,
        secure: true,
      },
    };
  }
  async saveUser(payload: UserInputModel) {
    const emailConfirmation = this.activeCodeAdapter.createCode();
    const newUser = await this.usersService.create(payload, {
      emailConfirmation,
    });
    try {
      await this.emailAdapter.sendCodeConfirmationMessage(
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        'confirm-email',
      );
    } catch (err) {
      console.log(err);
      await this.usersService.deleteUser(newUser.id);
    }
  }
  async confirmUser(payload: RegistrationConfirmationCodeModel): Promise<void> {
    await this.usersService.confirmUser(payload.code);
  }
  async resendingCode(dto: RegistrationEmailResending): Promise<void> {
    const emailConfirmation = this.activeCodeAdapter.createCode();
    await this.usersService.updateConfirmationData(
      dto.email,
      emailConfirmation,
    );
  }
  async passwordRecovery(email: string): Promise<void> {
    const passwordConfirmation = this.activeCodeAdapter.createCode();
    await this.usersService.updatePasswordConfirmationData(
      email,
      passwordConfirmation,
    );
    try {
      await this.emailAdapter.sendRecoveryCodeConfirmationMessage(
        email,
        passwordConfirmation.confirmationCode,
        'password-recovery',
      );
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }
  async confirmRecoveryPassword(
    payload: NewPasswordRecoveryInputModel,
  ): Promise<void> {
    await this.usersService.updatePassword(
      payload.recoveryCode,
      payload.newPassword,
    );
  }
  async deleteSessionByDeviceId(deviceId: string): Promise<void> {
    const isDeleted = await this.securityService.deleteSessionByDeviceId(
      deviceId,
    );
    if (!isDeleted) {
      throw new BadRequestException();
    }
  }
  async refreshToken(userId: string, deviceId: string): Promise<TokenPayload> {
    const accessToken = await this.jwtService.signAsync(
      { userId },
      { expiresIn: '1h' },
    );
    const refreshToken = await this.jwtService.signAsync(
      { userId, deviceId },
      { expiresIn: '1d' },
    );
    await this.securityService.updateLastActiveDataSession(refreshToken);
    return {
      token: {
        accessToken,
      },
      refreshToken,
      options: {
        httpOnly: true,
        secure: true,
      },
    };
  }
}
