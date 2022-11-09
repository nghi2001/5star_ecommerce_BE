import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
    constructor(
        private ProductRepository: ProductRepository
    ){}

    async create( product: CreateProductDto){
        let newProduct = await this.ProductRepository.createProduct(product);
        return newProduct;
    }
    async getAll() {
        
    }
    async getOne(id: number) {
        
    }
    async delete(id: number) {
        let result = await this.ProductRepository.delete({id});
        return result;
    }
    async update(id: number, update: UpdateProductDto) {

    }
}
