import { Injectable } from "@nestjs/common";
import { FBAccount } from "src/entity/fbaccount.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class FbAccountRepository extends Repository<FBAccount> {
    constructor(dataSource: DataSource) {
        super(FBAccount, dataSource.createEntityManager())
    }
}