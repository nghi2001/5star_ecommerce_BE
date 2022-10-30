import { Injectable, HttpException } from '@nestjs/common';
import { BannerRepository } from './big-banner.repository';
import { CreateBannerDTO } from './dto/createBanner.dto';
import { Types } from 'mongoose';
@Injectable()
export class BigBannerService {

    constructor(
        private BannerRepository: BannerRepository
    ) { }
    checkId(id) {
        if (Types.ObjectId.isValid(id)) {
            return true;
        }
        throw new HttpException("not found", 404)
    }
    async createBanner(banner: CreateBannerDTO) {
        let newBanner = await this.BannerRepository.create(banner);
        return newBanner;
    }

    async getAll() {
        let banners = await this.BannerRepository.find({});

        return banners;
    }

    async getOne(id) {
        if (this.checkId(id)) {
            let banner = await this.BannerRepository.findOne({ _id: id });
            if (!banner) {
                throw new HttpException("not found", 404);
            }
            return banner;
        }
    }

    async deleteOne(id) {
        if (this.checkId(id)) {
            let result = await this.BannerRepository.delete(id);
            return result
        }
    }

    async update(id, banner: CreateBannerDTO) {
        if(this.checkId(id)) {
            let result = await this.BannerRepository.update(id, banner);
            return result;
        }
    }
}
