import { Injectable } from "@nestjs/common";
import { Contact } from "src/entity/contact.entity";
import { DataSource, Repository } from "typeorm";
import { CreateContactDTO } from "./dto/create-contact.dto";

@Injectable()
export class ContactRepository extends Repository<Contact> {
    constructor(dataSource: DataSource) {
        super(Contact, dataSource.createEntityManager())
    }
    async createContact(dataInsert: CreateContactDTO): Promise<any> {
        let data = new Contact();
        data.address = dataInsert.address || null;
        data.email = dataInsert.email || null;
        data.message = dataInsert.message || null;
        data.name = dataInsert.name || null;
        data.phone = dataInsert.phone || null;
        data = await data.save();
        return data;
    }

    async getList(filter = {}, pagination = {}) {
        let data = await this.find({
            where: filter,
            ...pagination
        });
        let total = await this.count({
            where: filter
        });
        return {
            total,
            data
        }
    }
}