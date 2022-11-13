import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Banner } from 'src/entity/banner.entity';
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

}