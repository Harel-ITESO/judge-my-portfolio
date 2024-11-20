import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty } from 'class-validator';

export class ImagePostDto extends CreatePostDto {
  @IsNotEmpty()
  thumbnailImage: string;
}
