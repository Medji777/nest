import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards} from "@nestjs/common";
import {CommandBus} from "@nestjs/cqrs";
import {BanUserCommand, CreateUserCommand, DeleteUserCommand} from "./useCase/command";
import {UsersService} from "./users.service";
import {BasicGuard} from "../../public/auth/guards/basic.guard";
import {UsersQueryRepository} from "../../users/repository/users.query-repository";
import {QueryUsersDto, UserInputModelDto} from "../../users/dto";
import {BanInputDto} from "./dto";

@Controller('sa/users')
export class SAUsersController {
    constructor(
        private commandBus: CommandBus,
        private usersService: UsersService,
        private usersQueryRepository: UsersQueryRepository
    ) {}

    @UseGuards(BasicGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllUsers(@Query() queryDTO: QueryUsersDto ) {
        return this.usersQueryRepository.getAll(queryDTO)
    }

    @UseGuards(BasicGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() bodyDTO: UserInputModelDto) {
        const model = await this.commandBus.execute(new CreateUserCommand(bodyDTO))
        return this.usersService.createUserMapped(model)
    }

    @UseGuards(BasicGuard)
    @Put(':id/ban')
    @HttpCode(HttpStatus.NO_CONTENT)
    async banUnbanFlow(
        @Param('id') id: string,
        @Body() bodyDTO: BanInputDto
    ) {
       await this.commandBus.execute(new BanUserCommand(id, bodyDTO))
    }

    @UseGuards(BasicGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('id') id: string) {
        await this.commandBus.execute(new DeleteUserCommand(id))
    }
}