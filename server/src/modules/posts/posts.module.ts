import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { BucketSerivce } from 'src/services/upload/upload.service';

@Module({
  imports: [UsersModule, JwtModule],
  controllers: [PostsController],
  providers: [PostsService, PrismaService, BucketSerivce],
  exports: [PostsService],
})
export class PostsModule {}
