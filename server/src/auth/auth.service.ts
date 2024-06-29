import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from '@prisma/client';
import { AccountService } from 'src/account/account.service';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateToken(payload: Account) {
    const { accountId, ...rest } = payload;
    return await this.jwtService.signAsync({ sub: accountId, ...rest });
  }

  public async validateTokenSignature(token: string) {
    const data = await this.jwtService.verifyAsync(token);
    return data;
  }

  public async registerOrAccessAccount(data: CreateAccountDto) {
    const found = await this.accountService.getAccountWhere({
      email: data.email,
      serviceProvider: data.serviceProvider,
    });
    if (found) return await this.generateToken(found);

    const created = await this.accountService.createAccount(data);
    return await this.generateToken(created);
  }
}
