import { TYPE_NOTIFY } from "src/common/enum";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Notify_User } from './notify_user.entity';
@Entity()
export class Notify extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({ nullable: true })
    link?: string;

    @Column()
    type: TYPE_NOTIFY;

    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date;

    @OneToMany(() => Notify_User, (notifyUser) => notifyUser.notify)
    notify_users: Notify_User[]
}