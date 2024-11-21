import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UploadService } from 'src/services/upload/upload.service';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';

import { PostSummary } from './models/post-summary';

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
   * Gets all the posts as a summary (With stars rating average)
   * @param orderBy The order by rule
   * @returns The summary of the posts in the required order
   */
  public async getPostsSummary(
    orderBy?: 'mostRated' | 'mostViewed' | 'recent',
  ) {
    let orderByRule: string; // #1 is the field to order by, #2 is the order
    switch (orderBy) {
      case 'mostViewed':
        orderByRule = 'p.view_count';
        break;
      case 'recent':
        orderByRule = 'p.created_at';
        break;
      case 'mostRated':
        orderByRule = '"averageRating"';
        break;
      default:
        orderByRule = '';
    }
    const query = `
    SELECT p.post_id AS "postId", 
           p.post_name AS "postName", 
           p.repository_link AS "repositoryLink", 
           p.browser_link AS "browserLink", 
           p.thumbnail_image AS "thumbnailImage", 
           p.view_count AS "viewCount", 
           u.username AS "createdBy", 
           p.created_at AS "createdAt",
           COALESCE(AVG(r.stars), 0)::numeric as "averageRating"
    FROM "Post" p
    JOIN "User" u ON p.created_by_id = u.user_id
    LEFT JOIN "Rating" r ON p.post_id = r.post_id
    GROUP BY p.post_id, p.post_name, p.repository_link, p.browser_link, p.thumbnail_image, p.view_count, u.username
    ${orderByRule === '' ? '' : 'ORDER BY ' + orderByRule + ' DESC'}
  `;

    const data = (await this.prismaService.$queryRawUnsafe(
      query,
    )) as PostSummary[];

    return data;
  }
}
