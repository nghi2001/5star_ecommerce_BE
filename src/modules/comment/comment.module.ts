import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../entity/comment.entity';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [CommentService]
})
export class CommentModule { }
