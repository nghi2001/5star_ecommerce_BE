import { Injectable } from '@nestjs/common';
import { BrandRepository } from './brand.repository';

@Injectable()
export class BrandService {
    constructor(
        private BrandRepository: BrandRepository
    ) { }

    async create(brand) {
        let result = await this.BrandRepository.createBrand(brand);
        return result;
    }

    async delete(id: number) {
        let result = await this.BrandRepository.delete({ id });
        return result
    }

    // async getAll()
    async getOne(id) {
        let brand = await this.BrandRepository.findOneBy({ id });
        return brand; 8
    }

    async update(id, brand) {
        let newBrand = await this.BrandRepository.update({ id }, brand);
        return newBrand;
    }

    async getBySlug(slug: string) {
        let brand = await this.BrandRepository.findOneBy({ slug: slug });
        return brand;
    }

}
