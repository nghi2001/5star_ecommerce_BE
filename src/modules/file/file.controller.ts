import { Body, Get, ValidationPipe } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsS3Service } from '../aws_s3/aws_s3.service';
import { getSignedUrlDTO } from './dto/getSignedUrl.dto';

@Controller('file')
export class FileController {
    constructor(
        private AwsS3Service: AwsS3Service,
        private ConfigService: ConfigService
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
}
