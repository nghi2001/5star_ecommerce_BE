import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Between, LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { to } from '../../common/helper/catchError';
import { BrandService } from '../brand/brand.service';
import { CategoryService } from '../category/category.service';
import { Classify_1_Repository } from './classify_1.repository';
import { Classify_2_Repository } from './classify_2.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update_stock.dto';
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

    contraintsColumn() {
        return {
            id: true,
            name: true,
            sold: true,
            views: true,
            create_at: true,
            // price: true
        }
    }
    async renderCondition(query) {
        let {
            id,
            slug,
            name,
            id_brand,
            id_category,
            price_from,
            price_to
        } = query;
        let condition: any = {};
        if (id) {
            condition['product.id'] = id;
        }
        if (id_brand) {
            condition['product.id_brand'] = id_brand;
        }
        if (id_category) {
            condition['product.id_category'] = id_category;
        }
        if (slug) {
            condition['product.slug'] = slug;
        }
        if (name) {
            condition['product.name'] = name;
        }
        if (price_from) {
            condition['stock.price'] = {};
            condition['stock.price']['operator'] = '>=';
            condition['stock.price']['value'] = price_from
        }
        if (price_to) {
            condition['stock.price'] = {};
            condition['stock.price']['operator'] = '<=';
            condition['stock.price']['value'] = price_to
        }
        if (price_from && price_to) {
            condition['stock.price'] = {}
            condition['stock.price']['raw'] = `stock.price BETWEEN :from AND :to`;
            condition['stock.price']['value'] = {
                from: price_from,
                to: price_to
            };


        }
        return condition
    }
    async createProdWithoutClassify(product: productWithoutClassify) {
        let slugExist = await this.checkSlugExist(product.slug);
        let {
            price,
            quantity,
            ...productDetail
        } = product;
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
    async getAll(filter = {}, paginaton = {}, sort = {}) {
        let data = await this.ProductRepository.getList(filter, paginaton, sort);
        return data;
    }
    async getOne(id: number) {
        let checkId = this.checkId(id);
        if (checkId) {
            let product = await this.ProductRepository.findOneBy({ id });
            if (!product) throw new HttpException("Product not found", 404);
            return product;
        }
    }
    async getOneProduct(id: number) {
        let checkProdExist = await this.checkProdExist(id);
        if (checkProdExist) {
            let product = await this.ProductRepository.getOneProduct(id);
            return product
        }
    }
    async delete(id: number) {
        let result = await this.ProductRepository.delete({ id });
        return result;
    }
    async update(id: number, update: UpdateProductDto) {

        let [err, product] = await to(this.ProductRepository.findOneBy({ id }));
        if (err) throw new HttpException("Update Product", 500);
        if (product) {
            let {
                description,
                id_brand,
                id_category,
                images,
                name,
                slug,
                status
            } = update;

            if (description && description != product.description) {
                product.description = description;
            }
            if (id_brand && id_brand != product.id_brand) {
                product.id_brand = id_brand;
            }
            if (id_category && id_category != product.id_category) {
                product.id_category = id_category;
            }
            if (name && name != product.name) {
                product.name = name;
            }
            if (slug && slug != product.slug) {
                product.slug = slug;
            }
            if (status && status != product.status) {
                product.status = status;
            }
            product.images = images
            let result = await product.save()

            return result
        }
        return 0;
    }

    async updateStock(id: number, updateDate: UpdateStockDto) {
        let checkStock = await this.checkStockExist(id);
        if (checkStock) {
            let {
                price,
                quantity
            } = updateDate;
            let dataInsert: UpdateStockDto = {};
            if (price && price != checkStock.price) {
                dataInsert.price = price;
            }
            if (quantity && quantity != checkStock.quantity) {
                dataInsert.quantity = quantity;
            }
            let [err, updateResult] = await to(this.StockRepository.update({ id }, dataInsert));
            if (err) console.log(err);
            return updateResult;

        }
    }

    async checkId(id: number) {
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

    async checkProdExist(id: number) {
        let [err] = await (this.checkId(id).then(result => [null, result]).catch(err => [err, null]));
        if (err) {
            throw new HttpException("id invalid", 400);
        }
        let product = await this.ProductRepository.checkproductExist(id);
        if (!product) {
            throw new HttpException("product not found", 404);
        }
        return product;

    }
    async checkStockExist(id: number) {
        let [err] = await (this.checkId(id).then(result => [null, result]).catch(err => [err, null]));
        if (err) {
            throw new HttpException("id invalid", 400);
        }
        let stock = await this.StockRepository.findOneBy({ id });
        if (!stock) {
            throw new HttpException("stock not found", 404);
        }
        return stock;

    }
    async deleteStock(id: number) {
        let checkStock = await this.checkStockExist(id);
        if (checkStock) {
            let result = await this.StockRepository.delete({ id });
            return result;
        }

    }

    async getStockById(id: number) {
        if (this.checkId(id)) {
            let productStock = await this.StockRepository.getStockById(id);
            return productStock;
        }
    }

    async getBySlug(slug: string) {
        let data = await this.ProductRepository.getOneProductBySlug(slug);
        if (!data) {
            throw new HttpException("Product not found", 404)
        }
        return data;
    }
}
