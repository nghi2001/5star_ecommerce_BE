import { Injectable } from '@nestjs/common';
import { Classify_2 } from "src/entity/classify_2.entity";
import { DataSource, Repository } from "typeorm";
import { classify_2 } from './types/classify2';


@Injectable()
export class Classify_2_Repository extends Repository<Classify_2> {
    constructor(dataSource: DataSource) {
        super(Classify_2, dataSource.createEntityManager())
    }

    async createClassify2(classify: classify_2[]) {
        let classifys = await this.createQueryBuilder()
            .insert()
            .into(Classify_2)
            .values(classify)
            .execute();
        return classifys;
    }
}