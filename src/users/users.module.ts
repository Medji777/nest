import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './repository/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './entity/users.schema';
import { UsersQueryRepository } from './repository/users.query-repository';
import { PaginationService } from '../applications/pagination.service';
import { PassHashService } from '../applications/passHash.service';
import { BasicStrategy } from '../public/auth/strategies/basic.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    PaginationService,
    PassHashService,
    BasicStrategy,
  ],
  exports: [UsersService, UsersQueryRepository],
})
export class UsersModule {}
