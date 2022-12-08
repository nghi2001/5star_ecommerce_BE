import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderDetail } from "./order _detail";

export enum ORDER_STATUS {
    PAID = 1,
    UNPAID = 2
}
@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'jsonb', nullable: true })
    user_info: any;

    @Column({ nullable: true })
    coupon_id: number;

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
}