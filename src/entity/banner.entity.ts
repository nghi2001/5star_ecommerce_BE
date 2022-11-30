import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { MediaFile } from './media.entity';

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

    @OneToOne(() => MediaFile)
    @JoinColumn({ name: 'image' })
    media
}