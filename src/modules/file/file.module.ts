import { Module } from '@nestjs/common';
import { AwsS3Module } from '../aws_s3/aws_s3.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [AwsS3Module],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}
