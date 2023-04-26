import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEqual } from 'date-fns';
import { SecurityRepository } from './security.repository';
import { RefreshResponseType } from '../types/security';

@Injectable()
export class SecurityService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly securityRepository: SecurityRepository,
  ) {}
  async createSession(
    refreshToken: string,
    deviceName: string,
    ip: string,
  ): Promise<void> {
    const meta = await this.jwtService.verifyAsync(refreshToken);
    const doc = this.securityRepository.createSession(
      ip,
      deviceName,
      meta.userId,
      meta.deviceId,
      new Date(meta.iat * 1000).toISOString(),
      new Date(meta.exp * 1000).toISOString(),
    );
    await this.securityRepository.save(doc);
  }
  async updateLastActiveDataSession(refreshToken: string): Promise<void> {
    const meta = await this.jwtService.verifyAsync(refreshToken);
    const doc = await this.securityRepository.findSession(
      meta.userId,
      meta.deviceId,
    );
    if (!doc) {
      throw new BadRequestException();
    }
    doc.update(meta);
    await this.securityRepository.save(doc);
  }
  async deleteAllSessionsWithoutCurrent(
    userId: string,
    deviceId: string,
  ): Promise<void> {
    const isDeleted =
      await this.securityRepository.deleteAllSessionsWithoutCurrent(
        userId,
        deviceId,
      );
    if (!isDeleted) {
      throw new BadRequestException();
    }
  }
  async deleteSessionByDeviceId(
    deviceId: string,
    isException: boolean = false,
  ): Promise<boolean> {
    const isDeleted = this.securityRepository.deleteSessionByDeviceId(deviceId);
    if (isException && !isDeleted) {
      throw new NotFoundException();
    }
    return isDeleted;
  }
  async checkRefreshTokenParsed(meta): Promise<RefreshResponseType | null> {
    if (meta?.userId) {
      const lastActiveTokenData = new Date(+meta.iat * 1000);
      const data = await this.securityRepository.findSession(
        meta.userId,
        meta.deviceId,
      );
      if (data && isEqual(lastActiveTokenData, new Date(data.lastActiveDate))) {
        return {
          userId: meta.userId,
          deviceId: meta.deviceId,
        };
      }
    }
    return null;
  }
  async deleteAll(): Promise<void> {
    await this.securityRepository.deleteAll();
  }
}
