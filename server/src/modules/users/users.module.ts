import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { PostsService } from '../posts/posts.service';
import { BucketSerivce } from 'src/services/upload/upload.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, PostsService, BucketSerivce],
  exports: [UsersService],
})
export class UsersModule {}
