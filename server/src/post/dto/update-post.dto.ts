import { MaxLength } from 'class-validator';

export class UpdatePostDto {
  @MaxLength(50)
  postName: string;
}
