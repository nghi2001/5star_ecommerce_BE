import { Injectable } from '@nestjs/common';
import { Notify } from 'src/entity/notify.entity';
import { DataSource, Repository } from 'typeorm';
import { CreaeteNotifyDTO } from './dto/create-notify.dto';

@Injectable()
export class NotifyRepository extends Repository<Notify> {
    constructor(dataSource: DataSource) {
        super(Notify, dataSource.createEntityManager())
    }

    async createNotify(dataInsert: CreaeteNotifyDTO) {
        let notify = new Notify();
        notify.content = dataInsert.content;
        notify.type = dataInsert.type;
        notify.link = dataInsert.link || null;
        notify = await notify.save();
        return notify;
    }

    async getList(filter = {}, pagination = {}) {
        let data = await this.find({
            where: filter,
            order: {
                id: 'DESC'
            },
            ...pagination
        })
        return data
    }
}
