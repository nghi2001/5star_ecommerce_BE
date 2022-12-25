import { Injectable } from '@nestjs/common';
import { Notify_User } from 'src/entity/notify_user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NotifyUserRepository extends Repository<Notify_User> {
    constructor(dataSource: DataSource) {
        super(Notify_User, dataSource.createEntityManager())
    }

    async createNotifyUser(notifyUser) {
        let data = await this.createQueryBuilder()
            .insert()
            .into(Notify_User)
            .values(notifyUser)
            .execute()
        return data;
    }

    async getByUser(filter = {}, pagination = {}) {
        let data = await this.find({
            where: filter,
            order: {
                id: 'DESC'
            },
            relations: {
                notify: true
            },
            ...pagination
        });
        return data
    }
}
