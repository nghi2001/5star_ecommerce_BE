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
        if (Number(id) && id > 0) {
            return true;
        }
        throw new HttpException("not found", 404)
    }
    async createBanner(banner: CreateBannerDTO) {
        let newBanner = await this.BannerRepository.createBanner(banner);
        return newBanner;
    }

    async getAll() {
        let banners = await this.BannerRepository.findAndCount({
            where: {
                status: 1
            }
        });

        return banners;
    }

    async getOne(id) {
        if (this.checkId(id)) {
            let banner = await this.BannerRepository.findOne({
                where: {
                    id: id
                },
                relations: {
                    media: true
                }
            })

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
        if (this.checkId(id)) {
            let result = await this.BannerRepository.createQueryBuilder().update();
            return result;
        }
    }
}
