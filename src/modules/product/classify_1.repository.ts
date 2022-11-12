import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Classify_1 } from 'src/entity/classify_1.entity';
import { classify_1 } from './types/classify1';

@Injectable()
export class Classify_1_Repository extends Repository<Classify_1> {
    constructor(dataSource: DataSource) {
        super(Classify_1, dataSource.createEntityManager())
    }

    async createClassify1(classify1: classify_1[]) {
        let classify = await this.createQueryBuilder()
            .insert()
            .into(Classify_1)
            .values(classify1)
            .execute()
        return classify
    }
}