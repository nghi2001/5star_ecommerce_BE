import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Banner } from '../../entity/banner.entity';
import { CreateBannerDTO } from './dto/createBanner.dto';

@Injectable()
export class BannerRepository extends Repository<Banner> {
    constructor(
        private dataSource: DataSource
    ) {
        super(Banner, dataSource.createEntityManager());
    }

    async createBanner(banner: CreateBannerDTO) {
        let result = await this.createQueryBuilder()
            .insert()
            .into(Banner)
            .values([banner])
            .execute();
        return result
    }

    async getAll(filter = {}, pagination = {}) {
        // console.log(filter);

        let data = await this.find({
            where: filter,
            relations: {
                media: true
            },
            ...pagination
        });
        let total = await this.count({
            where: filter
        })
        return {
            data: data,
            total: total
        }
    }

    async getOne(id: number) {
        let data = await this.findOne({
            where: {
                id: id
            },
            relations: {
                media: true
            }
        })
        return data;
    }
}