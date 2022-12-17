import { Injectable } from '@nestjs/common';
import { BrandRepository } from './brand.repository';

@Injectable()
export class BrandService {
    constructor(
        private BrandRepository: BrandRepository
    ) { }

    constraintColumn() {
        return {
            id: true,
            name: true,
            create_at: true,
            update_at: true
        }
    }
    async renderCondition(query) {
        let {
            status,
            name,
            slug
        } = query;
        let condition: any = {};
        if (status) {
            condition.status = status;
        }
        if (name) {
            condition.name = name;
        }
        if (slug) {
            condition.slug = slug;
        }
        return condition
    }
    async create(brand) {
        let result = await this.BrandRepository.createBrand(brand);
        return result;
    }

    async delete(id: number) {
        let result = await this.BrandRepository.delete({ id });
        return result
    }

    async getAll(filter = {}, pagination = {}, sort = {}) {
        let data = await this.BrandRepository.getList(filter, pagination, sort);
        return data;
    }
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
