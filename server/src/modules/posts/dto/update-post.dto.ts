import { IsOptional, MaxLength, IsUrl } from 'class-validator';

// it's pretty much the same... but let's separate the name lol
export class UpdatePostDto {
  @IsOptional()
  @MaxLength(50, {
    message:
      'Post name is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  postName?: string;

  @IsOptional()
  @MaxLength(255, {
    message:
      'Description is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  description?: string;

  @IsOptional()
  @IsUrl(
    {
      protocols: ['https'], // Only allow HTTPS URLs
      require_protocol: true, // Require protocol (e.g., 'https://')
      require_host: true, // Ensure a valid host is present
      allow_trailing_dot: false, // Disallow trailing dots in the host
    },
    { message: 'Repository link must be a valid URL (HTTPS)' },
  )
  repositoryLink?: string;

  @IsOptional()
  @IsUrl(
    {
      protocols: ['https'], // Only allow HTTPS URLs
      require_protocol: true, // Require protocol (e.g., 'https://')
      require_host: true, // Ensure a valid host is present
      allow_trailing_dot: false, // Disallow trailing dots in the host
    },
    { message: 'Browser link must be a valid URL (HTTPS)' },
  )
  browserLink?: string;
}
