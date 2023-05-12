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
import { CommandBus } from "@nestjs/cqrs";
import { Request } from 'express';
import { SecurityQueryRepository } from './repo/security.query-repository';
import { CheckSessionGuard } from './guards/checkSession.guard';
import { JwtRefreshGuard } from '../auth/guards/jwt-refresh.guard';

import {
  DeleteAllSessionsWithoutCurrentCommand,
  DeleteSessionByDeviceIdCommand
} from "./useCase/command";

@Controller('security')
export class SecurityController {
  constructor(
      private commandBus: CommandBus,
      private readonly securityQueryRepository: SecurityQueryRepository,
  ) {}
  @Get('devices')
  @UseGuards(JwtRefreshGuard)
  async getDevices(@Req() req: Request) {
    return this.securityQueryRepository.getAllActiveSessions(req.user.userId);
  }
  @Delete('devices')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllDevices(@Req() req: Request) {
    await this.commandBus.execute(
        new DeleteAllSessionsWithoutCurrentCommand(
            req.user.userId,
            req.user.deviceId
        )
    )
  }
  @Delete('devices/:deviceId')
  @UseGuards(CheckSessionGuard)
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDeviceById(@Param('deviceId') deviceId: string) {
    await this.commandBus.execute(
        new DeleteSessionByDeviceIdCommand(deviceId)
    )
  }
}
