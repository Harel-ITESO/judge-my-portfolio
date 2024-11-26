import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateUserLocalDto } from './dto/create-user-local.dto';
import { hashPassword } from 'src/utils/hash-password';
import { CreateThirdPartyUserDto } from './dto/create-third-party-user.dto';
import { generateAvatar } from 'src/utils/avatar-generator';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly postsService: PostsService,
  ) {}

  /**
   * Creates a new user using a local strategy
   * @param data - The data to create the user
   * @param filterPassword - Whether to filter the password from the user
   * @returns The created user
   */
  public async createUserLocal(
    data: CreateUserLocalDto,
    filterPassword: boolean = true,
  ) {
    const { username, email, password } = data;
    const hashedPassword = await hashPassword(password);
    const created = await this.prismaService.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        authenticationProvider: 'local',
        profilePicUrl: generateAvatar(username),
      },
    });
    return filterPassword ? created : this.filterPasswordFromuser(created);
  }

  /**
   * Creates a new user from a third party authentication provider
   * @param data Data to insert
   * @returns Info about the created user
   */
  public async createUserFromThirdParty(data: CreateThirdPartyUserDto) {
    const { email, username, authenticationProvider } = data;
    const created = await this.prismaService.user.create({
      data: {
        email,
        username,
        authenticationProvider,
        profilePicUrl: generateAvatar(username),
      },
    });
    return this.filterPasswordFromuser(created);
  }

  /**
   * Finds a user with a given where clause
   * @param where Where clause to find the user
   * @param filterPassword Whether to filter the password from the user
   * @returns The user found
   */
  public async findUserWhere(
    where: Prisma.UserWhereUniqueInput,
    filterPassword: boolean = true,
  ) {
    const user = await this.prismaService.user.findUnique({ where });
    if (!user) return null;
    return filterPassword ? this.filterPasswordFromuser(user) : user;
  }

  public async getUserWithSummary(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!user) throw new NotFoundException('User was not found');

    const postsByUser = await this.postsService.getPostsSummary(
      'recent',
      user.userId,
    );

    return { ...this.filterPasswordFromuser(user), posts: [...postsByUser] };
  }

  /**
   * Private method for local functionality, removes the password from the returned user
   * @param user The user to remove the password from
   * @returns The user without a password field
   */
  private filterPasswordFromuser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...toSend } = user;
    return toSend;
  }
}
