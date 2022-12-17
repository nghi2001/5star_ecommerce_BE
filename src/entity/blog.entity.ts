import { BaseEntity, Column, CreateDateColumn, OneToOne, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { Comment } from "./comment.entity";
import { MediaFile } from './media.entity';
import { BLOG_STATUS } from "src/common/enum";
@Entity()
export class Blog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
    @Column()
    content: string;
    @Column({
        nullable: true
    })
    image: number;

    @Column()
    user_id: number;

    @Column({ nullable: true })
    slug: string;

    @Column({ default: BLOG_STATUS.ACTIVE })
    status: BLOG_STATUS;

    @ManyToOne(() => Profile, (profile) => profile.blogs)
    @JoinColumn({ name: "user_id" })
    user: Profile

    @Column()
    @CreateDateColumn()
    create_at: Date

    @Column()
    @UpdateDateColumn()
    update_at: Date

    @OneToMany(() => Comment, (comment) => comment.blog)
    comment: Comment[]

    @OneToOne(() => MediaFile)
    @JoinColumn({ name: 'image' })
    media
}