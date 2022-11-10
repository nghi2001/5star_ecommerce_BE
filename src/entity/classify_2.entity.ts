import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Sock } from "./sock.entity";

@Entity()
export class Classify_2 extends BaseEntity{
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

    @OneToMany(() => Sock, (sock) => sock.classify_2)
    socks: Sock[]
}