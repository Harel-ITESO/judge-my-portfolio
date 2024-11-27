import { Test, TestingModule } from '@nestjs/testing';
import { BucketSerivce } from './upload.service';

describe('UploadService', () => {
  let service: BucketSerivce;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BucketSerivce],
    }).compile();

    service = module.get<BucketSerivce>(BucketSerivce);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
