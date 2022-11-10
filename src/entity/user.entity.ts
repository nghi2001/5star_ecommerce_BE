import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Blog } from './blog.entity';
import { Comment } from './comment.entity';
@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;
    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    gender: string;

    @Column('text', { array: true })
    address: string[];

    @Column({ default: false })
    is_active: boolean;

    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date;

    @OneToMany(() => Blog, (blog) => blog.user)
    blogs: Blog[];

    @OneToMany(() => Comment, (comment) => comment.profile)
    comments: Comment[];
}