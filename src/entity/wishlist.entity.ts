import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
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

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'id_product' })
    products: Product[];

    @ManyToOne(() => Profile)
    @JoinColumn({ name: "id_user" })
    users: Profile[];
}