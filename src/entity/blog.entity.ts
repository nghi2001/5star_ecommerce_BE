import { BaseEntity, Column, CreateDateColumn, OneToOne, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Profile } from "./user.entity";
import { Comment } from "./comment.entity";
import { MediaFile } from './media.entity';
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
    image: string;

    @Column()
    user_id: number;

    @Column({ nullable: true })
    slug: string;

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