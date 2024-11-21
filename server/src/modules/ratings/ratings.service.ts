import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new rating
   * @param ratedById Id of the user who rated
   * @param postId Id of the post being rated
   * @param data The data to be used to create the rating
   * @returns The created rating
   */
  public async createRating(
    ratedById: number,
    postId: number,
    data: CreateRatingDto,
  ) {
    const createdRating = await this.prismaService.rating.create({
      data: {
        ...data,
        ratedBy: {
          connect: {
            userId: ratedById,
          },
        },
        post: {
          connect: {
            postId,
          },
        },
      },
    });
    return createdRating;
  }

  /**
   * Gets all the ratings that contain comments from a post
   * @param postId Id of the post to get the ratings from
   * @returns The ratings with comments
   */
  public async getRatingsWithComments(postId: number) {
    // SELECT stars, comment, ratedBy.username FROM rating WHERE postId = postId AND comment IS NOT NULL AND comment != ''
    return await this.prismaService.rating.findMany({
      where: {
        AND: [
          {
            postId,
          },
          {
            NOT: {
              OR: [
                {
                  comment: '',
                },
                {
                  comment: null,
                },
              ],
            },
          },
        ],
      },
      select: {
        stars: true,
        comment: true,
        ratedBy: {
          select: {
            username: true,
            profilePicUrl: true,
          },
        },
      },
    });
  }
}
