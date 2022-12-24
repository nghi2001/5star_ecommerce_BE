import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from 'src/events/events.module';
import { Comment } from '../../entity/comment.entity';
import { BlogModule } from '../blog/blog.module';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';
console.log(BlogModule);

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), EventsModule, forwardRef(() => BlogModule)],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [CommentService]
})
export class CommentModule { }
