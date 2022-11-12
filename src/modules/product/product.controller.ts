import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { productWithoutClassify } from './types/productWithoutClassify';

@Controller('product')
export class ProductController {
    constructor(
        private ProductService: ProductService
    ) { }

    @Post("")
    async create(
        @Body(new ValidationPipe()) body: CreateProductDto
    ) {
        if (!body.isClassify_1) {
            let {
                classify_1,
                classify_2,
                isClassify_1,
                isClassify_2,
                variable_attribute,
                ...dataInsert
            } = body;

            let resultProduct = await this.ProductService.createProdWithoutClassify((dataInsert as productWithoutClassify));
            let product = await this.ProductService.getOne(resultProduct.raw[0].id);
            console.log(resultProduct.raw[0].id);

            return product;
        } else {

        }

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
        @Body(new ValidationPipe()) body
    ) {
        let result = await this.ProductService.update(id, body);
        return result;
    }
}
