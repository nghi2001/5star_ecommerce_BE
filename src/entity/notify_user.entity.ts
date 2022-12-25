import { IS_READ } from "src/common/enum/notify.enum";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Notify } from './notify.entity';
import { Profile } from "./profile.entity";

@Entity()
export class Notify_User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    notify_id: number;

    @Column({ default: IS_READ.NO })
    is_read: IS_READ;

    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date;

    @ManyToOne(() => Notify, (notify) => notify.notify_users)
    @JoinColumn({ name: "notify_id" })
    notify: Notify

    @ManyToOne(() => Profile, (profile) => profile.notifys)
    @JoinColumn({ name: "user_id" })
    user: Profile
}