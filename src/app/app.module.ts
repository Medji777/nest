import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { BlogsModule } from '../blogs/blogs.module';
import { PostsModule } from '../posts/posts.module';
import { CommentsModule } from '../comments/comments.module';
import { AuthModule } from "../auth/auth.module";
import { SecurityModule } from "../security/security.module";
import { settings } from '../config';

@Module({
  imports: [
    settings.START_MODULE,
    MongooseModule.forRoot(settings.mongoURI),
    UsersModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    AuthModule,
    SecurityModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
