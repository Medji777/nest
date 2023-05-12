import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { BlogsModule } from '../public/blogs/blogs.module';
import { PostsModule } from '../public/posts/posts.module';
import { CommentsModule } from '../public/comments/comments.module';
import { AuthModule } from '../public/auth/auth.module';
import { SecurityModule } from '../public/security/security.module';
import { settings } from '../config';
import { BloggerBlogModule } from "../bloggers/blogs/blogs.module";
import { SABlogsModule } from "../sa/blogs/blogs.module";
import { SAUsersModule } from "../sa/users/users.module";

const PublicModule = [
  UsersModule,
  BlogsModule,
  PostsModule,
  CommentsModule,
  AuthModule,
  SecurityModule
]
const SAModule = [SABlogsModule, SAUsersModule]
const BloggerModule = [BloggerBlogModule]

@Module({
  imports: [
    settings.START_MODULE,
    MongooseModule.forRoot(settings.mongoURI),
    ...PublicModule,
    ...BloggerModule,
    ...SAModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
