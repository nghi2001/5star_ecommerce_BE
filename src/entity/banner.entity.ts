import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class Banner extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    title: string;

    @Column()
    sub_title: string;

    @Column({ nullable: true })
    image?: string;


    @Column()
    status: number
}