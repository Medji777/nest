import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Security, SecuritySchema } from './security.schema';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { SecurityRepository } from './security.repository';
import { SecurityQueryRepository } from './security.query-repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from '../auth/strategies/jwt-refresh.stategy';
import { settings } from '../config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Security.name, schema: SecuritySchema },
    ]),
    JwtModule.register({
      secret: settings.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [SecurityController],
  providers: [
    SecurityService,
    SecurityRepository,
    SecurityQueryRepository,
    JwtRefreshStrategy,
  ],
  exports: [SecurityService],
})
export class SecurityModule {}
