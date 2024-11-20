import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow<string>('AWS_S3_REGION'),
  });
  constructor(private readonly configService: ConfigService) {}

  public async upload(filename: string, fileBuffer: Buffer) {
    return await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow<string>('AWS_S3_BUCKET'),
        Key: filename,
        Body: fileBuffer,
        ACL: 'public-read',
      }),
    );
  }
}
