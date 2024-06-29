import { IsNotEmpty, IsUUID, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsUUID()
  createdById: string;

  @IsNotEmpty()
  @IsUrl()
  repositoryLink: string;

  @IsNotEmpty()
  @IsUrl()
  webLink: string;

  @IsNotEmpty()
  thumbnailImage: string;
}
