import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  public async getPosts(withAuthor?: boolean, withComments?: boolean) {
    const data = await this.prisma.post.findMany({
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
    const data = await this.prisma.post.findFirst({
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

  public async createPost(postData: CreatePostDto) {
    const { createdById, repositoryLink, webLink, thumbnailImage } = postData;
    const created = await this.prisma.post.create({
      data: {
        repositoryLink,
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
}
