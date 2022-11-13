import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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
            let {
                classify_1,
                classify_2,
                variable_attribute,
                isClassify_1,
                isClassify_2,
                ...productDetail
            } = body;
            await this.ProductService.checkSlugExist(productDetail.slug);
            let classifys_1 = await this.ProductService.createClassify1(classify_1);
            let classifys_2
            if (classify_2.length > 0) {
                classifys_2 = await this.ProductService.createClassify2(classify_2);
            }
            let product = await this.ProductService.createProduct(productDetail)
            let stockInsert = [];
            if (!classifys_2) {
                classifys_2 = []
                classifys_2[0] = {}
            }
            for (let j = 0; j < classifys_2.length; j++) {
                for (let k = 0; k < classifys_1.length; k++) {
                    let price = variable_attribute[j]['price'][classify_1[k].attribute];
                    let quantity = variable_attribute[j]['quantity'][classify_1[k].attribute]

                    let stock = {
                        id_product: product.id,
                        id_classify_1: classifys_1[k].id,
                        id_classify_2: classifys_2[j].id || null,
                        quantity,
                        price
                    }
                    stockInsert.push(stock)
                }
            }
            let newStock = await this.ProductService.createStock(stockInsert);
            return newStock;
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
        @Body(new ValidationPipe()) body: UpdateProductDto
    ) {
        let result = await this.ProductService.update(id, body);
        if (result.affected == 0) {
            return 0
        }
        return 1;
    }
}
