import { Injectable } from '@nestjs/common';
import { DataSource,Repository } from 'typeorm';
import { Banner } from 'src/entity/banner.entity';

@Injectable()
export class BannerRepository extends Repository<Banner> {
    constructor(
        private dataSource: DataSource
    ) {
        super(Banner, dataSource.createEntityManager());
    }
    
    
}