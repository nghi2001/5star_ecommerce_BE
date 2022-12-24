import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Contact extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name?: string;

    @Column({ nullable: true })
    email: string;
    @Column({ nullable: true })
    address?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    message?: string;
    @Column()
    @CreateDateColumn()
    create_at: Date;

    @Column()
    @UpdateDateColumn()
    update_at: Date
}