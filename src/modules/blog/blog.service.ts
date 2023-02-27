import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { to } from 'src/common/helper/catchError';
import { ILike } from 'typeorm';
import { FileService } from '../file/file.service';
import { BlogRepository } from './blog.repository';
import { CreateBlogDTO } from './dto/createBlogDTO';
import { UpdateBlogDTO } from './dto/updateBlogDTO';
import { Blog } from './interfaces/blog.interface';

@Injectable()
export class BlogService {

    constructor(
        private BlogRepository: BlogRepository,
        private FileService: FileService
    ) { }

    constraintColumn() {
        return {
            id: true,
            views: true,
            create_at: true,
            update_at: true
        }
    }
    async renderCondition(query) {
        let {
            content,
            title,
            slug,
            user_id,
            status
        } = query;
        let condition: any = {}
        // if (content) {
        //     condition.content = content;
        // }
        if (title) {
            condition.title = title
        }
        if (slug) {
            condition.slug = slug;
        }
        if (user_id) {
            condition.user_id = user_id;
        }
        if (status) {
            condition.status = status;
        }
        console.log(condition);

        return condition
    }
    async create(blog: CreateBlogDTO, user_id: number) {
        if (blog.image) {
            let checkExist = await this.FileService.getOne(blog.image);
            if (!checkExist) {
                throw new HttpException("Image not found", 404)
            }
            let checkData = await this.BlogRepository.findOne({
                where: {
                    image: blog.image
                }
            })
            if (checkData) {
                throw new HttpException("Image duplicate", 409);
            }
        }
        let newBlog = await this.BlogRepository.createBlog(blog, user_id);

        return newBlog;
    }

    async findAll(filter = {}, pagination = {}, order = {}) {
        let blogs = await this.BlogRepository.getAll(filter, pagination, order);
        return blogs;
    }
    async findOne(id: number) {
        let checkBlogExist = await this.checkBlogExist(id);
        if (checkBlogExist) {
            let blog = await this.BlogRepository.getOne(id);
            return blog;
        }
    }

    async getOneBySlug(slug: string) {
        let blog = await this.BlogRepository.getOneBySlug(slug);
        if (!blog) {
            throw new HttpException("Blog not found", 404);
        }
        return blog
    }
    async update(id: number, data: UpdateBlogDTO) {
        let checkBlogExist = await this.checkBlogExist(id);
        let oldImage = null;
        if (checkBlogExist) {
            let blog = await this.findOne(id);
            let updateData: Blog = {};
            if (data.body && data.body != blog.content) {
                updateData.content = data.body;
            }
            if (data.title && data.title != blog.title) {
                updateData.title = data.title;
            }
            if (data.image && data.image != blog.image) {
                let checkData = await this.FileService.getOne(data.image);
                if (!checkData) {
                    throw new HttpException("image not exist", 404);
                }
                updateData.image = data.image;
                oldImage = data.image;
            }
            if (data.slug && data.slug != blog.slug) {
                updateData.slug = data.slug
            }
            if (data.status && data.status != blog.status) {
                updateData.status = data.status;
            }
            if (data.content && data.content != blog.content) {
                updateData.content = data.content;
            }

            let [err, result] = await to(this.BlogRepository.update({
                id: id
            }, updateData));
            if (err) {
                console.log("Err Update Blog:", err);
                throw new HttpException("Can't update blog", 500);
            }
            // let [errDeleteFile, deletefile] = await to(this.FileService.deleteFile(oldImage));
            // if (errDeleteFile) {
            //     console.log(errDeleteFile);

            // }
            return result;
        }
    }
    async delete(id: number) {
        let checkBlogExist = await this.checkBlogExist(id);
        if (checkBlogExist) {
            let result = await this.BlogRepository.delete({ id });
            return result;
        }
    }

    async checkId(id: number) {
        if (!Number(id) || id < 0) {
            throw new HttpException("id invalid", HttpStatus.BAD_REQUEST)
        }
        return true;
    }
    async checkBlogExist(id: number) {
        let [err] = await this.checkId(id).then(result => [null, result]).catch(err => [err, null]);
        if (err) throw new HttpException("id invalid", HttpStatus.BAD_REQUEST);
        let blog = await this.BlogRepository.findOneBy({ id });
        if (blog) {
            return true
        }
        throw new HttpException("blog not found", HttpStatus.NOT_FOUND);
    }
}
