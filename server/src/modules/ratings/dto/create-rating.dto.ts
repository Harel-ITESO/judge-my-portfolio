import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRatingDto {
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Stars given are not a whole number' },
  )
  @Min(1, { message: 'Stars given are less than 1' })
  @Max(5, { message: 'Stars given are more than 5' })
  @IsNotEmpty()
  stars: number;

  @IsOptional()
  @MaxLength(255, { message: 'Comment is too long' })
  comment?: string;
}
