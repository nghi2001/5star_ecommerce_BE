import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Classify_1 } from "./classify_1.entity";
import { Classify_2 } from "./classify_2.entity";
import { Product } from "./product.entity";


@Entity()
export class Stock extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;
    @Column()
    quantity: number;

    @Column()
    id_product: number;

    @Column({ nullable: true })
    id_classify_1: number;

    @Column({ nullable: true })
    id_classify_2: number;


    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date;

    @ManyToOne(() => Product, (product) => product.stocks)
    @JoinColumn({ name: 'id_product' })
    product: Product

    @ManyToOne(() => Classify_1, (classify_1) => classify_1.stocks)
    @JoinColumn({ name: 'id_classify_1' })
    classify_1: Classify_1

    @ManyToOne(() => Classify_2, (classify_2) => classify_2.stocks)
    @JoinColumn({ name: 'id_classify_2' })
    classify_2: Classify_2

}