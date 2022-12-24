import { HttpException, Injectable } from '@nestjs/common';
import { to } from 'src/common/helper/catchError';
import { FilterFromToCreate } from 'src/common/helper/filter-from-to';
import { ContactRepository } from './contact.repository';
import { CreateContactDTO } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
    constructor(private contactRepository: ContactRepository) {

    }

    async renderCondition(query) {
        let {
            id,
            created_from,
            created_to
        } = query;
        let condition: any = {};
        if (id) {
            condition.id = id;
        }
        if (created_from || created_to) {
            condition = FilterFromToCreate(created_from, created_to, condition);
        };
        return condition
    }

    async create(data: CreateContactDTO) {
        let [err, contact] = await to(this.contactRepository.createContact(data));
        if (err) {
            console.log(err);
            throw new HttpException("Err create contact", 500);
        }
        return contact;
    }

    async getList(filter = {}, pagination = {}) {
        let [err, data] = await to(this.contactRepository.getList(filter, pagination));
        if (err) {
            console.log(err);
            throw new HttpException("Get List Contact", 500);
        }
        return data;
    }
    async getOne(id: number) {
        let [err, data] = await to(this.contactRepository.findOneBy({ id }));
        if (err) {
            console.log(err);
            throw new HttpException("Get Detail Contat", 500);
        }
        return data;
    }

    async destroy(id: number) {
        let [err, data] = await to(this.contactRepository.delete({ id }));
        if (err) {
            console.log(err);
            throw new HttpException("Destroy Contact", 500);
        }
        return data;
    }
}
