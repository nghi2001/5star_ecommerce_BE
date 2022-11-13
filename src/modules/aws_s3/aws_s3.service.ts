import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
@Injectable()
export class AwsS3Service {
    AWS_BUCKET: string;
    S3: S3;
    constructor(
        private ConfigService: ConfigService
    ) {
        this.AWS_BUCKET = this.ConfigService.get<string>('AWS_S3_BUCKET');
        this.S3 = new S3({
            region: 'ap-southeast-1',
            credentials: {
                accessKeyId: this.ConfigService.get<string>("AWS_ACCESS_KEY"),
                secretAccessKey: this.ConfigService.get<string>("AWS_SECRET_KEY")
            }
        });
    }


    async getSignedUrl(type: string) {
        let fileExtension = type.replace(/image\//g, '');

        let key = `uploads/${Date.now()}.${fileExtension}`;
        let url = await new Promise((resolve, reject) => {
            this.S3.getSignedUrl('putObject', {
                Bucket: this.AWS_BUCKET,
                ContentType: type,
                Key: key,
                Expires: (60 * 60)
            }, (err, url) => {
                if (err) console.log(err);


                resolve(url)
            })
        })

        return { url, key };
    }

    async detroy(key) {
        let result = await new Promise((resol, reject) => {
            let params = {
                Bucket: this.ConfigService.get<string>("AWS_S3_BUCKET"),
                Key: key
            };

            this.S3.deleteObject(params, (err, data) => {
                if (err) reject(err)
                resol(data)
            });

        });

        return result;
    }
}
