import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PostsService } from '../posts/posts.service';
import { BucketSerivce } from 'src/services/upload/upload.service';

@Module({
  imports: [JwtModule],
  controllers: [RatingsController],
  providers: [RatingsService, PrismaService, PostsService, BucketSerivce],
})
export class RatingsModule {}
