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
import { classify_1 } from './types/classify1';
import { classify_2 } from './types/classify2';
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
    async getClassify1(id: number) {
        let classify1 = await this.Classify_1_Repository.findOneBy({ id });
        return classify1;
    }

    async getClassify2(id: number) {
        let classify2 = await this.Classify_2_Repository.findOneBy({ id });
        return classify2;
    }
    async createClassify1(classify1: classify_1[]) {
        let result = await this.Classify_1_Repository.createClassify1(classify1);
        let classifys_1 = [];
        for (let i = 0; i < result.raw.length; i++) {
            let classify = await this.getClassify1(result.raw[i].id);
            classifys_1.push(classify);
        }
        return classifys_1
    }

    async createClassify2(classify2: classify_2[]) {
        let [err, result] = await to(this.Classify_2_Repository.createClassify2(classify2));
        if (err) console.log(err);

        let classifys_2 = [];
        for (let i = 0; i < result.raw.length; i++) {
            let classify = await this.getClassify2(result.raw[i].id);
            classifys_2.push(classify);
        }
        return classifys_2
    }

    async createProduct(productInsert) {
        let newProduct = await this.ProductRepository.createProduct(productInsert);
        let product = await this.getOne(newProduct.raw[0].id);
        return product
    }

    async createStock(stockInsert) {
        let result = await this.StockRepository.createManyStock(stockInsert);
        return result;
    }
}
