import {Controller, Get, Param, Put, Query, UseGuards} from "@nestjs/common";
import {CommandBus} from "@nestjs/cqrs";
import {BindBlogByUserCommand} from "./useCase/command";
import {BlogsQueryRepository} from "../../public/blogs/repository/blogs.query-repository";
import {BasicGuard} from "../../public/auth/guards/basic.guard";
import {QueryBlogsDTO} from "../../public/blogs/dto";

@Controller('sa/blogs')
export class SABlogsController {
    constructor(
        private commandBus: CommandBus,
        private blogsQueryRepository: BlogsQueryRepository,
    ) {}
    @UseGuards(BasicGuard)
    @Get()
    async getAll(@Query() query: QueryBlogsDTO) {
        return this.blogsQueryRepository.getAll(query,{"blogOwnerInfo.isBanned": false})
    }

    @UseGuards(BasicGuard)
    @Put(':id/bind-with-user/:userId')
    async bindBlogByUser(
        @Param('id') id: string,
        @Param('userId') userId: string
    ) {
        await this.commandBus.execute(new BindBlogByUserCommand(id, userId))
    }
}