import { Module } from '@nestjs/common';
import { AwsS3Controller } from './aws_s3.controller';
import { AwsS3Service } from './aws_s3.service';

@Module({
  controllers: [AwsS3Controller],
  providers: [AwsS3Service],
  exports: [AwsS3Service]
})
export class AwsS3Module {}
