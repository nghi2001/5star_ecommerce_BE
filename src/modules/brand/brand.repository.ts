import { Injectable } from "@nestjs/common";
import { Brand } from "../../entity/brand.entity";
import { DataSource, Repository } from "typeorm";


@Injectable()
export class BrandRepository extends Repository<Brand> {
    constructor(private dataSoure: DataSource) {
        super(Brand, dataSoure.createEntityManager())
    }

    async createBrand(brand) {
        let result = await this.createQueryBuilder()
            .insert()
            .into(Brand)
            .values([brand])
            .execute()
        return result
    }
}