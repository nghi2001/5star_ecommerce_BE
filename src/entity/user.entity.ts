import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Blog } from './blog.entity';
import { Comment } from './comment.entity';
import { MediaFile } from './file.entity';
@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    first_name: string;

    @Column({ nullable: true })
    last_name: string;
    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    gender: string;

    @Column('text', { array: true, nullable: true })
    address: string[];

    @Column({ nullable: true })
    avatar_id: number;
    @Column({ nullable: true, default: false })
    is_active: boolean;

    @Column({ nullable: true })
    @CreateDateColumn()
    create_at: Date;

    @Column({ nullable: true })
    @UpdateDateColumn()
    update_at: Date;

    @OneToMany(() => Blog, (blog) => blog.user)
    blogs: Blog[];

    @OneToMany(() => Comment, (comment) => comment.profile)
    comments: Comment[];

    @OneToOne(type => MediaFile)
    @JoinColumn({ name: "avatar_id" })
    avatar: MediaFile
}