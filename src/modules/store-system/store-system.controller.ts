import { Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { StoreSystemService } from './store-system.service';
import { pager } from '../../common/helper/paging'
import { CreateStoreSystemDTO } from './dto/create-store-system.dto';
import { UpdateStoreSystemDTO } from './dto/update-store-system.dto';
@Controller('store-system')
export class StoreSystemController {
    constructor(
        private StoreSystemService: StoreSystemService
    ) { }

    @Get("")
    async shows(@Query() query) {
        let pagination = await pager(query);
        let condition = await this.StoreSystemService.renderCondition(query);
        let data = await this.StoreSystemService.getList(condition, pagination);
        return data
    }

    @Get(":id")
    async find(@Param("id") id: number) {
        let data = await this.StoreSystemService.getOne(id);
        return data;
    }

    @Post("")
    async create(@Body(new ValidationPipe()) body: CreateStoreSystemDTO) {
        let data = await this.StoreSystemService.create(body);
        return data;
    }


    @Put(":id")
    async update(
        @Param("id") id: number,
        @Body(new ValidationPipe()) body: UpdateStoreSystemDTO
    ) {
        let data = await this.StoreSystemService.update(id, body);
        return data;
    }

    @Delete(":id")
    async destroy(@Param("id") id: number) {
        let data = await this.StoreSystemService.destroy(id);
        return data;
    }
}
