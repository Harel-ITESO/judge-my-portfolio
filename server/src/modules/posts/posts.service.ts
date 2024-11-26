import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { BucketSerivce } from 'src/services/upload/upload.service';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';

import { PostSummary } from './models/post-summary';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bucketService: BucketSerivce,
    private readonly configSerivce: ConfigService,
  ) {}

  /**
   * Returns a post by its id
   * @param postId Id of the post to look for
   * @returns The post if found
   */
  public async getPostById(postId: number) {
    const post = await this.prismaService.post.findUnique({
      where: {
        postId,
      },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

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
    await this.bucketService.upload(fileName, thumbnailImage.buffer);

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
    byUser?: number | string,
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
    let userQuery = '';
    if (byUser) {
      userQuery = `WHERE ${typeof byUser === 'number' ? 'u.user_id' : 'u.username'} = '${byUser}'`;
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
    ${userQuery}
    GROUP BY p.post_id, p.post_name, p.repository_link, p.browser_link, p.thumbnail_image, p.view_count, u.username
    ${orderByRule === '' ? '' : 'ORDER BY ' + orderByRule + ' DESC'}
  `;

    const data = (await this.prismaService.$queryRawUnsafe(
      query,
    )) as PostSummary[];

    return data;
  }

  /**
   * Returns a post by its id with the comment ratings and the average rating
   * @param postId The id of the post to look for
   * @returns A post with the comment ratings and the average rating
   */
  public async getPostByIdWithCommentRatings(postId: number) {
    // This is fucking ugly, but it works
    const post = await this.prismaService.post.findUnique({
      where: {
        postId,
      },
      select: {
        description: true,
        postName: true,
        thumbnailImage: true,
        viewCount: true,
        repositoryLink: true,
        browserLink: true,
        createdBy: {
          select: {
            username: true,
            profilePicUrl: true,
          },
        },
        ratings: {
          select: {
            stars: true,
            ratedBy: {
              select: {
                username: true,
                profilePicUrl: true,
              },
            },
          },
          where: {
            comment: {
              not: {
                equals: null,
              },
            },
          },
        },
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    // calculate the average rating for the post to avoid sql doing it
    const totalRatings = post.ratings.length;
    const averageRatings =
      post.ratings.reduce((prev, curr) => prev + curr.stars, 0) / totalRatings;

    return { ...post, averageRatings: averageRatings || 0 };
  }

  /**
   *
   * @param postId Id of the post to update
   * @param data Data to update
   * @returns updated post
   */
  public async updatePostData(postId: number, data: UpdatePostDto) {
    const updatedPost = await this.prismaService.post.update({
      where: { postId },
      data: {
        ...data,
      },
    });
    if (!updatedPost)
      throw new NotFoundException('Post with the provided id was not found');
    return updatedPost;
  }

  /**
   * Adds 1 to the view of a post
   * @param postId The id of the post to add the view to
   */
  public async addView(postId: number) {
    await this.prismaService.post.update({
      where: { postId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
    return { message: 'View added' };
  }

  /**
   *  Deletes a post
   * @param postId Id of the post to delete
   */
  public async deletePost(postId: number) {
    const deleted = await this.prismaService.post.delete({
      where: { postId },
    });
    if (!deleted) throw new NotFoundException('Post not found');
  }
}
