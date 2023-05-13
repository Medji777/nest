import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from '@nestjs/jwt';
import {
  DeleteAllSessionsWithoutCurrentCommandHandler,
  DeleteSessionByDeviceIdCommandHandler
} from "./useCase/handler";
import { Security, SecuritySchema } from './entity/security.schema';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { SecurityRepository } from './repository/security.repository';
import { SecurityQueryRepository } from './repository/security.query-repository';
import { JwtRefreshStrategy } from '../auth/strategies/jwt-refresh.stategy';
import { settings } from "../../config";

const CommandHandlers = [
  DeleteAllSessionsWithoutCurrentCommandHandler,
  DeleteSessionByDeviceIdCommandHandler
]

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {name: Security.name, schema: SecuritySchema},
    ]),
    JwtModule.register({
      secret: settings.JWT_SECRET
    }),
  ],
  controllers: [SecurityController],
  providers: [
    SecurityService,
    SecurityRepository,
    SecurityQueryRepository,
    JwtRefreshStrategy,
    ...CommandHandlers
  ],
  exports: [SecurityService, SecurityRepository, SecurityQueryRepository],
})
export class SecurityModule {}
