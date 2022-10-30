import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Banner } from './entities/banner.entities';
import { Model } from 'mongoose';
import { BaseRepository } from "src/common/base/BaseRepository";

@Injectable()
export class BannerRepository extends BaseRepository<Banner> {
    constructor(
        @InjectModel(Banner.name) BannerModel: Model<Banner>
    ) {
        super(BannerModel)
    }

    
}