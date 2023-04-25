import {Controller, Delete, Get, HttpCode, HttpStatus, Param, Req, UseGuards} from '@nestjs/common';
import {Request} from 'express';
import {SecurityService} from "./security.service";
import {SecurityQueryRepository} from "./security.query-repository";
import {CheckSessionGuard} from "./guards/checkSession.guard";

@Controller('security/devices')
export class SecurityController {
  constructor(
      private readonly securityService: SecurityService,
      private readonly securityQueryRepository: SecurityQueryRepository
      ) {}
  @Get()
  async getDevices(@Req() req: Request) {
    return this.securityQueryRepository.getAllActiveSessions(req.user.id);
  }
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllDevices(@Req() req: Request) {
    await this.securityService.deleteAllSessionsWithoutCurrent(req.user!.id, req.deviceId!);
  }
  @UseGuards(CheckSessionGuard)
  @Delete(':deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDeviceById(@Param('deviceId') deviceId: string) {
    await this.securityService.deleteSessionByDeviceId(deviceId,true)
  }
}
