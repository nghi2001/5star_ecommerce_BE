import { STATUS_COMMENT } from "src/common/enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Blog } from "./blog.entity";
import { Profile } from "./profile.entity";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    body: string;

    @Column({ default: null, nullable: true })
    parent_id: number;

    @Column()
    user_id: number;

    @Column()
    blog_id: number;

    @Column({ default: STATUS_COMMENT.ACTIVE })
    status: STATUS_COMMENT

    @ManyToOne((type) => Comment, (comment) => comment.childComment)
    @JoinColumn({ name: "parent_id" })
    parentComment: Comment;

    @OneToMany((type) => Comment, (comment) => comment.parentComment)
    childComment: Comment[];

    @ManyToOne(() => Blog, (blog) => blog.comment)
    @JoinColumn({ name: 'blog_id' })
    blog: Blog;

    @ManyToOne(() => Profile, (profile) => profile.comments)
    @JoinColumn({ name: "user_id" })
    profile: Profile;
}