import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { SecurityService } from './security.service';
import { SecurityQueryRepository } from './security.query-repository';
import { CheckSessionGuard } from './guards/checkSession.guard';
import { JwtRefreshGuard } from '../auth/guards/jwt-refresh.guard';

@Controller('security')
export class SecurityController {
  constructor(
    private readonly securityService: SecurityService,
    private readonly securityQueryRepository: SecurityQueryRepository,
  ) {}
  @Get('devices')
  @UseGuards(JwtRefreshGuard)
  async getDevices(@Req() req: Request) {
    return this.securityQueryRepository.getAllActiveSessions(req.user.id);
  }
  @Delete('devices')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllDevices(@Req() req: Request) {
    await this.securityService.deleteAllSessionsWithoutCurrent(
      req.user!.id,
      req.deviceId!,
    );
  }
  @Delete('devices/:deviceId')
  @UseGuards(CheckSessionGuard)
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDeviceById(@Param('deviceId') deviceId: string) {
    await this.securityService.deleteSessionByDeviceId(deviceId, true);
  }
}
