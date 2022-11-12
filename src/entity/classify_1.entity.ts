import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Stock } from "./stock.entity";

@Entity()
export class Classify_1 extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    @Column()
    create_at: Date;

    @UpdateDateColumn()
    @Column()
    update_at: Date;

    @OneToMany(() => Stock, (stock) => stock.classify_1)
    stocks: Stock[]
}