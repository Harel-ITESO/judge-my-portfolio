import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class BodyPostDto {
  @IsNotEmpty()
  @MaxLength(50)
  postName: string;

  @IsNotEmpty()
  @IsUrl()
  repositoryLink: string;

  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsNotEmpty()
  @IsUrl()
  webLink: string;
}
