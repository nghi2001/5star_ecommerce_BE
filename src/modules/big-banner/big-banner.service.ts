import { Injectable, HttpException } from '@nestjs/common';
import { BannerRepository } from './big-banner.repository';
import { CreateBannerDTO } from './dto/createBanner.dto';
import { Types } from 'mongoose';
import { UpdateBannerDTO } from './dto/updateBanner.dto';
import { FileService } from '../file/file.service';
@Injectable()
export class BigBannerService {

    constructor(
        private BannerRepository: BannerRepository,
        private MediaServie: FileService
    ) { }
    async renderCondition(query) {
        let {
            id,
            title,
            sub_title,
            status
        } = query;
        let condition: any = {};
        if (id) {
            condition.id = id
        }
        if (title) {
            condition.title = title
        }
        if (sub_title) {
            condition.sub_title = sub_title
        }
        if (status) {
            condition.status = status
        }
        return condition;
    }

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

    async getAll(filter, pagination = {}) {
        let banners = await this.BannerRepository.getAll(filter, pagination);

        return banners;
    }

    async getOne(id) {
        if (this.checkId(id)) {
            let banner = await this.BannerRepository.getOne(id);

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
    async update(id, data: UpdateBannerDTO) {
        let dataUpdate: UpdateBannerDTO = {};
        if (this.checkId(id)) {
            let banner = await this.BannerRepository.findOneBy({ id });
            if (!banner) {
                throw new HttpException("id not found", 404);
            }
            if (data.image && data.image != banner.image) {
                let checkExits = await this.MediaServie.checkExits(data.image)
                if (!checkExits) throw new HttpException("image not exits", 404);
                dataUpdate.image = data.image
            }
            if (data.status && data.status != banner.status) {
                dataUpdate.status = data.status
            }
            if (data.sub_title && data.sub_title != banner.sub_title) {
                dataUpdate.sub_title = data.sub_title
            }
            if (data.title && data.title != banner.title) {
                dataUpdate.title = data.title
            }
            if (data.link && data.link != banner.link) {
                dataUpdate.link = data.link
            }
            if (Object.keys(dataUpdate).length > 0) {
                await this.BannerRepository.update({ id }, dataUpdate);
            }

            return true;
        }
    }
}
