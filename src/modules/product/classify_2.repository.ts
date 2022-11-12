import { Injectable } from '@nestjs/common';
import { Classify_2 } from "src/entity/classify_2.entity";
import { DataSource, Repository } from "typeorm";


@Injectable()
export class Classify_2_Repository extends Repository<Classify_2> {
    constructor(dataSource: DataSource) {
        super(Classify_2, dataSource.createEntityManager())
    }
}