import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getPosts(
    withAuthor?: boolean,
    withComments?: boolean,
    orderType?: number,
  ) {
    let order: Prisma.PostOrderByWithRelationInput;
    switch (orderType) {
      case 1: // most viewed
        order = { viewCount: 'desc' };
        break;
      case 2: // best rated
        break;
      case 3: // recent
        order = { createdOn: 'desc' };
    }
    const data = await this.prismaService.post.findMany({
      include: {
        createdBy: withAuthor,
        comments: withComments,
      },
      orderBy: order,
    });
    return data;
  }

  public async getPostWhere(
    where: Prisma.PostWhereInput | Prisma.PostWhereUniqueInput,
    withAuthor?: boolean,
    withComments?: boolean,
  ) {
    const data = await this.prismaService.post.findFirst({
      where,
      include: {
        createdBy: withAuthor,
        comments: withComments,
      },
    });
    return data;
  }

  public async getPostById(
    id: string,
    withAuthor?: boolean,
    withComments?: boolean,
  ) {
    const data = await this.prismaService.post.findFirst({
      where: {
        postId: id,
      },
      include: {
        createdBy: withAuthor,
        comments: withComments,
      },
    });
    return data;
  }

  public async createPost({
    createdById,
    repositoryLink,
    webLink,
    thumbnailImage,
    postName,
    description,
  }: CreatePostDto) {
    const created = await this.prismaService.post.create({
      data: {
        postName,
        repositoryLink,
        description,
        webLink,
        thumbnailImage,
        createdBy: {
          connect: {
            accountId: createdById,
          },
        },
      },
    });
    return created;
  }

  public async incrementView(id: string) {
    const post = this.prismaService.post.update({
      where: {
        postId: id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
    return post;
  }
}
