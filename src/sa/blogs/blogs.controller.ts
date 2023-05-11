import {Controller, Get, Param, Put, Query, UseGuards} from "@nestjs/common";
import {CommandBus} from "@nestjs/cqrs";
import {BindBlogByUserCommand} from "./useCase/command";
import {BlogsQueryRepository} from "../../blogs/blogs.query-repository";
import {BasicGuard} from "../../auth/guards/basic.guard";
import {QueryBlogsDTO} from "../../blogs/dto";

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