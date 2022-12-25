import { HttpException, Injectable } from '@nestjs/common';
import { TYPE_NOTIFY } from 'src/common/enum';
import { IS_READ } from 'src/common/enum/notify.enum';
import { to } from 'src/common/helper/catchError';
import { EventsGateway } from 'src/events/events.gateway';
import { In } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreaeteNotifyDTO } from './dto/create-notify.dto';
import { UpdateNotifyDTO } from './dto/update-notify.dto';
import { NotifyRepository } from './notify.repository';
import { NotifyUserRepository } from './notify_user.repository';

@Injectable()
export class NotifyService {

    constructor(
        private notifyRepository: NotifyRepository,
        private notifyUserRepository: NotifyUserRepository,
        private userService: UserService,
        private EventSevice: EventsGateway
    ) {

    }

    async renderCondition(query) {
        let {
            id,
            type
        } = query;
        let condition: any = {};
        if (id) {
            condition.id = id;
        }

        if (type) {
            condition.type = type;
        }
        return condition;
    }
    async create(dataInsert: CreaeteNotifyDTO) {
        if (dataInsert.type == TYPE_NOTIFY.SYSTEM) {
            let [err, data] = await to(this.notifyRepository.createNotify(dataInsert));
            if (err) {
                console.log("Err Create Notify", err);
                throw new HttpException("Can't create notify", 500)
            }
            this.EventSevice.sendNotificationToUser(null, data, TYPE_NOTIFY.SYSTEM)
            return data
        } else {
            let ids: number[] = await this.userService.getByIds(dataInsert.to)
            if (ids.length <= 0) return false;
            let [errCreate, notify] = await to(this.notifyRepository.createNotify(dataInsert))
            if (errCreate) {
                console.log("Err Create Notify", errCreate);
                throw new HttpException("Can't create notify", 500)
            }
            let notify_userInsert = ids.map(id => {
                return {
                    user_id: id,
                    notify_id: notify.id
                }
            });
            let notify_user = await this.notifyUserRepository.createNotifyUser(notify_userInsert);
            this.EventSevice.sendNotificationToUser(ids, notify);
            return notify;
        }
    }

    async getList(filter = {}, pagination = {}) {
        let data = await this.notifyRepository.getList(filter, pagination);
        return data;
    }

    async getByUserId(userId, pagination = {}) {
        let conditionNotRead = {
            is_read: IS_READ.NO,
            user_id: userId
        }
        let conditionIsRead = {
            is_read: IS_READ.YES,
            user_id: userId
        }
        let notifySystem = await this.notifyRepository.getList({ type: TYPE_NOTIFY.SYSTEM }, pagination);
        let dataIsRead = await this.notifyUserRepository.getByUser(conditionIsRead, pagination);
        let dataNotRead = await this.notifyUserRepository.getByUser(conditionNotRead, pagination);
        let ids = dataNotRead.map(value => {
            return value.id
        });
        console.log(ids);

        await this.notifyUserRepository.update({ id: In(ids) }, { is_read: IS_READ.YES })
        return {
            new_notify: dataNotRead,
            old_notify: dataIsRead,
            system_notify: notifySystem
        };
    }
    async getOne(id: number) {
        let data = await this.notifyRepository.findOneBy({ id });
        return data;
    }

    async destroy(ids: number[]) {
        let result = await this.notifyUserRepository.delete({ id: In(ids) })
        return result
    }

    async update(id: number, updateData: UpdateNotifyDTO) {
        let notify = await this.getOne(id);
        let dataUpdate: UpdateNotifyDTO = {}
        if (updateData.content && updateData.content != notify.content) {
            dataUpdate.content = updateData.content
        }
        if (updateData.link && updateData.link != notify.link) {
            dataUpdate.link = updateData.link
        }
        let result = await this.notifyRepository.update({ id }, dataUpdate);
        return result;
    }
}
