import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UsersQueryRepository } from '../users/users.query-repository';
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { JwtAccessGuard } from "./guards/jwt-access.guard";
import { UserInputModelDto } from "../users/dto";
import {
  RegConfirmCodeModelDto,
  RegEmailResendingDto,
  PasswordRecoveryInputModelDto,
  NewPassRecIMDto
} from "./dto";
import {Validate} from "class-validator";
import {CheckUniqueLoginOrEmailValidate} from "../utils/validates";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Req() req: Request,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authData = await this.authService.createAuth({
      userId: req.user.id,
      deviceName: userAgent || 'device',
      ip,
    });
    res.cookie('refreshToken', authData.refreshToken, authData.options);
    return authData.token;
  }

  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.deleteSessionByDeviceId(req.user.deviceId);
    res.clearCookie('refreshToken');
  }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  meProfile(@Req() req: Request) {
    return {
      email: req.user.email,
      login: req.user.login,
      userId: req.user.id,
    };
  }

  @Post('registration')
  @Validate(CheckUniqueLoginOrEmailValidate)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() bodyDTO: UserInputModelDto) {
    await this.authService.saveUser(bodyDTO);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmation(@Body() bodyDTO: RegConfirmCodeModelDto) {
    await this.authService.confirmUser(bodyDTO);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async emailResending(@Body() bodyDTO: RegEmailResendingDto) {
    await this.authService.resendingCode(bodyDTO);
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(
    @Body() bodyDTO: PasswordRecoveryInputModelDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersQueryRepository.getUserByLoginOrEmail(
      bodyDTO.email,
    );
    if (!user) {
      return res.sendStatus(HttpStatus.NO_CONTENT);
    }
    await this.authService.passwordRecovery(bodyDTO.email);
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() bodyDTO: NewPassRecIMDto) {
    await this.authService.confirmRecoveryPassword(bodyDTO);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authData = await this.authService.refreshToken(
      req.user.userId,
      req.user.deviceId,
    );
    res.cookie('refreshToken', authData.refreshToken, authData.options);
    return authData.token;
  }
}
