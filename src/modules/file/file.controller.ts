import { Body, Get, UploadedFile, UploadedFiles, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from '../aws_s3/aws_s3.service';
import { getSignedUrlDTO } from './dto/getSignedUrl.dto';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
    constructor(
        private AwsS3Service: AwsS3Service,
        private ConfigService: ConfigService,
        private FileService: FileService
    ) { }

    @Post()
    async getSignedUrl(
        @Body(new ValidationPipe()) body: getSignedUrlDTO
    ) {
        let { url, key } = await this.AwsS3Service.getSignedUrl(body.type);
        let linkBucket = this.ConfigService.get<string>("LINK_BUCKET");
        return { url, key, linkBucket };
    }

    @Post("/destroy")
    async deleteObjectS3(@Body() body) {
        let { key } = body;
        let result = await this.AwsS3Service.detroy(key);
        return result
    }

    @Post("/upload")
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        let result = await this.FileService.createFile({
            destination: file.destination,
            file_name: file.filename,
            original_name: file.originalname,
            path: file.path,
            type: file.mimetype
        });
        return result
    }
}
