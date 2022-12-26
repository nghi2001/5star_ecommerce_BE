import { BaseEntity, Column, CreateDateColumn, OneToOne, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { COUPON_STATUS, TypeCoupon as TypeCouponEnum } from 'src/common/enum';

@Entity()
export class Coupon extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column('date')
    expirate_date: Date;

    @Column('date')
    start_date: Date;

    @Column()
    quantity: number;

    @Column({ default: 0 })
    used: number;

    @Column()
    type: TypeCouponEnum;

    @Column()
    discount: number;

    @Column({ nullable: true })
    min_order: number;

    @Column({ default: 0 })
    max_price: number;

    @Column()
    @CreateDateColumn()
    create_at: Date

    @Column()
    @UpdateDateColumn()
    update_at: Date

    @Column({ default: 1 })
    status: COUPON_STATUS

}