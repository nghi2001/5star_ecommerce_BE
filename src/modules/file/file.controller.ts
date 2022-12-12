import { Body, CacheInterceptor, Delete, Get, HttpException, Inject, Param, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from '../aws_s3/aws_s3.service';
import { getSignedUrlDTO } from './dto/getSignedUrl.dto';
import { FileService } from './file.service';
import * as fs from 'fs';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('file')
@UseInterceptors(CacheInterceptor)
export class FileController {
    constructor(
        private AwsS3Service: AwsS3Service,
        private ConfigService: ConfigService,
        private FileService: FileService,
        @InjectQueue('mail') private mailQueue: Queue
    ) { }

    @Get("/test")
    async test() {
        await this.mailQueue.add({ to: "nguyenduynghi2001@gmail.com", html: "<h1>hello</h1>" })
        return 'nghi'
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async getSignedUrl(
        @Body(new ValidationPipe()) body: getSignedUrlDTO
    ) {
        let { url, key } = await this.AwsS3Service.getSignedUrl(body.type);
        let linkBucket = this.ConfigService.get<string>("LINK_BUCKET");
        return { url, key, linkBucket };
    }

    @UseGuards(JwtAuthGuard)
    @Post("/destroy")
    async deleteObjectS3(@Body() body) {
        let { key } = body;
        let result = await this.AwsS3Service.detroy(key);
        return result
    }
    @Get(":id")
    async find(@Param("id") id: number) {
        let data = await this.FileService.getOne(id);
        return data
    }

    @UseGuards(JwtAuthGuard)
    @Post("/upload")
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
        let result = await this.FileService.createFile({
            destination: file.destination,
            file_name: file.filename,
            original_name: file.originalname,
            path: file.path,
            type: file.mimetype
        });
        return result
    }


    @UseGuards(JwtAuthGuard)
    @Delete("/:id")
    async destroy(@Param("id") id: number) {
        let file = await this.FileService.getOne(id);
        console.log(file);
        fs.unlink(file.path, async (err) => {
            if (err) throw new HttpException("DELETE FILE", 500);
            await this.FileService.delete(id);
        })
        return file;
    }
}
