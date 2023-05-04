import {Module} from "@nestjs/common";
import {SABlogsController} from "./blogs.controller";

@Module({
    controllers: [SABlogsController]
})
export class SABlogsModule {}