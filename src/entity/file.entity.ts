import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MediaFile extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    file_name: string;

    @Column()
    original_name: string;

    @Column()
    type: string;

    @Column()
    destination: string;

    @Column()
    path: string;

    @Column({ nullable: true })
    @CreateDateColumn()
    create_at: Date;

    @Column({ nullable: true })
    @UpdateDateColumn()
    update_at: Date;
}