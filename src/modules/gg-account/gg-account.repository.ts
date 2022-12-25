import { Injectable } from "@nestjs/common";
import { GGAccount } from "src/entity/ggaccount.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class GgAccountRepository extends Repository<GGAccount> {
    constructor(dataSource: DataSource) {
        super(GGAccount, dataSource.createEntityManager())
    }
}