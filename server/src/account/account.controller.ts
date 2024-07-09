import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Put,
  NotFoundException,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('account')
export class AccountController {
  constructor(private service: AccountService) {}

  // GET /jmp/api/account/:id
  @UseGuards(JwtGuard)
  @Get(':id')
  public async getAccountById(
    @Param('id') id: string,
    @Query('posts') posts: string,
    @Query('comments') comments: string,
  ) {
    const postsValue = posts === 'true' || posts === 'True';
    const commentsValue = comments === 'true' || comments === 'True';
    const data = await this.service.getAccountById(
      id,
      postsValue,
      commentsValue,
    );
    if (!data) throw new NotFoundException('User with given id was not found');
    return data;
  }

  // POST /jmp/api/account
  @Post()
  public async createAccount(@Body() body?: CreateAccountDto) {
    if (!body) throw new BadRequestException('Post data was not provided');
    const created = await this.service.createAccount(body);
    return created;
  }

  // PUT /jmp/api/account
  @UseGuards(JwtGuard)
  @Put(':id')
  public async updateAccount(
    @Param('id') id: string,
    @Body() body?: UpdateAccountDto,
  ) {
    if (!body || !id)
      throw new BadRequestException(
        "Body or id were not provided, can't perform operation ",
      );
    const updated = await this.service.updateAccount(id, body);
    if (!updated)
      throw new NotFoundException('User with given id was not found');
    return updated;
  }

  // DELETE /jmp/api/delete
  @Delete(':id')
  @UseGuards(JwtGuard)
  public async deleteAccount(@Param('id') id: string) {
    const deleted = await this.service.deleteAccount(id);
    if (!deleted)
      throw new NotFoundException('User with given id was not found');
    return deleted;
  }
}
