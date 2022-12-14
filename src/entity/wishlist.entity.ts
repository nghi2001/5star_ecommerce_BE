import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { Stock } from "./stock.entity";

@Entity()
export class Wishlish extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_user: number;

    @Column()
    id_product: number;

    @ManyToOne(() => Stock)
    @JoinColumn({ name: 'id_product' })
    stocks: Stock[];

    @ManyToOne(() => Profile)
    @JoinColumn({ name: "id_user" })
    users: Profile[];
}