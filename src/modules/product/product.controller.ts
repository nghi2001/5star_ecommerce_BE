import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(
        private ProductService: ProductService
    ){}

    @Post()
    async create(
        @Body(new ValidationPipe()) body: CreateProductDto
    ) {
        let newProduct = await this.ProductService.create(body);
        return newProduct;
    }

    @Get(":id")
    async find(@Param("id") id: number) {
        let product = await this.ProductService.getOne(id);
        return product
    }

    @Delete(":id")
    async destroy(@Param("id") id: number) {
        let result = await this.ProductService.delete(id);
        return result;
    }

    @Put(":id")
    async update(
        @Param("id") id: number,
        @Body(new ValidationPipe() ) body
        ){
            let result = await this.ProductService.update(id, body);
            return result;
        }
}
