import { BaseEntity, Column, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Blog } from "./blog.entity";
import { Profile } from "./user.entity";

export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    body: string;

    @Column({ default: null })
    parent_id: number;

    @Column()
    user_id: number;

    @Column()
    blog_id: number;

    @ManyToOne((type) => Comment, (comment) => comment.childComment)
    parentComment: Comment;

    @OneToMany((type) => Comment, (comment) => comment.parentComment)
    childComment: Comment[];

    @ManyToOne(() => Blog, (blog) => blog.comments)
    @JoinColumn({ name: 'blog_id' })
    blog: Blog;

    @ManyToOne(() => Profile, (profile) => profile.comments)
    @JoinColumn({ name: "user_id" })
    profile: Profile;
}