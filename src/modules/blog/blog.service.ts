import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { CreateBlogDTO } from './dto/createBlogDTO';
import { UpdateBlogDTO } from './dto/updateBlogDTO';
import { Blog } from './interfaces/blog.interface';

@Injectable()
export class BlogService {

    constructor(
        private BlogRepository: BlogRepository
    ) { }

    async create(blog: CreateBlogDTO, user_id: number) {
        let newBlog = await this.BlogRepository.createBlog(blog, user_id);

        return newBlog;
    }

    async findAll() {
        let blogs = await this.BlogRepository.findAndCount({});
        return blogs;
    }
    async findOne(id: number) {
        let checkBlogExist = await this.checkBlogExist(id);
        if (checkBlogExist) {
            let blog = await this.BlogRepository.findOne({
                where: { id },
                relations: {
                    media: true
                }
            });
            return blog;
        }
    }
    async update(id: number, data: UpdateBlogDTO) {
        let checkBlogExist = await this.checkBlogExist(id);
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
                updateData.image = data.image;
            }
            let result = await this.BlogRepository.update({ id }, { ...updateData });
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
