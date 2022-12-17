import { HttpException, Injectable } from '@nestjs/common';
import { MediaFile } from '../../entity/media.entity';
import { FileRepository } from './file.repository';
import { createMediaFile } from './interfaces/create-media.interface';
import * as fs from 'fs';

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
    async getOne(id: number) {
        let data = await this.FileRepository.findOneBy({ id });
        if (!data) {
            throw new HttpException("Image not found", 404);
        }
        return data
    }

    async deleteFile(id: number) {
        let file = await this.getOne(id);
        fs.unlink(file.path, async (err) => {
            if (err) throw new HttpException("DELETE FILE", 500);
            await this.delete(id);
        })
        return file;
    }
    async delete(id: number) {
        let result = await this.FileRepository.delete({ id });
        return result
    }

    async checkExits(id) {
        let image = await this.FileRepository.checkExits(id);
        return image ? image : null
    }
}
