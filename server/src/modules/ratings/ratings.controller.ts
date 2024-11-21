import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { Request } from 'express';
import { User } from '@prisma/client';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('ratings')
@UseGuards(JwtGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post(':postId/create')
  // POST - api/jmp/ratings/:postId/create
  public async createRating(
    @Req() request: Request,
    @Body() data: CreateRatingDto,
    @Param('postId') postId: number,
  ) {
    try {
      const { userId } = request.user as User;
      return await this.ratingsService.createRating(userId, postId, data);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get(':postId/ratings-with-comments')
  // GET - api/jmp/ratings/:postId/ratings-with-comments
  public async getRatingsWithComments(@Param('postId') postId: number) {
    return await this.ratingsService.getRatingsWithComments(postId);
  }
}
