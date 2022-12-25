import { Role } from 'src/common/enum';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Blog } from './blog.entity';
import { Comment } from './comment.entity';
import { MediaFile } from './media.entity';
import { Notify_User } from './notify_user.entity';
import { Order } from './order';
import { Rating } from './rating.entity';
@Entity()
export class Profile extends BaseEntity {
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

    @Column({
        type: 'enum',
        enum: Role,
        array: true,
        default: [Role.USER]
    })
    roles: Role[]

    @Column('jsonb', { default: {} })
    address: any;

    @Column({ nullable: true })
    avatar_id: number;
    @Column({ nullable: true, default: true })
    is_active: boolean;

    @Column({ nullable: true })
    birth_day: string;

    @Column({ nullable: true })
    @CreateDateColumn()
    create_at: Date;

    @Column({ nullable: true })
    @UpdateDateColumn()
    update_at: Date;

    @OneToMany(() => Blog, (blog) => blog.user)
    blogs: Blog[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]
    @OneToMany(() => Comment, (comment) => comment.profile)
    comments: Comment[];

    @OneToOne(type => MediaFile)
    @JoinColumn({ name: "avatar_id" })
    avatar: MediaFile;

    @OneToMany(() => Rating, (rating) => rating.user)
    ratings: Rating[];

    @OneToMany(() => Notify_User, (notifyUser) => notifyUser.user)
    notifys: Notify_User[]
}