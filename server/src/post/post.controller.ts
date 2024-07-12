import {
  Controller,
  Get,
  NotFoundException,
  Query,
  Param,
  Post,
  Body,
  Put,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { BodyPostDto } from './dto/body-post.dto';
import { Request } from 'express';
import { isUUID } from 'class-validator';

@Controller('post')
export class PostController {
  constructor(private service: PostService) {}

  // GET /jmp/api/post/all
  @Get('all')
  public async getAllPosts(
    @Query('author') author: string,
    @Query('comments') comments: string,
    @Query('orderType') orderType: string,
  ) {
    const authorValue = author === 'true' || author === 'True';
    const commentsValue = comments === 'true' || comments === 'True';
    const orderTypeValue = parseInt(orderType) || 1;
    const result = await this.service.getPosts(
      authorValue,
      commentsValue,
      orderTypeValue,
    );
    return result || [];
  }

  // GET /jmp/api/post/current
  @UseGuards(JwtGuard)
  @Get('current')
  public async getPostFromCurrentUser(
    @Req() req,
    @Query('author') author: string,
    @Query('comments') comments: string,
  ) {
    const authorValue = author === 'true' || author === 'True';
    const commentsValue = comments === 'true' || comments === 'True';
    const createdById = req.user.sub;
    const found = await this.service.getPostWhere(
      { createdById },
      authorValue,
      commentsValue,
    );
    return found || null;
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
    if (!isUUID(id))
      throw new BadRequestException('Provided value is not an uuid');
    const result = await this.service.getPostById(
      id,
      authorValue,
      commentsValue,
    );
    if (!result)
      throw new NotFoundException('Post with given id was not found');
    return result;
  }

  // POST /jmp/api/post
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const fileName = `${randomName}${extname(file.originalname)}`;
          const url = new URL(
            `${req.protocol}://${req.get('host')}${req.originalUrl}`,
          );
          req.headers['imageUrl'] = `${url.origin}/uploads/${fileName}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  @Post()
  public async createPost(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: '.(png|jpeg|jpg)',
          }),
        ],
      }),
    )
    thumbnail: Express.Multer.File,
    @Req() request: Request,
    @Body() data: BodyPostDto,
  ) {
    const { imageUrl } = request.headers;
    const user = request.user as any;
    const created = await this.service.createPost({
      thumbnailImage: imageUrl as string,
      createdById: user.sub,
      ...data,
    });
    return created;
  }

  // PUT 'jmp/api/post/:id/view'
  @UseGuards(JwtGuard)
  @Put(':id/view')
  public async addViewToPost(@Param('id') id: string) {
    if (!isUUID(id))
      throw new BadRequestException('Provided UUID is not valid');
    const incremented = this.service.incrementView(id);
    if (!incremented) throw new NotFoundException();
  }
}
