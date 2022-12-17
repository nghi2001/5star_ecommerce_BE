import { HttpException, Injectable } from '@nestjs/common';
import { to } from 'src/common/helper/catchError';
import { StoreSystem } from 'src/entity/store-system.entity';
import { Like } from 'typeorm';
import { CreateStoreSystemDTO } from './dto/create-store-system.dto';
import { UpdateStoreSystemDTO } from './dto/update-store-system.dto';
import { StoreSystemRepository } from './store-system.repository';

@Injectable()
export class StoreSystemService {
    constructor(
        private StoreSystemRepository: StoreSystemRepository
    ) { }

    async renderCondition(query) {
        let {
            address,
            name,
            email,
            status
        } = query;
        let condition: any = {}
        if (address) {
            condition.address = Like(`%${address}%`);;
        }
        if (name) {
            condition.name = Like(`%${name}%`);
        }
        if (email) {
            condition.email = email;
        }
        if (status) {
            condition.status = status;
        }
        return condition;
    }
    async create(data: CreateStoreSystemDTO) {
        let [err, storeSystem] = await to(this.StoreSystemRepository.createStoreSystem(data))
        if (err) {
            throw new HttpException("Can't create", 500);
        }
        return storeSystem;
    }

    async getOne(id: number): Promise<StoreSystem> {
        let [err, data] = await to(this.StoreSystemRepository.findOneBy({ id }));
        if (!data) {
            throw new HttpException("id not found", 404);
        }
        return data;
    }

    async getList(filter = {}, pagination = {}) {
        let [err, data] = await to(this.StoreSystemRepository.getList(filter, pagination))
        return data;
    }

    async destroy(id: number) {
        let [err, result] = await to(this.StoreSystemRepository.delete({ id }));
        if (err) {
            throw new HttpException("Can't Delete", 500);
        }
        return result;
    }

    async update(id: number, updateData: UpdateStoreSystemDTO) {
        let storeSystem = await this.getOne(id);
        let dataUpdate: UpdateStoreSystemDTO = {};

        if (updateData.name && updateData.name != storeSystem.name) {
            dataUpdate.name = updateData.name;
        }
        if (updateData.email && updateData.email != storeSystem.email) {
            dataUpdate.email = updateData.email;
        }
        if (updateData.address && updateData.address != storeSystem.address) {
            dataUpdate.address = updateData.address;
        }
        if (updateData.open_close && updateData.open_close != storeSystem.open_close) {
            dataUpdate.open_close = updateData.open_close;
        }
        if (updateData.phone && updateData.phone != storeSystem.phone) {
            dataUpdate.phone = updateData.phone;
        }
        if (updateData.status && updateData.status != storeSystem.status) {
            dataUpdate.status = updateData.status;
        }
        if (updateData.time && updateData.time != storeSystem.time) {
            dataUpdate.time = updateData.time;
        }
        let [err, result] = await to(this.StoreSystemRepository.update({ id }, dataUpdate))
        if (err) {
            throw new HttpException("Can't update", 500);
        }
        return result
    }

}
