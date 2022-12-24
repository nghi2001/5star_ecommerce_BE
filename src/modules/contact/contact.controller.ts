import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Delete, Get, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { Queue } from 'bull';
import { FilterFromToCreate } from 'src/common/helper/filter-from-to';
import { pager } from 'src/common/helper/paging';
import { ContactService } from './contact.service';
import { CreateContactDTO } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
    constructor(
        @InjectQueue("mail") private mailQueue: Queue,
        private contactService: ContactService) { }

    @Get()
    async shows(@Query() query) {
        let condition = await this.contactService.renderCondition(query);
        let pagination = pager(query);
        let data = await this.contactService.getList(condition, pagination);
        return data;
    }

    @Get(":id")
    async find(@Param("id") id: number) {
        let data = await this.find(id);
        return data;
    }

    @Post()
    async create(@Body(new ValidationPipe()) body: CreateContactDTO) {
        let data = await this.contactService.create(body);
        this.mailQueue.add({
            to: body.email,
            subject: "Cám ơn bạn đã liên hệ với chúng tôi",
            html: `
                <h3>Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi đã nhận được thông tin và sẽ liên hệ bạn trong thời gian sớm nhất</h3>
                `
        })
        return data;
    }

    @Delete(":id")
    async destroy(@Param("id") id: number) {
        let data = await this.contactService.destroy(id);
        return data;
    }
}
