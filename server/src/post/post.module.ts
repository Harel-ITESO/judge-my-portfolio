import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  imports: [PrismaModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
