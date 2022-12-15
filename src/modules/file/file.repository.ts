import { Injectable } from "@nestjs/common";
import { MediaFile } from "../../entity/media.entity";
import { Repository, DataSource } from "typeorm";
import { createMediaFile } from "./interfaces/create-media.interface";

@Injectable()
export class FileRepository extends Repository<MediaFile> {

    constructor(
        dataSource: DataSource
    ) {
        super(MediaFile, dataSource.createEntityManager())
    }

    async createMediaFile(file: createMediaFile) {
        let result = await this.createQueryBuilder()
            .insert()
            .into(MediaFile)
            .values([file])
            .execute()
        return result
    }

    async checkExits(id: number) {
        let data = await this.findOne({
            where: {
                id: id
            },
            select: [
                "id"
            ]
        });
        return data;
    }
}