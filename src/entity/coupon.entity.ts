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

    @Column({ default: 0 })
    used: number;

    @Column()
    type: TypeCoupon;

    @Column()
    discount: number;

    @Column({ nullable: true })
    min_order: number;

    @Column({ nullable: true })
    max_order: number;

    @Column()
    @CreateDateColumn()
    create_at: Date

    @Column()
    @UpdateDateColumn()
    update_at: Date

}