import { BaseEntity, Column, CreateDateColumn, OneToOne, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TypeCoupon {
    PERCENT = 1,
    CASH = 2
}
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

    @Column()
    type: TypeCoupon;

    @Column()
    discount: number;

    @Column()
    @CreateDateColumn()
    create_at: Date

    @Column()
    @UpdateDateColumn()
    update_at: Date

}