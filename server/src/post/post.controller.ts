import {
  Controller,
  Get,
  NotFoundException,
  Query,
  Param,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('post')
export class PostController {
  constructor(private service: PostService) {}

  // GET /jmp/api/post/all
  @Get('all')
  public async getAllPosts(
    @Query('author') author: string,
    @Query('comments') comments: string,
  ) {
    const authorValue = author === 'true' || author === 'True';
    const commentsValue = comments === 'true' || comments === 'True';
    try {
      const result = await this.service.getPosts(authorValue, commentsValue);
      return result || [];
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  // GET /jmp/api/post/:id
  @Get(':id')
  public async getPostById(
    @Query('author') author: string,
    @Query('comments') comments: string,
    @Param('id') id: string,
  ) {
    const authorValue = author === 'true' || author === 'True';
    const commentsValue = comments === 'true' || comments === 'True';
    try {
      const result = await this.service.getPostById(
        id,
        authorValue,
        commentsValue,
      );
      if (!result)
        throw new NotFoundException('Post with given id was not found');
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  // POST /jmp/api/post
  @UseGuards(JwtGuard)
  @Post()
  public async createPost(@Body() data: CreatePostDto) {
    try {
      const created = await this.service.createPost(data);
      return {
        created,
      };
    } catch (e) {
      console.error(e);
      return e;
    }
  }
}
