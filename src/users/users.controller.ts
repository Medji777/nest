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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersQueryRepository } from './users.query-repository';
import { QueryUsersDto, UserInputModelDto } from './dto';
import { BasicGuard } from '../auth/guards/basic.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  @Get()
  @UseGuards(BasicGuard)
  @HttpCode(HttpStatus.OK)
  async getUsers(@Query() query: QueryUsersDto) {
    return this.usersQueryRepository.getAll(query);
  }

  @Post()
  @UseGuards(BasicGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() bodyDTO: UserInputModelDto) {
    return this.usersService.createUser(bodyDTO);
  }

  @Delete(':id')
  @UseGuards(BasicGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
  }

  @Get('tests')
  @UseGuards(BasicGuard)
  @HttpCode(HttpStatus.OK)
  async getTest(@Body('email') email: string) {
    return this.usersQueryRepository.getUserByLoginOrEmail(email);
  }
}
