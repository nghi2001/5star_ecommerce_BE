import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wishlish extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_user: number;

    @Column()
    id_product: number;
}