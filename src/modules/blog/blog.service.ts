import { Injectable } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { CreateBlogDTO } from './dto/createBlogDTO';

@Injectable()
export class BlogService {

    constructor(
        private BlogRepository: BlogRepository
    ) { }

    async create(blog: CreateBlogDTO) {
        let newBlog = await this.BlogRepository.createBlog(blog);

        return newBlog;
    }

    async findAll() {
        let blogs = await this.BlogRepository.findAndCount({});
        return blogs;
    }
    async findOne(id: number) {
        let blog = await this.BlogRepository.findOneBy({ id });
        return blog;
    }
    async update(id: number, updateData) {
        let result = await this.BlogRepository.update({ id }, updateData);
        return result;
    }
    async delete(id: number) {
        let result = await this.BlogRepository.delete({ id });
        return result;
    }
}
