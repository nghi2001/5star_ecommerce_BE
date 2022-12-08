import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AwsS3Module } from '../aws_s3/aws_s3.module';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';
import { BullModule } from '@nestjs/bull';
import * as path from 'path';
import { diskStorage } from 'multer';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail'
    }),
    AwsS3Module,
    MulterModule.registerAsync({
      imports: [
        ConfigModule
      ],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>("MULTER_DEST"),
        storage: diskStorage({
          filename: (req, file, cb) => {
            let filename = Date.now() + path.extname(file.originalname);
            cb(null, filename)
          }
        })
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [FileController],
  providers: [FileService, FileRepository],
  exports: [FileService]
})
export class FileModule { }
