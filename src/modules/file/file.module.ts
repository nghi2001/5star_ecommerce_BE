import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AwsS3Module } from '../aws_s3/aws_s3.module';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';

@Module({
  imports: [
    AwsS3Module,
    MulterModule.registerAsync({
      imports: [
        ConfigModule
      ],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>("MULTER_DEST")
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [FileController],
  providers: [FileService, FileRepository],
  exports: [FileService]
})
export class FileModule { }
