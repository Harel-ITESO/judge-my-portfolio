import { Module } from '@nestjs/common';

import { UsersModule } from './modules/users/users.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { PrismaService } from './services/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './modules/posts/posts.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BucketSerivce } from './services/upload/upload.service';
import { RatingsModule } from './modules/ratings/ratings.module';

@Module({
  imports: [
    UsersModule,
    AuthenticationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PostsModule,
    RatingsModule,
  ],
  controllers: [],
  providers: [PrismaService, BucketSerivce],
})
export class AppModule {}
