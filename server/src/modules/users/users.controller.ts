import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:username/detail')
  @UseGuards(JwtGuard)
  public async getUserByUsernameWithSummary(
    @Param('username') username: string,
  ) {
    console.log(username);
    return await this.usersService.getUserWithSummary(username);
  }
}
