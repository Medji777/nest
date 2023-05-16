import {Module} from "@nestjs/common";
import {BloggerUsersController} from "./users.controller";

@Module({
    imports: [],
    controllers: [BloggerUsersController],
    providers: []
})
export class BloggerUsersModule {}