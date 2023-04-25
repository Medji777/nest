import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './users.schema';
import { UsersQueryRepository } from './users.query-repository';
import { PaginationService } from "../applications/pagination.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository, PaginationService],
  exports: [UsersService, UsersQueryRepository],
})
export class UsersModule {}
