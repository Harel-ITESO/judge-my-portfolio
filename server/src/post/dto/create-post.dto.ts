import { IsNotEmpty, IsUUID, IsUrl, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @MaxLength(50)
  postName: string;

  @IsNotEmpty()
  @IsUUID()
  createdById: string;

  @IsNotEmpty()
  @IsUrl()
  repositoryLink: string;

  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsNotEmpty()
  @IsUrl()
  webLink: string;

  @IsNotEmpty()
  thumbnailImage: string;
}
