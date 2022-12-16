import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderDetail } from "./order _detail";
import { Profile } from "./profile.entity";
import { ORDER_STATUS } from 'src/common/enum';
@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    coupon_id: number;

    @Column()
    user_id: number;
    @Column({ type: 'int', nullable: true })
    order_method_id: number

    @Column({ type: 'int', default: ORDER_STATUS.UNPAID })
    order_status: ORDER_STATUS
    @Column({
        nullable: true
    })
    name: string

    @Column({
        nullable: true
    })
    address: string

    @Column({
        nullable: true
    })
    phone: string

    @Column({
        nullable: true
    })
    note: string

    @Column({
        nullable: true
    })
    total: number

    @OneToMany(() => OrderDetail, (order_detail) => order_detail.order, { onDelete: 'CASCADE' })
    details: OrderDetail[]

    @ManyToOne(() => Profile, (profile) => profile.orders)
    @JoinColumn({ name: "user_id" })
    user: Profile
    @Column({ nullable: true })
    @CreateDateColumn()
    create_at: Date;

    @Column({ nullable: true })
    @UpdateDateColumn()
    update_at: Date;
}