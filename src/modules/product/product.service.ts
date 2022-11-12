import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { to } from 'src/common/helper/catchError';
import { BrandService } from '../brand/brand.service';
import { CategoryService } from '../category/category.service';
import { Classify_1_Repository } from './classify_1.repository';
import { Classify_2_Repository } from './classify_2.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { StockRepository } from './stock.repository';
import { productWithoutClassify } from './types/productWithoutClassify';

@Injectable()
export class ProductService {

    constructor(
        private ProductRepository: ProductRepository,
        private StockRepository: StockRepository,
        private Classify_1_Repository: Classify_1_Repository,
        private Classify_2_Repository: Classify_2_Repository,
        private BrandService: BrandService,
        private CategoryService: CategoryService
    ) { }

    async createProdWithoutClassify(product: productWithoutClassify) {
        let slugExist = await this.checkSlugExist(product.slug);
        let {
            price,
            quantity,
            ...productDetail
        } = product;
        console.log(product);
        let err = null;
        let checkBrand
        let checkCategory
        [err, checkBrand] = await to(this.BrandService.getOne(productDetail.id_brand));
        [err, checkCategory] = await to(this.CategoryService.getOne(productDetail.id_category));
        if (!checkBrand || !checkCategory) {
            let err = !checkBrand ? 'brand not found' : 'category not found';
            throw new HttpException(err, HttpStatus.NOT_FOUND);
        }

        let newProduct = await this.ProductRepository.createProduct(productDetail);

        let stock = await this.StockRepository.createStock({
            id_product: newProduct.raw[0].id,
            price: price,
            quantity: quantity
        })
        return newProduct
    }
    async checkSlugExist(slug: string) {
        let result = await this.ProductRepository.findOneBy({ slug });
        if (result) {
            throw new HttpException("slug already exist", HttpStatus.CONFLICT);
        }
        return true
    }
    async getAll() {

    }
    async getOne(id: number) {
        let checkId = this.checkId(id);
        if (checkId) {
            let product = await this.ProductRepository.findOneBy({ id });
            if (!product) throw new HttpException("Product not found", 404);
            return product;
        }
    }
    async delete(id: number) {
        let result = await this.ProductRepository.delete({ id });
        return result;
    }
    async update(id: number, update: UpdateProductDto) {

    }

    checkId(id: number) {
        if (!Number(id) || id < 0) {
            throw new HttpException("id invalid", 400)
        }
        return true
    }
}
