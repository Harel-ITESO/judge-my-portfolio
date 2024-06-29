import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  public async getAccountById(
    id: string,
    withPosts?: boolean,
    withComments?: boolean,
  ) {
    return await this.prisma.account.findFirst({
      where: { accountId: id },
      include: {
        posts: withPosts,
        comments: withComments,
      },
    });
  }

  public async getAccountWhere(
    where: Prisma.AccountWhereUniqueInput | Prisma.AccountWhereInput,
  ) {
    return await this.prisma.account.findFirst({
      where,
    });
  }

  public async createAccount(account: CreateAccountDto) {
    const created = await this.prisma.account.create({ data: account });
    return created;
  }

  public async updateAccount(id: string, account: UpdateAccountDto) {
    const updated = await this.prisma.account.update({
      where: {
        accountId: id,
      },
      data: account,
    });
    return updated;
  }

  public async deleteAccount(id: string) {
    const deleted = await this.prisma.account.delete({
      where: { accountId: id },
    });
    return {
      deletedId: deleted.accountId,
    };
  }
}
