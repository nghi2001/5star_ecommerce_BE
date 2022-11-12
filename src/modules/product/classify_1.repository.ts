import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Classify_1 } from 'src/entity/classify_1.entity';

@Injectable()
export class Classify_1_Repository extends Repository<Classify_1> {
    constructor(dataSource: DataSource) {
        super(Classify_1, dataSource.createEntityManager())
    }
}