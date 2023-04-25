import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { settings } from '../config';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { SecurityModule } from '../security/security.module';
import { EmailAdapter } from '../adapters/email.adapter';
import { ActiveCodeAdapter } from '../adapters/activeCode.adapter';
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.stategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    SecurityModule,
    JwtModule.register({
      secret: settings.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    EmailAdapter,
    ActiveCodeAdapter,
  ],
  exports: [AuthService],
})
export class AuthModule {}
