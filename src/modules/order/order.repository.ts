import { Injectable } from "@nestjs/common";
import { MediaFile } from "../../entity/media.entity";
import { Repository, DataSource } from "typeorm";

@Injectable()
export class OrderRepository extends Repository<MediaFile> {

    constructor(
        dataSource: DataSource
    ) {
        super(MediaFile, dataSource.createEntityManager())
    }

}