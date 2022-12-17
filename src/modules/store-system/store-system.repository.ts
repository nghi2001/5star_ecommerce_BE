import { Injectable } from "@nestjs/common";
import { STORE_SYSTEM_STATUS } from "src/common/enum/store-system.enum";
import { StoreSystem } from "src/entity/store-system.entity";
import { Repository, DataSource } from "typeorm";
import { CreateStoreSystemDTO } from "./dto/create-store-system.dto";

@Injectable()
export class StoreSystemRepository extends Repository<StoreSystem> {

    constructor(
        dataSource: DataSource
    ) {
        super(StoreSystem, dataSource.createEntityManager())
    }

    async createStoreSystem(dataInsert: CreateStoreSystemDTO) {
        let storeSystem = new StoreSystem();
        storeSystem.address = dataInsert.address || null;
        storeSystem.email = dataInsert.email || null;
        storeSystem.name = dataInsert.name || null;
        storeSystem.open_close = dataInsert.open_close || null;
        storeSystem.phone = dataInsert.phone || null;
        storeSystem.status = dataInsert.status || STORE_SYSTEM_STATUS.ACTIVE;
        storeSystem.time = dataInsert.time || null
        await storeSystem.save();
        return storeSystem;
    }

    async getList(filter = {}, pagination = {}) {
        let data = await this.find({
            where: filter,
            order: {
                id: 'ASC'
            },
            ...pagination
        });
        let total = await this.count({
            where: filter
        });
        return { total, data }
    }
}