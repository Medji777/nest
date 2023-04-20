import {
  Body,
  Controller,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersQueryRepository } from './users.query-repository';
import {
  QueryUsers as QueryUsersDto,
  UserInputModel as UserInputDto,
} from '../types/users';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(@Query() query: QueryUsersDto) {
    return this.usersQueryRepository.getAll(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() bodyDTO: UserInputDto) {
    return this.usersService.createUser(bodyDTO);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
  }

  @Get('tests')
  @HttpCode(HttpStatus.OK)
  async getTest(@Body('email') email: string) {
    return this.usersQueryRepository.getUserByLoginOrEmail(email);
  }
}
