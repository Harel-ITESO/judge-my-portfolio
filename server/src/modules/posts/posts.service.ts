import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UploadService } from 'src/services/upload/upload.service';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uploadService: UploadService,
    private readonly configSerivce: ConfigService,
  ) {}

  /**
   * Creates a post by a user
   * @param userId The id of the user to create the post
   * @param username Username for file naming
   * @param data Data for the post
   * @param thumbnailImage File provided by the upload interceptor
   * @returns The created post
   */
  public async createPostByUser(
    userId: number,
    username: string,
    data: CreatePostDto,
    thumbnailImage: Express.Multer.File,
  ) {
    // set a name for the uploaded file
    const randomHash = randomBytes(16).toString('hex');
    const fileName = `${username}-upload-${randomHash}.${thumbnailImage.mimetype.split('/')[1]}`;

    // upload the file to the S3 bucket
    await this.uploadService.upload(fileName, thumbnailImage.buffer);

    // Form the url for the uploaded file
    const bucketName = this.configSerivce.getOrThrow<string>('AWS_S3_BUCKET');
    const region = this.configSerivce.getOrThrow<string>('AWS_S3_REGION');

    const thumbnailImageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

    // post the data to the database
    const createdPost = await this.prismaService.post.create({
      data: {
        ...data,
        thumbnailImage: thumbnailImageUrl,
        createdBy: {
          connect: {
            userId,
          },
        },
      },
    });
    return createdPost;
  }

  /**
   * Gets all the posts as a summary
   * @param orderBy The order by rule
   * @returns The summary of the posts in the required order
   */
  public async getPostsSummary(
    orderBy?: 'mostRated' | 'mostViewed' | 'recent',
  ) {
    const orderByRule: Prisma.PostOrderByWithRelationInput = {};
    switch (orderBy) {
      case 'mostViewed':
        orderByRule.viewCount = 'desc';
        break;
      case 'recent':
        orderByRule.createdAt = 'desc';
        break;
    }

    const data = await this.prismaService.post.findMany({
      select: {
        postId: true,
        postName: true,
        thumbnailImage: true,
        viewCount: true,
        repositoryLink: true,
        browserLink: true,
        createdBy: {
          select: {
            username: true,
          },
        },
      },
      orderBy: orderByRule,
    });
    return data;
  }
}
