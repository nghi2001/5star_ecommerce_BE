import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Classify_1 } from "./classify_1.entity";
import { Classify_2 } from "./classify_2.entity";
import { Product } from "./product.entity";


@Entity()
export class Sock extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;
    @Column()
    quantity: number;

    @Column()
    id_product: number;

    @Column()
    id_classify_1: number;

    @Column()
    id_classify_2: number;
    
    @CreateDateColumn()
    @Column()
    create_at: Date;

    @UpdateDateColumn()
    @Column()
    update_at: Date;

    @ManyToOne(() => Product, (product) => product.socks)
    @JoinColumn({name: 'id_product'})
    product: Product

    @ManyToOne(() => Classify_1, (classify_1) => classify_1.socks)
    @JoinColumn({name: 'id_classify_1'})
    classify_1: Classify_1

    @ManyToOne(() => Classify_2, (classify_2) => classify_2.socks)
    @JoinColumn({name: 'id_classify_2'})
    classify_2: Classify_2

}