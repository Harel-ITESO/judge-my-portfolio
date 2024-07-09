import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class BodyPostDto {
  @IsNotEmpty()
  @MaxLength(50)
  postName: string;

  @IsNotEmpty()
  @IsUrl()
  repositoryLink: string;

  @IsNotEmpty()
  @IsUrl()
  webLink: string;
}
