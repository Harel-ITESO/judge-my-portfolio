import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Request } from 'express';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('')
  // POST - /api/jmp/posts
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('thumbnailImage'))
  public async createPost(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg)' }),
        ],
      }),
    )
    thumbnailImage: Express.Multer.File,
    @Req() req: Request,
    @Body() data: CreatePostDto,
  ) {
    const user = req.user as User;
    const createdPost = await this.postsService.createPostByUser(
      user.userId,
      user.username,
      {
        ...data,
      },
      thumbnailImage,
    );
    return createdPost;
  }

  // GET - /api/jmp/posts/summary
  @Get('summary')
  public async getAllPostsWithSummary(
    @Query('orderBy')
    orderBy: 'mostRated' | 'mostViewed' | 'recent' | undefined,
  ) {
    const data = await this.postsService.getPostsSummary(orderBy);
    return data;
  }
}
