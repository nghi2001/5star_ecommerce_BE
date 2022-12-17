import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '..//../entity/blog.entity';
import { CommentModule } from '../comment/comment.module';
import { FileModule } from '../file/file.module';
import { BlogController } from './blog.controller';
import { BlogRepository } from './blog.repository';
import { BlogService } from './blog.service';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), CommentModule, FileModule],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository]
})
export class BlogModule { }
