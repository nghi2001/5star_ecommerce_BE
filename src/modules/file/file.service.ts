import { HttpException, Injectable } from '@nestjs/common';
import { MediaFile } from 'src/entity/file.entity';
import { FileRepository } from './file.repository';
import { createMediaFile } from './interfaces/create-media.interface';

@Injectable()
export class FileService {
    constructor(private FileRepository: FileRepository) {

    }

    async createFile(file: createMediaFile) {
        let dataInsert = file
        let newFile = await this.FileRepository.createMediaFile(dataInsert);
        if (newFile) {
            let data = await this.FileRepository.findOneBy({ id: newFile.raw[0].id });
            return data;
        }
        throw new HttpException("Create File", 500);
    }
}
