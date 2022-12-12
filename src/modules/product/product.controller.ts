import { Body, CacheInterceptor, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update_stock.dto';
import { ProductService } from './product.service';
import { productWithoutClassify } from './types/productWithoutClassify';
import { FileService } from '../file/file.service';
import { MediaFile } from 'src/entity/media.entity';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('product')
@UseInterceptors(CacheInterceptor)
export class ProductController {
    constructor(
        private ProductService: ProductService,
        private MediaService: FileService
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post("")
    async create(
        @Body(new ValidationPipe()) body: CreateProductDto
    ) {
        let images = [];
        let product = null;
        if (body.images) {
            images = await Promise.all(body.images.map(async (id_image) => {
                if (!Number(id_image)) throw new HttpException("id image invalid", 400);
                return await this.MediaService.getOne(Number(id_image));
            }))

            body.images = images
        }

        if (!body.isClassify_1) {
            let {
                classify_1,
                classify_2,
                isClassify_1,
                isClassify_2,
                variable_attribute,
                ...dataInsert
            } = body;

            let resultProduct = await this.ProductService.createProdWithoutClassify((dataInsert as unknown as productWithoutClassify));
            product = await this.ProductService.getOne(resultProduct.raw[0].id);

            await this.ProductService.update(product.id, { images: body.images });
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
                if (classify_2[0].attribute.length > 0) {
                    classifys_2 = await this.ProductService.createClassify2(classify_2);
                }
            }
            product = await this.ProductService.createProduct(productDetail)
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

            await this.ProductService.update(product.id, { images: body.images });
            return newStock;
        }

    }

    @Get(":idSlug")
    async find(@Param("idSlug") idSlug: string) {
        let id = Number(idSlug);
        let product = null;
        if (id) {
            product = await this.ProductService.getOneProduct(id);
        } else {
            product = await this.ProductService.getBySlug(idSlug);
        }
        return product
    }
    @Get("")
    async shows() {
        let products = await this.ProductService.getAll();
        return products
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete("/stock/:id")
    async destroyStock(@Param("id") id: number) {
        let result = await this.ProductService.deleteStock(id);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(":id")
    async destroy(@Param("id") id: number) {
        let result = await this.ProductService.delete(id);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put("/stock/:id")
    async updateStock(
        @Param("id") id: number,
        @Body(new ValidationPipe()) body: UpdateStockDto
    ) {
        let result = await this.ProductService.updateStock(id, body);
        if (result.effected == 0) {
            return 0;
        }
        return 1;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put(":id")
    async update(
        @Param("id") id: number,
        @Body(new ValidationPipe()) body: UpdateProductDto
    ) {
        let images = [];
        if (body.images) {
            images = await Promise.all(body.images.map(async (id_image) => {
                if (!Number(id_image)) throw new HttpException("id image invalid", 400);
                return await this.MediaService.getOne(Number(id_image));
            }))

            body.images = images
        }

        let result = await this.ProductService.update(id, body);

        return result;
    }
}
