import {Module} from "@nestjs/common";
import {SAUsersController} from "./users.controller";

@Module({
    controllers: [SAUsersController]
})
export class SAUsersModule {}