import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order";
@Entity()
export class OrderDetail extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    order_id: number;

    @Column()
    product_id: number;

    @Column('jsonb', { default: {} })
    product_info;
    @Column()
    quantity: number;

    @Column()
    price: number;

    @ManyToOne(() => Order, (order) => order.details)
    @JoinColumn({ name: "order_id" })
    order: Order
}