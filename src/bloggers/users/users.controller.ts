import {Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Query, UseGuards} from "@nestjs/common";
import {BanUnbanInputDto, QueryUsersDto} from "./dto";
import {JwtAccessGuard} from "../../public/auth/guards/jwt-access.guard";
import {User} from "../../utils/decorators";
import {Users} from "../../users/entity/users.schema";

@Controller('bloggers/users')
export class BloggerUsersController {
    @UseGuards(JwtAccessGuard)
    @Get('blog/:id')
    @HttpCode(HttpStatus.OK)
    async getAllBannedUsersForBlog(
        @Query() queryDTO: QueryUsersDto,
        @Param('id') id: string,
        @User() user: Users
    ) {

    }

    @UseGuards(JwtAccessGuard)
    @Put(':id/ban')
    @HttpCode(HttpStatus.NO_CONTENT)
    async banUnbanFlow(
        @Param('id') id: string,
        @Body() bodyDTO: BanUnbanInputDto,
        @User() user: Users
    ) {

    }
}